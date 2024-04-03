'use server';

import { deleteCartCookie, getCartCookie } from '@/actions';
import {
  AddPromoCodeDocument,
  CheckoutAuthorizeStatusEnum,
  CheckoutChargeStatusEnum,
  CheckoutFragment,
  CompleteCheckoutDocument,
  CountryCode,
  GetCheckoutDocument,
  InitializeTransactionDocument,
  RemoveCheckoutLinesDocument,
  UpdateCheckoutAddressDocument,
  UpdateCheckoutEmailDocument,
  UpdateCheckoutLinesDocument,
  UpdateCheckoutShippingMethodDocument,
} from '@/gql/graphql';
import { getCalendarEvents } from '@/helpers/calendar';
import { getClosestOrderDeliveryDate, isUnavailableDeliveryDate } from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { getIndividualCheckoutParameters, setIndividualCheckoutParameters } from '@/helpers/redis';
import { redirect } from '@/navigation';
import { CartReturn } from '@/types/dto';
import { startOfDay } from 'date-fns';
import Joi from 'joi';
import invariant from 'ts-invariant';

export async function getCartOrCheckout(): Promise<CheckoutFragment> {
  const cartOrCheckoutId = await getCartCookie();

  if (!cartOrCheckoutId) {
    console.error('checkout id cannot be found');
    return redirect('/');
  }

  const { checkout } = await executeGraphQL(GetCheckoutDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: { id: cartOrCheckoutId },
  });

  if (!checkout) {
    console.error('cart or checkout not found');
    return redirect('/');
  }

  if (checkout.lines.length === 0) {
    return redirect('/');
  }

  return checkout;
}

export async function initializeCheckout() {
  const checkout = await getCartOrCheckout();

  if (checkout.shippingMethods.length === 0) {
    throw new Error('there have no available shipping method');
  }

  const shippingMethod =
    checkout.shippingMethods.find((method) => method.name === 'SF Express (Fixed)') ??
    checkout.shippingMethods[0];

  const { checkoutDeliveryMethodUpdate } = await executeGraphQL(
    UpdateCheckoutShippingMethodDocument,
    {
      variables: {
        checkoutId: checkout.id,
        shippingMethodId: shippingMethod.id,
      },
    }
  );

  if (!checkoutDeliveryMethodUpdate || checkoutDeliveryMethodUpdate.errors.length > 0) {
    checkoutDeliveryMethodUpdate && console.error(checkoutDeliveryMethodUpdate.errors);
    throw new Error('failed to update shipping method');
  }

  return checkoutDeliveryMethodUpdate.checkout!;
}

export async function initializeStripeTranscation() {
  const checkout = await getCartOrCheckout();

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

  return transactionInitialize.data as {
    paymentIntent: { client_secret: string };
    publishableKey: string;
  };
}

export async function applyCoupon({ coupon }: { coupon: string }) {
  const checkout = await getCartOrCheckout();

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

export async function updateCartLine(lineId: string, quantity: number): Promise<CartReturn> {
  const cart = await getCartOrCheckout();

  const { checkoutLinesUpdate } = await executeGraphQL(UpdateCheckoutLinesDocument, {
    variables: {
      checkoutId: cart!.id,
      lines: [
        {
          lineId,
          quantity,
        },
      ],
    },
  });

  if (!checkoutLinesUpdate || checkoutLinesUpdate.errors.length > 0) {
    checkoutLinesUpdate && console.error(checkoutLinesUpdate?.errors);
    throw new Error('unable update item from cart');
  }

  if (checkoutLinesUpdate.checkout!.lines.length === 0) {
    return redirect('/');
  }

  return {
    lines: checkoutLinesUpdate.checkout!.lines,
    totalPrice: checkoutLinesUpdate.checkout!.totalPrice.gross,
  };
}

export async function deleteCartLine(lineId: string): Promise<CartReturn> {
  const cart = await getCartOrCheckout();

  const { checkoutLinesDelete } = await executeGraphQL(RemoveCheckoutLinesDocument, {
    variables: {
      checkoutId: cart!.id,
      linesIds: [lineId],
    },
  });

  if (!checkoutLinesDelete || checkoutLinesDelete.errors.length > 0) {
    checkoutLinesDelete && console.error(checkoutLinesDelete?.errors);
    throw new Error('unable delete item from cart');
  }

  if (checkoutLinesDelete.checkout!.lines.length === 0) {
    return redirect('/');
  }

  return {
    lines: checkoutLinesDelete.checkout!.lines,
    totalPrice: checkoutLinesDelete.checkout!.totalPrice.gross,
  };
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
  phone: string;
  receiveNews: boolean;
  isSameBillingAddress: boolean;
  deliveryDate: Date;
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
  phone: Joi.string().required(),
  receiveNews: Joi.boolean().required(),
  isSameBillingAddress: Joi.boolean().required(),
  deliveryDate: Joi.date().required(),
  deliveryAddress: addressSchema.required(),
  billingAddress: addressSchema,
});

export async function updateCheckoutData(data: UpdateCheckoutDataAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { value, error } = schema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const checkout = await getCartOrCheckout();

  const calendarEvents = await getCalendarEvents();

  if (
    isUnavailableDeliveryDate(value.deliveryDate, calendarEvents) ||
    getClosestOrderDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  await setIndividualCheckoutParameters(checkout.id, value.deliveryDate);

  const { checkoutEmailUpdate } = await executeGraphQL(UpdateCheckoutEmailDocument, {
    variables: {
      checkoutId: checkout.id,
      email: value.email,
    },
  });

  if (!checkoutEmailUpdate || checkoutEmailUpdate.errors.length > 0) {
    checkoutEmailUpdate && console.error(checkoutEmailUpdate?.errors);
    throw new Error('unable update the checkout email address');
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
  const checkout = await getCartOrCheckout();

  console.dir(checkout, { depth: null });

  if (!checkout.email) {
    throw new Error('checkout is not linked with email, please contact ocelle for more.');
  }

  // we need to wait for the payment hook to be called before completing the checkout
  for (let i = 0; i < 30; i++) {
    const _checkout = await getCartOrCheckout();
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

  redirect('/checkout/complete');
}

export async function getDeliveryDate() {
  const id = await getCartCookie();

  if (!id) {
    return undefined;
  }

  const params = await getIndividualCheckoutParameters(id);

  if (!params) {
    return undefined;
  }

  return params.deliveryDate;
}

export async function dropCheckoutSession() {
  await deleteCartCookie();
}
