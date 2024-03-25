'use server';

import { MealPlan, OrderSize, Recipe } from '@/enums';
import {
  AddPromoCodeDocument,
  AttachCheckoutCustomerDocument,
  CompleteCheckoutDocument,
  CountryCode,
  CreateCheckoutDocument,
  FindProductDocument,
  FindUserDocument,
  InitializePaymentGatewaysDocument,
  InitializeTransactionDocument,
  RegisterAccountDocument,
  UpdateCheckoutAddressDocument,
} from '@/gql/graphql';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  calculatePrice,
  getClosestOrderDeliveryDate,
  isUnavailableDeliveryDate,
} from '@/helpers/dog';
import { executeGraphQL } from '@/helpers/graphql';
import { redirect } from '@/navigation';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { startOfDay } from 'date-fns';
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

function getCheckoutId() {
  const nextServerCookiesStorage = getNextServerCookiesStorage();
  const checkoutId = nextServerCookiesStorage.getItem('checkout');

  if (!checkoutId) {
    throw new Error('checkout id cannot be found');
  }

  return checkoutId;
}

export async function createCheckout(
  email: string,
  orderSize: OrderSize,
  mealPlan: MealPlan,
  enabledTransitionPeriod: boolean,
  recipe1: Recipe,
  recipe2?: Recipe
) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

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
  const lines = [
    {
      variantId: product.variants.find((variant) => variant.sku === SKUs[recipe1])!.id,
      quantity: calculatePrice(recipe1),
    },
  ];

  if (recipe2) {
    lines.push({
      variantId: product.variants.find((variant) => variant.sku === SKUs[recipe2])!.id,
      quantity: calculatePrice(recipe2),
    });
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

  if (!checkoutCreate || checkoutCreate.errors.length > 0 || !checkoutCreate.checkout) {
    console.error(checkoutCreate?.errors);
    throw new Error('create checkout failed');
  }

  if (!checkoutCreate.checkout.availablePaymentGateways.find((x) => x.id === stripeAppId)) {
    throw new Error('stripe is currently not available');
  }

  const nextServerCookiesStorage = getNextServerCookiesStorage();

  nextServerCookiesStorage.setItem('checkout', checkoutCreate.checkout.id);

  console.log('checkout debug');
  console.dir(checkoutCreate.checkout, { depth: null });

  const { paymentGatewayInitialize } = await executeGraphQL(InitializePaymentGatewaysDocument, {
    variables: {
      checkoutId: checkoutCreate.checkout.id,
      paymentGateways: checkoutCreate.checkout.availablePaymentGateways.map(({ config, id }) => ({
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
  const checkoutId = getCheckoutId();

  const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
    variables: {
      checkoutId,
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
  const checkoutId = getCheckoutId();

  const { checkoutAddPromoCode } = await executeGraphQL(AddPromoCodeDocument, {
    variables: {
      promoCode: coupon,
      checkoutId,
    },
  });

  if (!checkoutAddPromoCode || checkoutAddPromoCode.errors.length > 0) {
    checkoutAddPromoCode && console.error(checkoutAddPromoCode.errors);
    throw new Error('failed to add coupon to checkout');
  }
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

  return accountRegister.user!;
}

export async function processCheckout(data: ProcessCheckoutAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const headersList = headers();
  const origin = headersList.get('origin');
  const { value, error } = schema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const checkoutId = getCheckoutId();

  const calendarEvents = await getCalendarEvents();

  if (
    isUnavailableDeliveryDate(value.deliveryDate, calendarEvents) ||
    getClosestOrderDeliveryDate(new Date(), calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  const user = await findOrCreateUser(
    value.firstName,
    value.lastName,
    value.email,
    value.password,
    process.env.SALEOR_CHANNEL_SLUG,
    `${origin}/auth/verify-email`
  );

  const { checkoutCustomerAttach } = await executeGraphQL(AttachCheckoutCustomerDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      checkoutId,
      customerId: user.id,
    },
  });

  if (!checkoutCustomerAttach || checkoutCustomerAttach.errors.length > 0) {
    checkoutCustomerAttach && console.error(checkoutCustomerAttach.errors);
    throw new Error('failed to attach a user to the checkout');
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
        checkoutId,
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
    const checkoutId = getCheckoutId();

    const { checkoutComplete } = await executeGraphQL(CompleteCheckoutDocument, {
      variables: { checkoutId },
    });

    if (!checkoutComplete || checkoutComplete.errors) {
      throw new Error('checkout cannot completed');
    }
  } catch (e) {
    redirect('/get-started');
  }
}
