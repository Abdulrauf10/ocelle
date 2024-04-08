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
import { CART_COOKIE, CHECKOUT_COOKIE, DOG_SELECT_COOKIE } from './consts';

// here for global actions

export async function getLoginedMeWithoutRedirect() {
  const { me } = await executeGraphQL(GetCurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw new Error('cannot find logined user');
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
    throw new Error('cannot find logined user');
  }

  return { ...user, ...me };
}

export async function getLoginedMe() {
  const { me } = await executeGraphQL(GetCurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw redirect('/auth/login');
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
    throw redirect('/auth/login');
  }

  return { ...user, ...me };
}

export async function getLoginedMeFullSize() {
  const { me } = await executeGraphQL(GetCurrentUserFullSizeDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw redirect('/auth/login');
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
    throw redirect('/auth/login');
  }

  return { ...user, ...me };
}

export async function logout() {
  saleorAuthClient.signOut();
  redirect('/auth/login');
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
