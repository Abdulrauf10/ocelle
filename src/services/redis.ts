import { Redis } from 'ioredis';
import invariant from 'ts-invariant';

import { OrderSize } from '@/enums';
import { DogDto } from '@/types/dto';

invariant(process.env.REDIS_PREFIX, 'Missing REDIS_PREFIX env variable');

interface I1823ICalendar {
  vcalendar: Array<{
    prodid: string;
    version: string;
    calscale: string;
    'x-wr-calname': string;
    'x-wr-caldesc': string;
    'x-wr-timezone': string;
    vevent: Array<{
      uid: string;
      transp: string;
      summary: string;
      dtstart: [string, { value: string }];
      dtend: [string, { value: string }];
    }>;
  }>;
}

const CHECKOUT_PARAMS_EX = 60 * 60 * 24 * 60; // cache alive 60 days

export function createRedisClient() {
  return new Redis();
}

export async function get1823PublicHolidays() {
  const value = await createRedisClient().get(`${process.env.REDIS_PREFIX}:1823-public-holidays`);
  if (value === null) {
    return value;
  }
  return JSON.parse(value) as I1823ICalendar;
}

export async function set1823PublicHolidays(calendar: I1823ICalendar) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:1823-public-holidays`,
    JSON.stringify(calendar),
    'EX',
    60 * 60 * 24 * 30 // cache alive 30 days
  );
}

export async function getCheckoutDeliveryDate(checkoutId: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:deliveryDate:${checkoutId}`;
  const value = await createRedisClient().get(k);
  if (value === null) {
    return value;
  }
  return typeof value === 'string' ? new Date(value) : value;
}

export async function setCheckoutDeliveryDate(checkoutId: string, deliveryDate?: Date) {
  const k = `${process.env.REDIS_PREFIX}:checkout:deliveryDate:${checkoutId}`;
  if (!deliveryDate) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, deliveryDate.toISOString(), 'EX', CHECKOUT_PARAMS_EX);
}

export async function getCheckoutDogs(checkoutId: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:dogs:${checkoutId}`;
  const value = await createRedisClient().get(k);
  if (value === null) {
    return value;
  }
  return JSON.parse(value) as DogDto[];
}

export async function setCheckoutDogs(checkoutId: string, dogs?: DogDto[]) {
  const k = `${process.env.REDIS_PREFIX}:checkout:dogs:${checkoutId}`;
  if (!dogs) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, JSON.stringify(dogs), 'EX', CHECKOUT_PARAMS_EX);
}

export async function getCheckoutOrderSize(checkoutId: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:orderSize:${checkoutId}`;
  const value = await createRedisClient().get(k);
  if (value === null) {
    return value;
  }
  return parseInt(value) as OrderSize;
}

export async function setCheckoutOrderSize(checkoutId: string, orderSize?: OrderSize) {
  const k = `${process.env.REDIS_PREFIX}:checkout:orderSize:${checkoutId}`;
  if (!orderSize) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, orderSize, 'EX', CHECKOUT_PARAMS_EX);
}

export async function getCheckoutEmail(checkoutId: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:email:${checkoutId}`;
  const value = await createRedisClient().get(k);
  return value;
}

export async function setCheckoutEmail(checkoutId: string, email?: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:email:${checkoutId}`;
  if (!email) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, email, 'EX', CHECKOUT_PARAMS_EX);
}

export async function getCheckoutPaymentIntent(checkoutId: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:paymentIntent:${checkoutId}`;
  const value = await createRedisClient().get(k);
  return value;
}

export async function setCheckoutPaymentIntent(checkoutId: string, paymentIntent?: string) {
  const k = `${process.env.REDIS_PREFIX}:checkout:paymentIntent:${checkoutId}`;
  if (!paymentIntent) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, paymentIntent, 'EX', CHECKOUT_PARAMS_EX);
}

export async function deleteCheckoutKeys(checkoutId: string) {
  await setCheckoutEmail(checkoutId);
  await setCheckoutDogs(checkoutId);
  await setCheckoutDeliveryDate(checkoutId);
  await setCheckoutOrderSize(checkoutId);
  await setCheckoutPaymentIntent(checkoutId);
}
