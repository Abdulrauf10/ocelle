'use server';

import { startOfDay } from 'date-fns';
import invariant from 'ts-invariant';

import { UpdateCheckoutDataAction } from './types';
import { updateCheckoutDataActionSchema } from './validators';

import { deleteCartCookie, getCartCookie } from '@/actions';
import {
  FREE_SHIPPING_MIN_TOTAL_AMOUNT,
  SHIPPING_METHOD_SF_EXPRESS_FIXED,
  SHIPPING_METHOD_SF_EXPRESS_MIN_FREE,
} from '@/consts';
import { getRecurringBoxMinDeliveryDate, isLegalDeliveryDate } from '@/helpers/shipment';
import { redirect } from '@/navigation';
import calendarService from '@/services/calendar';
import checkoutService from '@/services/checkout';
import redisService from '@/services/redis';
import { CartReturn } from '@/types/dto';

export async function getCheckout() {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  return await checkoutService.getById(checkoutId);
}

export async function initializeStripeTranscation() {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  return await checkoutService.initialTransaction(checkoutId, {
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function applyCoupon({ coupon }: { coupon: string }) {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  await checkoutService.setCoupon(checkoutId, coupon);
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartReturn> {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  const { totalPrice } = await checkoutService.updateLine(checkoutId, lineId, quantity);

  const checkout = await checkoutService.assignShippingMethod(
    checkoutId,
    totalPrice.gross.amount >= FREE_SHIPPING_MIN_TOTAL_AMOUNT
      ? SHIPPING_METHOD_SF_EXPRESS_MIN_FREE
      : SHIPPING_METHOD_SF_EXPRESS_FIXED
  );

  return {
    lines: checkout.lines,
    subtotalPrice: checkout.subtotalPrice.gross,
    shippingPrice: checkout.shippingPrice.gross,
    totalPrice: checkout.totalPrice.gross,
  };
}

export async function deleteCartLine(lineId: string): Promise<CartReturn> {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  const { totalPrice } = await checkoutService.deleteLine(checkoutId, lineId);

  const checkout = await checkoutService.assignShippingMethod(
    checkoutId,
    totalPrice.gross.amount >= FREE_SHIPPING_MIN_TOTAL_AMOUNT
      ? SHIPPING_METHOD_SF_EXPRESS_MIN_FREE
      : SHIPPING_METHOD_SF_EXPRESS_FIXED
  );

  return {
    lines: checkout.lines,
    subtotalPrice: checkout.subtotalPrice.gross,
    shippingPrice: checkout.shippingPrice.gross,
    totalPrice: checkout.totalPrice.gross,
  };
}

export async function updateCheckoutData(data: UpdateCheckoutDataAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  const { value, error } = updateCheckoutDataActionSchema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const calendarEvents = await calendarService.getCalendarEvents();

  if (
    !isLegalDeliveryDate(value.deliveryDate, calendarEvents) ||
    getRecurringBoxMinDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  const checkout = await checkoutService.getById(checkoutId);

  await redisService.setStoreDeliveryDate(checkout.id, value.deliveryDate);

  await checkoutService.updateEmail(checkout.id, value.email);
  await checkoutService.updateAddress(
    checkout.id,
    value.deliveryAddress,
    value.isSameBillingAddress ? value.deliveryAddress : value.billingAddress!
  );
}

export async function finalizeCheckout() {
  const checkoutId = await getCartCookie();

  invariant(checkoutId, 'checkout not found in the cookie');

  await checkoutService.completeCheckout(checkoutId);

  redirect('/checkout/complete');
}

export async function getOrderConfigurations() {
  const id = await getCartCookie();

  if (!id) {
    return undefined;
  }

  const deliveryDate = await redisService.getStoreDeliveryDate(id);

  if (!deliveryDate) {
    return undefined;
  }

  return {
    deliveryDate,
  };
}

export async function dropCheckoutSession() {
  await deleteCartCookie();
}
