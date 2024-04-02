'use server';

import { getCalendarEvents } from './helpers/calendar';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import { getClosestOrderDeliveryDate } from './helpers/dog';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';

// here for global actions

export async function logout() {
  saleorAuthClient.signOut();
  redirect('/');
}

/**
 * calculate the delivery date after order placement
 */
export async function getClosestDeliveryDate() {
  return getClosestOrderDeliveryDate(await getCalendarEvents());
}

export async function setCartCookie(value: string) {
  return getNextServerCookiesStorage().setItem('cart', value);
}

export async function getCartCookie() {
  return getNextServerCookiesStorage().getItem('cart');
}

export async function deleteCartCookie() {
  return getNextServerCookiesStorage().removeItem('cart');
}
