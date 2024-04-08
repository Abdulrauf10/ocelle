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
  InitializePaymentGatewaysDocument,
  InitializeTransactionDocument,
  RegisterAccountDocument,
  UpdateCheckoutAddressDocument,
  UpdateCheckoutShippingMethodDocument,
} from '@/gql/graphql';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  calculateRecipePerDayPrice,
  calculateRecipeTotalPriceInBox,
  getClosestOrderDeliveryDate,
  getLifeStage,
  getSubscriptionProductActuallyQuanlityInSaleor,
  getTheCheapestRecipe,
  isUnavailableDeliveryDate,
} from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import {
  getSubscriptionCheckoutParameters,
  setSubscriptionCheckoutParameters,
  upsertSubscriptionCheckoutParameters,
} from '@/helpers/redis';
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
    halfPlan: calculateRecipePerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipeToBeCalcuate: getTheCheapestRecipe() },
      MealPlan.Half,
      OrderSize.TwoWeek,
      true
    ),
    fullPlan: calculateRecipePerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipeToBeCalcuate: getTheCheapestRecipe() },
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

export async function createCheckout(email: string, orderSize: OrderSize, dogs: DogDto[]) {
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
    const lifeStage = getLifeStage(breeds, dateOfBirth);
    const subscriptionRecipe1 = subscriptionProducts[dog.recipe1];
    const product1 = products.find((product) => product.slug === subscriptionRecipe1.slug)!;
    const recipe1Variant = product1.variants!.find(
      (variant) => variant.sku === subscriptionRecipe1.variants[lifeStage].sku
    );
    if (!recipe1Variant) {
      throw new Error(
        `failed to add recipe 1 to checkout, variant not found (${subscriptionRecipe1.variants[lifeStage].sku})`
      );
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
      const subscriptionRecipe2 = subscriptionProducts[dog.recipe2];
      const product2 = products.find((product) => product.slug === subscriptionRecipe2.slug)!;
      const recipe2Variant = product2.variants!.find(
        (variant) => variant.sku === subscriptionRecipe2.variants[lifeStage].sku
      );
      if (!recipe2Variant) {
        throw new Error(
          `failed to add recipe 2 to checkout, variant not found (${subscriptionRecipe2.variants[lifeStage].sku})`
        );
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
        email,
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

  await setSubscriptionCheckoutParameters(checkout.id, email, orderSize, dogs);

  await setCheckoutCookie(checkout.id);

  console.log('checkout debug');
  console.dir(checkout, { depth: null });

  const { paymentGatewayInitialize } = await executeGraphQL(InitializePaymentGatewaysDocument, {
    variables: {
      checkoutId: checkout.id,
      paymentGateways: checkout.availablePaymentGateways.map(({ config, id }) => ({
        id,
        data: config,
      })),
    },
  });

  if (!paymentGatewayInitialize || paymentGatewayInitialize.errors.length > 0) {
    paymentGatewayInitialize && console.error(paymentGatewayInitialize.errors);
    throw new Error('failed to initialize payment gateways');
  }

  if (
    !paymentGatewayInitialize.gatewayConfigs ||
    paymentGatewayInitialize.gatewayConfigs.find(
      (config) => config.errors && config.errors.length > 0
    )
  ) {
    console.error(paymentGatewayInitialize.gatewayConfigs);
    throw new Error('no available payment gateways');
  }

  return {
    checkout: checkoutCreate.checkout!,
    gateways: paymentGatewayInitialize.gatewayConfigs,
  };
}

export async function initializeStripeTranscation() {
  const checkout = await getCheckout();

  const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
    variables: {
      checkoutId: checkout.id,
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

  return transactionInitialize.data;
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

  await executeQuery(async (queryRunner) => {
    const entity = await queryRunner.manager.findOne(User, { where: { id: saleorUser.id } });

    if (!entity) {
      await queryRunner.manager.save(
        queryRunner.manager.create(User, {
          id: saleorUser.id,
          phone,
          orderSize: OrderSize.TwoWeek,
          isDeliveryUsAsBillingAddress,
        })
      );
    } else {
      entity.isDeliveryUsAsBillingAddress = isDeliveryUsAsBillingAddress;
      await queryRunner.manager.save(entity);
    }
  });

  return saleorUser;
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
  receiveNews: boolean;
  isSameBillingAddress: boolean;
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
  receiveNews: Joi.boolean().required(),
  isSameBillingAddress: Joi.boolean().required(),
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

  const calendarEvents = await getCalendarEvents();

  if (
    isUnavailableDeliveryDate(value.deliveryDate, calendarEvents) ||
    getClosestOrderDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  await upsertSubscriptionCheckoutParameters(checkout.id, { deliveryDate: value.deliveryDate });

  const user = await findOrCreateUser(
    value.firstName,
    value.lastName,
    value.email,
    value.phone,
    value.password,
    value.isSameBillingAddress,
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
}

export async function finalizeCheckout() {
  try {
    const checkout = await getCheckout();
    const params = await getSubscriptionCheckoutParameters(checkout.id);

    console.dir(checkout, { depth: null });

    if (checkout.shippingMethods.length === 0) {
      throw new Error('there have no available shipping method');
    }

    if (
      // checkout.authorizeStatus !== CheckoutAuthorizeStatusEnum.Full ||
      params === null ||
      params.deliveryDate === undefined
    ) {
      throw new Error(
        'receive incompleted checkout, reason: ' +
          (params === null || params.deliveryDate === undefined
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

      // create dogs
      const dogs = params.dogs.map((dog) =>
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
        if (params.dogs[i].breeds) {
          for (const breed of params.dogs[i].breeds!) {
            breeds.push(queryRunner.manager.create(DogBreed, { dog, breedId: breed }));
          }
        }
      }
      await queryRunner.manager.save(breeds);

      // create dogs plan
      const plans = [];
      for (let i = 0; i < dogs.length; i++) {
        const dog = dogs[i];
        const paramsDog = params.dogs[i];
        plans.push(
          queryRunner.manager.create(DogPlan, {
            mealPlan: paramsDog.mealPlan,
            recipe1: paramsDog.recipe1,
            recipe2: paramsDog.recipe2,
            isEnabledTransitionPeriod: paramsDog.isEnabledTransitionPeriod,
            startDate: addDays(startOfDay(new Date()), 1),
            lastDeliveryDate: params.deliveryDate,
            isEnabled: true,
            dog,
          })
        );
      }
      await queryRunner.manager.save(plans);

      const shipment = queryRunner.manager.create(Shipment, {
        deliveryDate: params.deliveryDate,
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
        const paramsDog = params.dogs[i];
        recurringRecords.push(
          queryRunner.manager.create(RecurringBox, {
            mealPlan: paramsDog.mealPlan,
            orderSize: params.orderSize,
            recipe1: paramsDog.recipe1,
            recipe2: paramsDog.recipe2,
            isTransitionPeriod: paramsDog.isEnabledTransitionPeriod,
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

  const params = await getSubscriptionCheckoutParameters(id);

  if (!params) {
    return undefined;
  }

  return params.deliveryDate;
}

export async function dropCheckoutSession() {
  await deleteCheckoutCookie();
}
