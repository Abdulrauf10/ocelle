'use server';

import { deleteCheckoutCookie, getCheckoutCookie, setCheckoutCookie } from '@/actions';
import { Breed, Dog, DogBreed, DogPlan, RecurringBox, Order, Shipment, User } from '@/entities';
import { MealPlan, OrderSize } from '@/enums';
import {
  AddPromoCodeDocument,
  AttachCheckoutCustomerDocument,
  CheckoutAuthorizeStatusEnum,
  CheckoutChargeStatusEnum,
  CheckoutFragment,
  CompleteCheckoutDocument,
  CountryCode,
  CreateCheckoutDocument,
  FindProductsDocument,
  FindUserDocument,
  GetChannelDocument,
  GetCheckoutDocument,
  InitializeTransactionDocument,
  RegisterAccountDocument,
  UpdateCheckoutAddressDocument,
  UpdateCheckoutShippingMethodDocument,
} from '@/gql/graphql';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  calculateTotalPerDayPrice,
  calculateRecipeTotalPriceInBox,
  getClosestOrderDeliveryDate,
  getSubscriptionProductActuallyQuanlityInSaleor,
  getTheCheapestRecipe,
  isUnavailableDeliveryDate,
  getEditableRecurringBoxDeadline,
} from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import {
  deleteCheckoutKeys,
  getCheckoutDeliveryDate,
  getCheckoutDogs,
  getCheckoutOrderSize,
  getCheckoutPaymentIntent,
  setCheckoutDeliveryDate,
  setCheckoutDogs,
  setCheckoutEmail,
  setCheckoutOrderSize,
  setCheckoutPaymentIntent,
} from '@/helpers/redis';
import { recipeToVariant } from '@/helpers/saleor';
import {
  attachPaymentMethod,
  createCustomer,
  retrivePaymentIntent,
  updatePaymentIntent,
} from '@/helpers/stripe';
import { redirect } from '@/navigation';
import { subscriptionProducts } from '@/products';
import { DogDto, MinPricesDto } from '@/types/dto';
import { addDays, startOfDay } from 'date-fns';
import Joi from 'joi';
import { headers } from 'next/headers';
import invariant from 'ts-invariant';
import { In } from 'typeorm';

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
    halfPlan: calculateTotalPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: getTheCheapestRecipe() },
      MealPlan.Half,
      OrderSize.TwoWeek,
      true
    ),
    fullPlan: calculateTotalPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: getTheCheapestRecipe() },
      MealPlan.Full,
      OrderSize.TwoWeek,
      true
    ),
  };
}

async function getCheckout(): Promise<CheckoutFragment> {
  const checkoutId = await getCheckoutCookie();

  if (!checkoutId) {
    throw new Error('checkout id cannot be found');
  }

  const { checkout } = await executeGraphQL(GetCheckoutDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { id: checkoutId },
  });

  if (!checkout) {
    throw new Error('checkout not found');
  }

  return checkout;
}

export async function createCheckout(orderSize: OrderSize, dogs: DogDto[]) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { slug: process.env.SALEOR_CHANNEL_SLUG },
  });

  if (!channel) {
    throw new Error('channel not found');
  }

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
  const { products: _products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      where: {
        slug: {
          oneOf: productSlugsToBeAddToLine,
        },
      },
    },
  });

  const products = _products?.edges.map((edge) => edge.node) || [];

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
    const recipe1TotalPrice = calculateRecipeTotalPriceInBox(
      breeds,
      dateOfBirth,
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipeToBeCalcuate: dog.recipe1, recipeReference: dog.recipe2 },
      dog.mealPlan,
      OrderSize.TwoWeek,
      dog.isEnabledTransitionPeriod
    );
    lines.push({
      variantId: recipe1Variant.id,
      quantity: getSubscriptionProductActuallyQuanlityInSaleor(recipe1TotalPrice),
    });
    if (dog.recipe2) {
      const recipe2Variant = recipeToVariant(products, breeds, dateOfBirth, dog.recipe2);
      if (!recipe2Variant) {
        throw new Error('failed to add recipe 2 to checkout, variant not found');
      }
      const recipe2TotalPrice = calculateRecipeTotalPriceInBox(
        breeds,
        dateOfBirth,
        dog.isNeutered,
        dog.weight,
        dog.bodyCondition,
        dog.activityLevel,
        { recipeToBeCalcuate: dog.recipe2, recipeReference: dog.recipe1 },
        dog.mealPlan,
        OrderSize.TwoWeek,
        dog.isEnabledTransitionPeriod
      );
      lines.push({
        variantId: recipe2Variant.id,
        quantity: getSubscriptionProductActuallyQuanlityInSaleor(recipe2TotalPrice),
      });
    }
  }

  // create checkout
  const { checkoutCreate } = await executeGraphQL(CreateCheckoutDocument, {
    variables: {
      input: {
        channel: process.env.SALEOR_CHANNEL_SLUG,
        lines,
      },
    },
  });

  if (!checkoutCreate || checkoutCreate.errors.length > 0) {
    checkoutCreate && console.error(checkoutCreate?.errors);
    throw new Error('create checkout failed');
  }

  const checkout = checkoutCreate.checkout!;
  const stripeAppId = getStripeAppId();

  if (!checkout.availablePaymentGateways.find((x) => x.id === stripeAppId)) {
    throw new Error('stripe is currently not available');
  }

  await setCheckoutOrderSize(checkout.id, orderSize);
  await setCheckoutDogs(checkout.id, dogs);

  await setCheckoutCookie(checkout.id);

  return checkoutCreate.checkout!;
}

export async function initializeStripeTranscation() {
  const checkout = await getCheckout();

  const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
    variables: {
      checkoutOrOrderId: checkout.id,
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

  await setCheckoutPaymentIntent(checkout.id, paymentIntent.id);

  return transactionInitialize.data as {
    paymentIntent: { client_secret: string };
    publishableKey: string;
  };
}

export async function applyCoupon({ coupon }: { coupon: string }) {
  const checkout = await getCheckout();

  const { checkoutAddPromoCode } = await executeGraphQL(AddPromoCodeDocument, {
    variables: {
      promoCode: coupon,
      checkoutId: checkout.id,
    },
  });

  if (!checkoutAddPromoCode || checkoutAddPromoCode.errors.length > 0) {
    checkoutAddPromoCode && console.error(checkoutAddPromoCode.errors);
    throw new Error('failed to add coupon to checkout');
  }
}

async function findOrCreateUser(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  isDeliveryUsAsBillingAddress: boolean,
  channel: string,
  redirectUrl: string
) {
  async function getSaleorUser() {
    const { user } = await executeGraphQL(FindUserDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { email },
    });
    if (user) {
      return user;
    }
    const { accountRegister } = await executeGraphQL(RegisterAccountDocument, {
      variables: {
        input: {
          firstName,
          lastName,
          password,
          email,
          redirectUrl,
          channel,
        },
      },
    });
    if (!accountRegister || accountRegister.errors.length > 0) {
      accountRegister && console.error(accountRegister.errors);
      throw new Error('failed to create a user for the checkout');
    }
    return accountRegister.user!;
  }

  const saleorUser = await getSaleorUser();

  const user = await executeQuery(async (queryRunner) => {
    const entity = await queryRunner.manager.findOne(User, { where: { id: saleorUser.id } });

    if (!entity) {
      const user = queryRunner.manager.create(User, {
        id: saleorUser.id,
        phone,
        orderSize: OrderSize.TwoWeek,
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

interface UpdateCheckoutDataAction {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
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
  streetAddress2: Joi.string().required(),
  district: Joi.string().required(),
  region: Joi.string().required(),
  country: Joi.string().required(),
});

const schema = Joi.object<UpdateCheckoutDataAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
  receiveNews: Joi.boolean().optional(),
  isSameBillingAddress: Joi.boolean().optional(),
  deliveryDate: Joi.date().required(),
  tnc: Joi.boolean().required(),
  deliveryAddress: addressSchema.required(),
  billingAddress: addressSchema,
});

export async function updateCheckoutData(data: UpdateCheckoutDataAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const headersList = headers();
  const origin = headersList.get('origin');
  const { value, error } = schema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const checkout = await getCheckout();
  const paymentIntent = await getCheckoutPaymentIntent(checkout.id);

  const calendarEvents = await getCalendarEvents();

  if (!paymentIntent) {
    throw new Error('payment intent not found');
  }

  if (
    isUnavailableDeliveryDate(value.deliveryDate, calendarEvents) ||
    getClosestOrderDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  await setCheckoutEmail(checkout.id, value.email);
  await setCheckoutDeliveryDate(checkout.id, value.deliveryDate);

  const user = await findOrCreateUser(
    value.firstName,
    value.lastName,
    value.email,
    value.phone,
    value.password,
    value.isSameBillingAddress ?? false,
    process.env.SALEOR_CHANNEL_SLUG,
    `${origin}/auth/verify-email`
  );

  if (!checkout.user) {
    const { checkoutCustomerAttach } = await executeGraphQL(AttachCheckoutCustomerDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: checkout.id,
        customerId: user.id,
      },
    });

    if (!checkoutCustomerAttach || checkoutCustomerAttach.errors.length > 0) {
      checkoutCustomerAttach && console.error(checkoutCustomerAttach.errors);
      throw new Error('failed to attach a user to the checkout');
    }
  } else if (checkout.user.id !== user.id) {
    throw new Error('incorrect user id of current checkout');
  }

  const shippingAddress = {
    firstName: value.deliveryAddress.firstName,
    lastName: value.deliveryAddress.lastName,
    streetAddress1: value.deliveryAddress.streetAddress1,
    streetAddress2: value.deliveryAddress.streetAddress2,
    city: value.deliveryAddress.district,
    countryArea: value.deliveryAddress.region,
    country: CountryCode.Hk,
  };

  const { checkoutShippingAddressUpdate, checkoutBillingAddressUpdate } = await executeGraphQL(
    UpdateCheckoutAddressDocument,
    {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        checkoutId: checkout.id,
        shippingAddress,
        billingAddress: value.isSameBillingAddress
          ? shippingAddress
          : {
              firstName: value.billingAddress!.firstName,
              lastName: value.billingAddress!.lastName,
              streetAddress1: value.billingAddress!.streetAddress1,
              streetAddress2: value.billingAddress!.streetAddress2,
              city: value.billingAddress!.district,
              countryArea: value.billingAddress!.region,
              country: CountryCode.Hk,
            },
      },
    }
  );

  if (
    !checkoutShippingAddressUpdate ||
    !checkoutBillingAddressUpdate ||
    checkoutShippingAddressUpdate.errors.length > 0 ||
    checkoutBillingAddressUpdate.errors.length > 0
  ) {
    checkoutShippingAddressUpdate && console.error(checkoutShippingAddressUpdate.errors);
    checkoutBillingAddressUpdate && console.error(checkoutBillingAddressUpdate.errors);
    throw new Error('checkout address update failed');
  }

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

export async function finalizeCheckout(paymentMethodId: string) {
  try {
    const events = await getCalendarEvents();
    const checkout = await getCheckout();
    const orderSize = await getCheckoutOrderSize(checkout.id);
    const surveyDogs = await getCheckoutDogs(checkout.id);
    const deliveryDate = await getCheckoutDeliveryDate(checkout.id);

    console.dir(checkout, { depth: null });

    if (checkout.shippingMethods.length === 0) {
      throw new Error('there have no available shipping method');
    }

    if (orderSize === null || deliveryDate === null || surveyDogs === null) {
      throw new Error(
        'receive incompleted checkout, reason: ' +
          (orderSize === null || deliveryDate === null || surveyDogs === null
            ? 'params not available'
            : 'checkout is not authorized')
      );
    }

    if (!checkout.user) {
      throw new Error('checkout is not linked with user, please contact ocelle for more.');
    }

    const { checkoutDeliveryMethodUpdate } = await executeGraphQL(
      UpdateCheckoutShippingMethodDocument,
      {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          checkoutId: checkout.id,
          shippingMethodId: checkout.shippingMethods[0].id,
        },
      }
    );

    if (!checkoutDeliveryMethodUpdate || checkoutDeliveryMethodUpdate.errors.length > 0) {
      checkoutDeliveryMethodUpdate && console.error(checkoutDeliveryMethodUpdate.errors);
      throw new Error('failed to update shipping method');
    }

    // we need to wait for the payment hook to be called before completing the checkout
    for (let i = 0; i < 30; i++) {
      const _checkout = await getCheckout();
      if (
        _checkout.authorizeStatus !== CheckoutAuthorizeStatusEnum.None &&
        _checkout.chargeStatus !== CheckoutChargeStatusEnum.None
      ) {
        break;
      }
      // wait for 8 seconds to continue
      await new Promise((resolve) => setTimeout(resolve, 1000 * 8));
    }

    const { checkoutComplete } = await executeGraphQL(CompleteCheckoutDocument, {
      variables: {
        checkoutId: checkout.id,
      },
    });

    if (!checkoutComplete || checkoutComplete.errors.length > 0) {
      checkoutComplete && console.error(checkoutComplete.errors);
      throw new Error('checkout cannot completed');
    }

    await executeQuery(async (queryRunner) => {
      // user should be created in update checkout data action
      const user = await queryRunner.manager.findOne(User, {
        where: { id: checkout.user!.id },
      });

      if (!user) {
        throw new Error('user cannot find in database records');
      }

      if (!user.stripe) {
        throw new Error('user is not linked with stripe');
      }

      await attachPaymentMethod(paymentMethodId, user.stripe);

      await queryRunner.manager.update(User, user.id, { stripePaymentMethod: paymentMethodId });

      // create dogs
      const dogs = surveyDogs.map((dog) =>
        queryRunner.manager.create(Dog, {
          name: dog.name,
          sex: dog.gender,
          isNeutered: dog.isNeutered,
          dateOfBirthMethod: dog.dateOfBirthMethod,
          dateOfBirth: dog.dateOfBirth,
          weight: dog.weight,
          bodyCondition: dog.bodyCondition,
          activityLevel: dog.activityLevel,
          foodAllergies: dog.foodAllergies,
          currentEating: dog.currentlyEating,
          amountOfTreats: dog.amountOfTreats,
          pickiness: dog.pickiness,
          user,
        })
      );
      await queryRunner.manager.save(dogs);

      // create dogs breeds
      const breeds = [];
      for (let i = 0; i < dogs.length; i++) {
        const dog = dogs[i];
        if (surveyDogs[i].breeds) {
          for (const breed of surveyDogs[i].breeds!) {
            breeds.push(queryRunner.manager.create(DogBreed, { dog, breedId: breed }));
          }
        }
      }
      await queryRunner.manager.save(breeds);

      // create dogs plan
      const plans = [];
      for (let i = 0; i < dogs.length; i++) {
        const dog = dogs[i];
        plans.push(
          queryRunner.manager.create(DogPlan, {
            mealPlan: surveyDogs[i].mealPlan,
            recipe1: surveyDogs[i].recipe1,
            recipe2: surveyDogs[i].recipe2,
            isEnabledTransitionPeriod: surveyDogs[i].isEnabledTransitionPeriod,
            startDate: addDays(startOfDay(new Date()), 1),
            lastDeliveryDate: deliveryDate,
            isEnabled: true,
            dog,
          })
        );
      }
      await queryRunner.manager.save(plans);

      const shipment = queryRunner.manager.create(Shipment, {
        deliveryDate,
        lockBoxDate: getEditableRecurringBoxDeadline(events, deliveryDate),
      });
      await queryRunner.manager.save(shipment);

      // create order
      const order = queryRunner.manager.create(Order, {
        id: checkoutComplete.order!.id,
        createdAt: new Date(checkoutComplete.order!.created),
      });
      await queryRunner.manager.save(order);

      const recurringRecords = [];
      for (let i = 0; i < dogs.length; i++) {
        const dog = dogs[i];
        recurringRecords.push(
          queryRunner.manager.create(RecurringBox, {
            mealPlan: surveyDogs[i].mealPlan,
            orderSize: orderSize,
            recipe1: surveyDogs[i].recipe1,
            recipe2: surveyDogs[i].recipe2,
            isTransitionPeriod: surveyDogs[i].isEnabledTransitionPeriod,
            startDate: addDays(startOfDay(new Date()), 1),
            endDate: addDays(startOfDay(new Date()), 1 + 14), // must be two weeks box
            dog,
            order,
            shipment,
          })
        );
      }
      await queryRunner.manager.save(recurringRecords);
    });
  } catch (e) {
    console.error(e);
    redirect('/get-started');
    return;
  }

  redirect('/get-started/complete');
}

export async function getDeliveryDate() {
  const id = await getCheckoutCookie();

  if (!id) {
    return undefined;
  }

  const deliveryDate = await getCheckoutDeliveryDate(id);

  await deleteCheckoutKeys(id);

  return deliveryDate ?? undefined;
}

export async function dropCheckoutSession() {
  await deleteCheckoutCookie();
}
