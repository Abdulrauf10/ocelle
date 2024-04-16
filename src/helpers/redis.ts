import { OrderSize } from '@/enums';
import { DogDto } from '@/types/dto';
import { Redis } from 'ioredis';
import invariant from 'ts-invariant';

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
  const value = await createRedisClient().get(
    `${process.env.REDIS_PREFIX}:checkout:deliveryDate:${checkoutId}`
  );
  if (value === null) {
    return value;
  }
  return typeof value === 'string' ? new Date(value) : (value as undefined);
}

export async function setCheckoutDeliveryDate(checkoutId: string, deliveryDate: Date) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout:deliveryDate:${checkoutId}`,
    deliveryDate.toISOString(),
    'EX',
    CHECKOUT_PARAMS_EX
  );
}

export async function getCheckoutDogs(checkoutId: string) {
  const value = await createRedisClient().get(
    `${process.env.REDIS_PREFIX}:checkout:dogs:${checkoutId}`
  );
  if (value === null) {
    return value;
  }
  return JSON.parse(value) as DogDto[];
}

export async function setCheckoutDogs(checkoutId: string, dogs: DogDto[]) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout:dogs:${checkoutId}`,
    JSON.stringify(dogs),
    'EX',
    CHECKOUT_PARAMS_EX
  );
}

export async function getCheckoutOrderSize(checkoutId: string) {
  const value = await createRedisClient().get(
    `${process.env.REDIS_PREFIX}:checkout:orderSize:${checkoutId}`
  );
  if (value === null) {
    return value;
  }
  return parseInt(value) as OrderSize;
}

export async function setCheckoutOrderSize(checkoutId: string, orderSize: OrderSize) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout:orderSize:${checkoutId}`,
    orderSize,
    'EX',
    CHECKOUT_PARAMS_EX
  );
}

export async function getCheckoutEmail(checkoutId: string) {
  const value = await createRedisClient().get(
    `${process.env.REDIS_PREFIX}:checkout:email:${checkoutId}`
  );
  return value;
}

export async function setCheckoutEmail(checkoutId: string, email: string) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout:email:${checkoutId}`,
    email,
    'EX',
    CHECKOUT_PARAMS_EX
  );
}

export async function getCheckoutPaymentIntent(checkoutId: string) {
  const value = await createRedisClient().get(
    `${process.env.REDIS_PREFIX}:checkout:paymentIntent:${checkoutId}`
  );
  return value;
}

export async function setCheckoutPaymentIntent(checkoutId: string, paymentIntent: string) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout:paymentIntent:${checkoutId}`,
    paymentIntent,
    'EX',
    CHECKOUT_PARAMS_EX
  );
}
