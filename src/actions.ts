'use server';

import { getNextServerCookiesStorage } from '@saleor/auth-sdk/next/server';
import { cookies } from 'next/headers';
import invariant from 'ts-invariant';

import { CART_COOKIE, DOG_SELECT_COOKIE, LOGIN_PATH, ORDER_COOKIE } from './consts';
import { Breed, User } from './entities';
import {
  AddressValidationRulesDocument,
  CountryCode,
  GetCheckoutDocument,
  GetCurrentUserDocument,
  GetCurrentUserFullSizeDocument,
} from './gql/graphql';
import { executeGraphQL } from './helpers/graphql';
import { executeQuery } from './helpers/queryRunner';
import { getRecurringBoxMinDeliveryDate } from './helpers/shipment';
import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';
import { getCalendarEvents } from './services/calendar';
import { BreedDto } from './types/dto';

// here for global actions

export async function getEvents() {
  return await getCalendarEvents();
}

export async function getBreeds(): Promise<BreedDto[]> {
  const breeds = await executeQuery(async (queryRunner) => await queryRunner.manager.find(Breed));
  return breeds.map((breed) => {
    return {
      id: breed.id,
      name: breed.name,
      size: breed.size,
      uid: breed.uid,
    };
  });
}

export async function getDistricts(locale: string, countryArea: CountryCode) {
  const { addressValidationRules } = await executeGraphQL(AddressValidationRulesDocument, {
    variables: {
      countryArea,
    },
  });

  if (!addressValidationRules) {
    throw new Error('failed to get districts');
  }

  const districts: Array<{ raw: string; verbose: string }> = [];

  for (const city of addressValidationRules.cityChoices) {
    if (city.raw && city.verbose) {
      if (locale === 'en') {
        if (/^[a-zA-Z\s]+$/.test(city.verbose)) {
          districts.push({
            raw: city.raw,
            verbose: city.verbose,
          });
        }
      } else {
        districts.push({
          raw: city.raw,
          verbose: city.verbose,
        });
      }
    }
  }

  districts.sort((a, b) => {
    if (a.verbose < b.verbose) {
      return -1;
    }
    if (a.verbose > b.verbose) {
      return 1;
    }
    return 0;
  });

  return districts;
}

export async function getCart() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const cartOrCheckoutId = await getCartCookie();

  if (cartOrCheckoutId) {
    const { checkout } = await executeGraphQL(GetCheckoutDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { id: cartOrCheckoutId },
    });
    if (checkout) {
      return checkout;
    }
  }
}

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
