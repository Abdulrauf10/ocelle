'use server';

import { Dog, DogBreed, DogOrder, DogPlan, Order, User } from '@/entities';
import { OrderSize, Recipe } from '@/enums';
import {
  AddPromoCodeDocument,
  AttachCheckoutCustomerDocument,
  CheckoutFragment,
  CompleteCheckoutDocument,
  CountryCode,
  CreateCheckoutDocument,
  FindProductDocument,
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
  calculatePrice,
  getClosestOrderDeliveryDate,
  isUnavailableDeliveryDate,
} from '@/helpers/dog';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { getCheckoutParameters, setCheckoutParameters } from '@/helpers/redis';
import { redirect } from '@/navigation';
import { DogDto } from '@/types/dto';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { addDays, startOfDay } from 'date-fns';
import Joi from 'joi';
import { headers } from 'next/headers';
import invariant from 'ts-invariant';

const stripeAppId = process.env.SALEOR_STRIPE_APP_ID ?? 'app.saleor.stripe';

export async function getDefaultDeliveryDate() {
  return getClosestOrderDeliveryDate(new Date(), await getCalendarEvents());
}

const SKUs = {
  [Recipe.Chicken]: 'ocelle-c-s',
  [Recipe.Beef]: 'ocelle-b-s',
  [Recipe.Pork]: 'ocelle-p-s',
  [Recipe.Lamb]: 'ocelle-l-s',
  [Recipe.Duck]: 'ocelle-d-s',
};

async function getCheckout(): Promise<CheckoutFragment> {
  const nextServerCookiesStorage = getNextServerCookiesStorage();
  const checkoutId = nextServerCookiesStorage.getItem('checkout');

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

  // make sure the settings of saleor is ready for create checkout
  const { product } = await executeGraphQL(FindProductDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_PRODUCT_SLUG!,
    },
  });

  if (!product?.variants) {
    throw new Error('cannot find the product to process the checkout action');
  }

  // setup products
  const lines = [];

  for (const dog of dogs) {
    const recipe1Variant = product.variants.find((variant) => variant.sku === SKUs[dog.recipe1]);
    if (!recipe1Variant) {
      throw new Error(
        `failed to add recipe 1 to checkout, variant not found (${SKUs[dog.recipe1]})`
      );
    }
    lines.push({
      variantId: recipe1Variant.id,
      quantity: calculatePrice(dog.recipe1),
    });
    if (dog.recipe2) {
      const recipe2Variant = product.variants.find((variant) => variant.sku === SKUs[dog.recipe2!]);
      if (!recipe2Variant) {
        throw new Error(
          `failed to add recipe 2 to checkout, variant not found (${SKUs[dog.recipe1]})`
        );
      }
      lines.push({
        variantId: recipe2Variant.id,
        quantity: calculatePrice(dog.recipe2),
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

  if (checkout.availablePaymentGateways.find((x) => x.id === stripeAppId)) {
    throw new Error('stripe is currently not available');
  }

  await setCheckoutParameters(checkout.id, email, orderSize, dogs);

  const nextServerCookiesStorage = getNextServerCookiesStorage();

  nextServerCookiesStorage.setItem('checkout', checkout.id);

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
        id: stripeAppId,
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
    transactionInitialize && console.error(transactionInitialize.errors);
    throw new Error('cannot initialize transaction');
  }

  console.dir(transactionInitialize, { depth: null });

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
  password: string,
  channel: string,
  redirectUrl: string
) {
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

  await executeQuery(async (queryRunner) => {
    const entity = queryRunner.manager.create(User, {
      id: accountRegister.user!.id,
      orderSize: OrderSize.TwoWeek,
    });

    await queryRunner.manager.save(entity);
  });

  return accountRegister.user!;
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

interface ProcessCheckoutAction {
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

const schema = Joi.object<ProcessCheckoutAction>({
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

export async function processCheckout(data: ProcessCheckoutAction) {
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
    getClosestOrderDeliveryDate(new Date(), calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  const params = await getCheckoutParameters(checkout.id);

  if (!params) {
    throw new Error('failed to find checkout related parameters');
  }

  await setCheckoutParameters(
    checkout.id,
    params.email,
    params.orderSize,
    params.dogs,
    value.deliveryDate
  );

  const user = await findOrCreateUser(
    value.firstName,
    value.lastName,
    value.email,
    value.password,
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

export async function completeCheckout() {
  try {
    const checkout = await getCheckout();
    const params = await getCheckoutParameters(checkout.id);

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
      let user = await queryRunner.manager.findOne(User, {
        where: { id: checkout.user!.id },
      });
      if (!user) {
        user = queryRunner.manager.create(User, {
          id: checkout.user!.id,
          orderSize: params.orderSize,
        });
        await queryRunner.manager.save(user);
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
          user: user!,
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

      // create order
      const order = queryRunner.manager.create(Order, {
        id: checkoutComplete.order!.id,
        orderSize: params.orderSize,
        deliveryDate: params.deliveryDate,
        createdAt: new Date(checkoutComplete.order!.created),
      });
      await queryRunner.manager.save(order);

      // create dog order
      const dogOrders = [];
      for (let i = 0; i < dogs.length; i++) {
        const dog = dogs[i];
        const paramsDog = params.dogs[i];
        dogOrders.push(
          queryRunner.manager.create(DogOrder, {
            mealPlan: paramsDog.mealPlan,
            recipe1: paramsDog.recipe1,
            recipe2: paramsDog.recipe2,
            isTransitionPeriod: paramsDog.isEnabledTransitionPeriod,
            dog,
            order,
          })
        );
      }
      await queryRunner.manager.save(dogOrders);
    });
  } catch (e) {
    console.error(e);
    redirect('/get-started');
  }
}

export async function getDeliveryDate() {
  const nextServerCookiesStorage = getNextServerCookiesStorage();
  const id = nextServerCookiesStorage.getItem('checkout');

  if (!id) {
    return undefined;
  }

  const params = await getCheckoutParameters(id);

  if (!params) {
    return undefined;
  }

  return params.deliveryDate;
}

export async function dropCheckoutSession() {
  getNextServerCookiesStorage().removeItem('checkout');
}
