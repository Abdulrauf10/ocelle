'use server';

import { getCalendarEvents } from './helpers/calendar';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import { getClosestOrderDeliveryDate } from './helpers/dog';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { executeGraphQL } from './helpers/graphql';
import { CurrentUserDocument } from './gql/graphql';

// here for global actions

const isDebugMode = true;

export async function getLoginedMe() {
  if (isDebugMode) {
    return {
      id: '1',
      email: 'string',
      firstName: 'Kevan',
      lastName: 'Wong',
    };
  }

  const { me } = await executeGraphQL(CurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw redirect('/auth/login');
  }

  return me;
}

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

export async function setCheckoutCookie(value: string) {
  return getNextServerCookiesStorage().setItem('checkout', value);
}

export async function getCheckoutCookie() {
  return getNextServerCookiesStorage().getItem('checkout');
}

export async function deleteCheckoutCookie() {
  return getNextServerCookiesStorage().removeItem('checkout');
}
