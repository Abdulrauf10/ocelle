'use server';

import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { cookies } from 'next/headers';

import { CART_COOKIE, DOG_SELECT_COOKIE, LOGIN_PATH, ORDER_COOKIE } from './consts';
import { User } from './entities';
import { GetCurrentUserDocument, GetCurrentUserFullSizeDocument } from './gql/graphql';
import { executeGraphQL } from './helpers/graphql';
import { executeQuery } from './helpers/queryRunner';
import { getRecurringBoxMinDeliveryDate } from './helpers/shipment';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import { getCalendarEvents } from './services/calendar';

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
        orders: true,
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
        orders: true,
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
  return getRecurringBoxMinDeliveryDate(await getCalendarEvents()).toISOString();
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

export async function setOrderCookie(value: string) {
  return getNextServerCookiesStorage().setItem(ORDER_COOKIE, value);
}

export async function getOrderCookie() {
  return getNextServerCookiesStorage().getItem(ORDER_COOKIE);
}

export async function deleteOrderCookie() {
  return getNextServerCookiesStorage().removeItem(ORDER_COOKIE);
}

export async function getCurrentSelectedDogIdCookie() {
  const value = cookies().get(DOG_SELECT_COOKIE)?.value;
  if (value) {
    try {
      return parseInt(value);
    } catch (e) {
      //
    }
  }
}
