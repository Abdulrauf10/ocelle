'use server';

import { getCalendarEvents } from './helpers/calendar';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import { getClosestOrderDeliveryDate } from './helpers/dog';
import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { executeGraphQL } from './helpers/graphql';
import { GetCurrentUserDocument, GetCurrentUserFullSizeDocument } from './gql/graphql';
import { cookies } from 'next/headers';
import { executeQuery } from './helpers/queryRunner';
import { User } from './entities';
import { CART_COOKIE, CHECKOUT_COOKIE, DOG_SELECT_COOKIE, LOGIN_PATH } from './consts';

// here for global actions

export async function getClientLoginedMe() {
  const { me } = await executeGraphQL(GetCurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    return null;
  }

  const user = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(User, { where: { id: me.id } });
  });

  if (!user) {
    return null;
  }

  return { ...user, ...me };
}

export async function getLoginedMe() {
  const { me } = await executeGraphQL(GetCurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw redirect(LOGIN_PATH);
  }

  const user = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(User, {
      where: { id: me.id },
      relations: {
        dogs: {
          plan: true,
          breeds: { breed: true },
        },
      },
    });
  });

  if (!user) {
    throw redirect(LOGIN_PATH);
  }

  return { ...user, ...me };
}

export async function getLoginedMeFullSize() {
  const { me } = await executeGraphQL(GetCurrentUserFullSizeDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw redirect(LOGIN_PATH);
  }

  const user = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(User, {
      where: { id: me.id },
      relations: {
        dogs: {
          plan: true,
          breeds: { breed: true },
        },
      },
    });
  });

  if (!user) {
    throw redirect(LOGIN_PATH);
  }

  return { ...user, ...me };
}

export async function logout() {
  saleorAuthClient.signOut();
  redirect(LOGIN_PATH);
}

/**
 * calculate the delivery date after order placement
 */
export async function getClosestDeliveryDate() {
  return getClosestOrderDeliveryDate(await getCalendarEvents());
}

export async function setCartCookie(value: string) {
  return getNextServerCookiesStorage().setItem(CART_COOKIE, value);
}

export async function getCartCookie() {
  return getNextServerCookiesStorage().getItem(CART_COOKIE);
}

export async function deleteCartCookie() {
  return getNextServerCookiesStorage().removeItem(CART_COOKIE);
}

export async function setCheckoutCookie(value: string) {
  return getNextServerCookiesStorage().setItem(CHECKOUT_COOKIE, value);
}

export async function getCheckoutCookie() {
  return getNextServerCookiesStorage().getItem(CHECKOUT_COOKIE);
}

export async function deleteCheckoutCookie() {
  return getNextServerCookiesStorage().removeItem(CHECKOUT_COOKIE);
}

export async function getCurrentSelectedDogIdCookie() {
  return cookies().get(DOG_SELECT_COOKIE)?.value;
}
