'use server';

import { startOfDay, subDays } from 'date-fns';
import Joi from 'joi';
import { headers } from 'next/headers';
import invariant from 'ts-invariant';
import { In } from 'typeorm';

import { deleteOrderCookie, getOrderCookie, setOrderCookie } from '@/actions';
import { Breed, User } from '@/entities';
import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import {
  AddOrderDiscountDocument,
  CompleteDraftOrderDocument,
  CreateDraftOrderDocument,
  DeleteDraftOrderDocument,
  DiscountValueTypeEnum,
  FindUserDocument,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderFragment,
} from '@/gql/graphql';
import { awaitable } from '@/helpers/async';
import { calculateRecipeTotalProtionsInBox, getTheCheapestRecipe } from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { recipeToVariant } from '@/helpers/saleor';
import {
  getRecurringBoxMinDeliveryDate,
  isLegalDeliveryDate,
  isOperationDate,
} from '@/helpers/shipment';
import { redirect } from '@/navigation';
import { subscriptionProducts } from '@/products';
import {
  calculateTotalPerDayPrice,
  calculateTotalPriceInBox,
  findProducts,
  getThrowableChannel,
  updateDraftOrder,
  updateOrderAddress,
  upsertUser,
} from '@/services/api';
import { getCalendarEvents } from '@/services/calendar';
import { setupRecurringBox } from '@/services/recurring';
import {
  deleteStoreKeys,
  getStoreDeliveryDate,
  getStoreDogs,
  getStorePaymentIntent,
  setStoreDeliveryDate,
  setStoreDogs,
  setStoreEmail,
  setStorePaymentIntent,
} from '@/services/redis';
import {
  attachPaymentMethod,
  createCustomer,
  retrivePaymentIntent,
  updatePaymentIntent,
} from '@/services/stripe';
import { BreedDto, DogDto, MinPricesDto } from '@/types/dto';

export async function isAvailableEmailAddress(email: string) {
  const { user } = await executeGraphQL(FindUserDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      email,
    },
  });

  if (!user) {
    return true;
  }

  const exists = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.exists(User, { where: { id: user.id } });
  });

  return !exists;
}

export async function calculateDogsTotalPerDayPrice(dogs: DogDto[]) {
  const values = [];
  for (const dog of dogs) {
    const breeds =
      dog.breeds && dog.breeds.length > 0
        ? await executeQuery(async (queryRunner) => {
            return queryRunner.manager.find(Breed, {
              where: {
                id: In(dog.breeds!),
              },
            });
          })
        : [];
    const price = await calculateTotalPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: dog.recipe1, recipe2: dog.recipe2 },
      dog.mealPlan,
      Frequency.TwoWeek,
      true
    );
    values.push({ name: dog.name, price });
  }
  return values;
}

export async function getBoxPrices(
  breeds: BreedDto[],
  dateOfBirth: string,
  isNeutered: boolean,
  weight: number,
  bodyCondition: BodyCondition,
  activityLevel: ActivityLevel,
  { recipe1, recipe2 }: { recipe1?: Recipe; recipe2?: Recipe },
  mealPlan: MealPlan
) {
  if (!recipe1) {
    return {
      total: 0,
      daily: 0,
    };
  }
  return {
    total: await calculateTotalPriceInBox(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      true
    ),
    daily: await calculateTotalPerDayPrice(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      true
    ),
  };
}

export async function getMinPerDayPrice(
  dog: Pick<
    DogDto,
    'breeds' | 'dateOfBirth' | 'isNeutered' | 'weight' | 'bodyCondition' | 'activityLevel'
  >
): Promise<MinPricesDto> {
  const breeds =
    dog.breeds && dog.breeds.length > 0
      ? await executeQuery(async (queryRunner) => {
          return queryRunner.manager.find(Breed, {
            where: {
              id: In(dog.breeds!),
            },
          });
        })
      : [];
  return {
    halfPlan: await calculateTotalPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: getTheCheapestRecipe() },
      MealPlan.Half,
      Frequency.TwoWeek,
      true
    ),
    fullPlan: await calculateTotalPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: getTheCheapestRecipe() },
      MealPlan.Full,
      Frequency.TwoWeek,
      true
    ),
  };
}

async function getOrder(): Promise<OrderFragment> {
  const orderId = await getOrderCookie();

  if (!orderId) {
    throw new Error('order id cannot be found');
  }

  const { order } = await executeGraphQL(GetOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { id: orderId },
  });

  if (!order) {
    throw new Error('order not found');
  }

  return order;
}

export async function createDraftOrder(dogs: DogDto[]) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const channel = await getThrowableChannel();

  const productSlugsToBeAddToLine = [];

  for (const dog of dogs) {
    const slug1 = subscriptionProducts[dog.recipe1].slug;
    const slug2 = dog.recipe2 ? subscriptionProducts[dog.recipe2].slug : undefined;

    if (productSlugsToBeAddToLine.indexOf(slug1) === -1) {
      productSlugsToBeAddToLine.push(slug1);
    }

    if (slug2 && productSlugsToBeAddToLine.indexOf(slug2) === -1) {
      productSlugsToBeAddToLine.push(slug2);
    }
  }

  // make sure the settings of saleor is ready for create checkout
  const products = await findProducts({
    channel: process.env.SALEOR_CHANNEL_SLUG,
    where: {
      slug: {
        oneOf: productSlugsToBeAddToLine,
      },
    },
  });

  if (products.length !== productSlugsToBeAddToLine.length) {
    throw new Error('cannot find the products to process the checkout action');
  }

  // setup products
  const lines = [];

  for (const dog of dogs) {
    const breeds =
      dog.breeds && dog.breeds.length > 0
        ? await executeQuery(async (queryRunner) => {
            return queryRunner.manager.find(Breed, {
              where: {
                id: In(dog.breeds!),
              },
            });
          })
        : [];
    const dateOfBirth = new Date(dog.dateOfBirth);
    const recipe1Variant = recipeToVariant(products, breeds, dateOfBirth, dog.recipe1);
    if (!recipe1Variant) {
      throw new Error('failed to add recipe 1 to checkout, variant not found');
    }
    const recipe1TotalProtions = calculateRecipeTotalProtionsInBox(
      breeds,
      dateOfBirth,
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipeToBeCalcuate: dog.recipe1, recipeReference: dog.recipe2 },
      dog.mealPlan,
      Frequency.TwoWeek,
      dog.isEnabledTransitionPeriod
    );
    lines.push({
      variantId: recipe1Variant.id,
      quantity: Math.ceil(recipe1TotalProtions),
    });
    if (dog.recipe2) {
      const recipe2Variant = recipeToVariant(products, breeds, dateOfBirth, dog.recipe2);
      if (!recipe2Variant) {
        throw new Error('failed to add recipe 2 to checkout, variant not found');
      }
      const recipe2TotalProtions = calculateRecipeTotalProtionsInBox(
        breeds,
        dateOfBirth,
        dog.isNeutered,
        dog.weight,
        dog.bodyCondition,
        dog.activityLevel,
        { recipeToBeCalcuate: dog.recipe2, recipeReference: dog.recipe1 },
        dog.mealPlan,
        Frequency.TwoWeek,
        dog.isEnabledTransitionPeriod
      );
      lines.push({
        variantId: recipe2Variant.id,
        quantity: Math.ceil(recipe2TotalProtions),
      });
    }
  }

  // create draft order
  const { draftOrderCreate } = await executeGraphQL(CreateDraftOrderDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      input: {
        channelId: channel.id,
        lines,
      },
    },
  });

  if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
    draftOrderCreate && console.error(draftOrderCreate?.errors);
    throw new Error('create draft order failed');
  }

  const order = draftOrderCreate.order!;

  // setup starter box discount
  const { orderDiscountAdd } = await executeGraphQL(AddOrderDiscountDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      id: order.id,
      input: {
        valueType: DiscountValueTypeEnum.Percentage,
        value: 50,
        reason: '50% Off Starter Box',
      },
    },
  });

  if (!orderDiscountAdd || orderDiscountAdd.errors.length > 0) {
    orderDiscountAdd && console.error(orderDiscountAdd?.errors);
    throw new Error('add starter box discount failed');
  }

  await setStoreDogs(order.id, dogs);

  const prevOrderId = await getOrderCookie();

  if (prevOrderId) {
    // try to delete prev draft order, slient mode
    try {
      const { draftOrderDelete } = await executeGraphQL(DeleteDraftOrderDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          id: prevOrderId,
        },
      });

      if (!draftOrderDelete || draftOrderDelete.errors.length > 0) {
        draftOrderDelete && console.error(draftOrderDelete?.errors);
      }
    } catch (e) {
      console.error(e);
    }
  }

  await setOrderCookie(order.id);

  return orderDiscountAdd.order!;
}

export async function initializeStripeTranscation() {
  const order = await getOrder();

  const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
    variables: {
      checkoutOrOrderId: order.id,
      paymentGateway: {
        id: getStripeAppId(),
        data: {
          automatic_payment_methods: {
            enabled: true,
          },
          setup_future_usage: 'off_session',
        },
      },
    },
  });

  if (!transactionInitialize || transactionInitialize.errors.length > 0) {
    transactionInitialize && console.error(transactionInitialize);
    throw new Error('cannot initialize transaction');
  }

  const paymentIntent = await retrivePaymentIntent(transactionInitialize.transaction!.pspReference);

  await setStorePaymentIntent(order.id, paymentIntent.id);

  return transactionInitialize.data as {
    paymentIntent: { client_secret: string };
    publishableKey: string;
  };
}

export async function applyCoupon({ coupon }: { coupon: string }) {
  const order = await getOrder();

  await updateDraftOrder({
    id: order.id,
    input: {
      voucherCode: coupon,
    },
  });
}

async function findOrCreateUser({
  firstName,
  lastName,
  email,
  phone,
  whatsapp,
  password,
  isDeliveryUsAsBillingAddress,
  channel,
  redirectUrl,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp?: { code: string; value: string };
  password: string;
  isDeliveryUsAsBillingAddress: boolean;
  channel: string;
  redirectUrl: string;
}) {
  const saleorUser = await upsertUser(firstName, lastName, email, password, channel, redirectUrl);

  const user = await executeQuery(async (queryRunner) => {
    const entity = await queryRunner.manager.findOne(User, { where: { id: saleorUser.id } });

    if (!entity) {
      const user = queryRunner.manager.create(User, {
        id: saleorUser.id,
        phone,
        whatsapp,
        isDeliveryUsAsBillingAddress,
      });
      await queryRunner.manager.save(user);
      return user;
    } else {
      entity.isDeliveryUsAsBillingAddress = isDeliveryUsAsBillingAddress;
      await queryRunner.manager.save(entity);
      return entity;
    }
  });

  return { ...saleorUser, ...user };
}

interface Address {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
}

interface HandleMutateDraftOrderAction {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: {
    code: string;
    value: string;
  };
  whatsapp?: {
    code: string;
    value: string;
  };
  receiveNews?: boolean;
  isSameBillingAddress?: boolean;
  deliveryDate: Date;
  tnc: boolean;
  deliveryAddress: Address;
  billingAddress?: Address;
}

const addressSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  streetAddress1: Joi.string().required(),
  streetAddress2: Joi.string().required().allow(''),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
});

const schema = Joi.object<HandleMutateDraftOrderAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).required(),
  whatsapp: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).optional(),
  receiveNews: Joi.boolean().optional(),
  isSameBillingAddress: Joi.boolean().optional(),
  deliveryDate: Joi.date().required(),
  tnc: Joi.boolean().required(),
  deliveryAddress: addressSchema.required(),
  billingAddress: addressSchema,
});

export async function handleMutateDraftOrder(data: HandleMutateDraftOrderAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const headersList = headers();
  const origin = headersList.get('origin');
  const { value, error } = schema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const order = await getOrder();
  const paymentIntent = await getStorePaymentIntent(order.id);

  const calendarEvents = await getCalendarEvents();

  if (!paymentIntent) {
    throw new Error('payment intent not found');
  }

  if (
    !isOperationDate(subDays(value.deliveryDate, 1), calendarEvents) ||
    !isLegalDeliveryDate(value.deliveryDate, calendarEvents) ||
    getRecurringBoxMinDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  await setStoreEmail(order.id, value.email);
  await setStoreDeliveryDate(order.id, value.deliveryDate);

  const user = await findOrCreateUser({
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    phone: value.phone,
    whatsapp: value.whatsapp,
    password: value.password,
    isDeliveryUsAsBillingAddress: value.isSameBillingAddress ?? false,
    channel: process.env.SALEOR_CHANNEL_SLUG,
    redirectUrl: `${origin}/auth/verify-email`,
  });

  if (!order.user) {
    await updateDraftOrder({
      id: order.id,
      input: {
        user: user.id,
      },
    });
  } else if (order.user.id !== user.id) {
    throw new Error('incorrect user id of the current draft order');
  }

  await updateOrderAddress(
    order.id,
    value.deliveryAddress,
    value.isSameBillingAddress ? undefined : value.billingAddress!
  );

  // link stripe customer to user
  if (user.stripe) {
    await updatePaymentIntent(paymentIntent, { customer: user.stripe });
  } else {
    const cus = await createCustomer({ email: value.email });
    await executeQuery(async (queryRunner) => {
      await queryRunner.manager.update(User, user.id, { stripe: cus.id });
    });
  }
}

export async function finalizeDraftOrder(paymentMethodId: string) {
  try {
    const order = await getOrder();
    const surveyDogs = await getStoreDogs(order.id);
    const deliveryDate = await getStoreDeliveryDate(order.id);

    console.dir(order, { depth: null });

    if (order.shippingMethods.length === 0) {
      throw new Error('there have no available shipping method');
    }

    if (deliveryDate === null || surveyDogs === null) {
      throw new Error(
        'receive incompleted checkout, reason: ' +
          (deliveryDate === null || surveyDogs === null
            ? 'params not available'
            : 'checkout is not authorized')
      );
    }

    if (!order.user) {
      throw new Error('checkout is not linked with user, please contact ocelle for more.');
    }

    await updateDraftOrder({
      id: order.id,
      input: {
        shippingMethod: order.shippingMethods[0].id,
      },
    });

    // we need to wait for the payment hook to be called before completing the checkout
    await awaitable(
      getOrder,
      ({ authorizeStatus, chargeStatus }) =>
        authorizeStatus !== OrderAuthorizeStatusEnum.None &&
        chargeStatus !== OrderChargeStatusEnum.None
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { draftOrderComplete } = await executeGraphQL(CompleteDraftOrderDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        id: order.id,
      },
    });

    if (!draftOrderComplete || draftOrderComplete.errors.length > 0) {
      draftOrderComplete && console.error(draftOrderComplete.errors);
      throw new Error('order cannot be completed');
    }

    const user = await executeQuery(async (queryRunner) => {
      // user should be created in update checkout data action
      const user = await queryRunner.manager.findOne(User, {
        where: { id: order.user!.id },
        relations: {
          dogs: {
            boxs: true,
          },
        },
      });
      if (!user) {
        throw new Error('user cannot find in database records');
      }
      if (!user.stripe) {
        throw new Error('user is not linked with stripe');
      }
      await attachPaymentMethod(paymentMethodId, user.stripe);
      await queryRunner.manager.update(User, user.id, { stripePaymentMethod: paymentMethodId });
      return user;
    });

    await setupRecurringBox(user.id, surveyDogs, deliveryDate, draftOrderComplete.order!);
  } catch (e) {
    console.error(e);
    throw e;
  }

  redirect('/get-started/complete');
}

export async function getOrderConfigurations() {
  const id = await getOrderCookie();

  if (!id) {
    return undefined;
  }

  const deliveryDate = await getStoreDeliveryDate(id);

  await deleteStoreKeys(id);

  if (!deliveryDate) {
    return undefined;
  }

  return {
    deliveryDate,
  };
}

export async function dropOrderSession() {
  await deleteOrderCookie();
}
