'use server';

import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { cookies } from 'next/headers';

import { CART_COOKIE, DOG_SELECT_COOKIE, LOGIN_PATH, ORDER_COOKIE } from './consts';
import { CountryCode } from './gql/graphql';
import { getRecurringBoxMinDeliveryDate } from './helpers/shipment';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import breedService from './services/breed';
import calendarService from './services/calendar';
import checkoutService, { CheckoutNotFoundError } from './services/checkout';
import shippingService from './services/shipping';
import userService, { UserMeError, UserNotFoundError } from './services/user';
import { BreedDto } from './types/dto';

// here for global actions

export async function getEvents() {
  return await calendarService.getCalendarEvents();
}

export async function getBreeds(): Promise<BreedDto[]> {
  const breeds = await breedService.list();
  return breeds.map((breed) => {
    return { id: breed.id, name: breed.name, size: breed.size, uid: breed.uid };
  });
}

export async function getDistricts(locale: string, countryArea: CountryCode) {
  return shippingService.districts(locale, countryArea);
}

export async function getCart() {
  const cartId = await getCartCookie();

  if (!cartId) {
    return undefined;
  }

  try {
    return await checkoutService.getById(cartId);
  } catch (err) {
    if (err instanceof CheckoutNotFoundError) {
      return undefined;
    } else {
      throw err;
    }
  }
}

export async function getClientLoginedMe() {
  try {
    return structuredClone(await userService.me());
  } catch (err) {
    if (err instanceof UserMeError) {
      return undefined;
    } else {
      throw err;
    }
  }
}

export async function getLoginedMe() {
  try {
    return await userService.me();
  } catch (err) {
    throw err instanceof UserMeError ? redirect(LOGIN_PATH) : err;
  }
}

export async function getLoginedMeFullSize() {
  try {
    return await userService.meFullsize();
  } catch (err) {
    throw err instanceof UserMeError ? redirect(LOGIN_PATH) : err;
  }
}

export async function logout() {
  saleorAuthClient.signOut();
  redirect(LOGIN_PATH);
}

export async function isAvailableEmailAddress(email: string) {
  try {
    await userService.find(email);
    return false;
  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return true;
    }
    throw err;
  }
}

/**
 * calculate the delivery date after order placement
 */
export async function getClosestDeliveryDate() {
  return getRecurringBoxMinDeliveryDate(await calendarService.getCalendarEvents()).toISOString();
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

export async function getCurrentSelectedDogIdCookie(defaultValue: number) {
  const value = cookies().get(DOG_SELECT_COOKIE)?.value;
  if (value) {
    try {
      return parseInt(value);
    } catch (e) {
      //
    }
  } else {
    // cookies().set(DOG_SELECT_COOKIE, defaultValue.toString());
    return defaultValue;
  }
}
