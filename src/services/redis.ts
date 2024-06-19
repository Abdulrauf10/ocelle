import { Redis } from 'ioredis';
import invariant from 'ts-invariant';

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

const TEXT_TO_SPEECH_PARAMS_EX = 60 * 60 * 24 * 30; // cache alive 30 days
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

export async function getOcelleTextToSpeech() {
  const value = await createRedisClient().get(`${process.env.REDIS_PREFIX}:ocelle-text-to-speech`);
  if (value === null) {
    return value;
  }
  return new Uint8Array(Buffer.from(value, 'base64'));
}

export async function setOcelleTextToSpeech(array: Uint8Array) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:ocelle-text-to-speech`,
    Buffer.from(array).toString('base64'),
    'EX',
    TEXT_TO_SPEECH_PARAMS_EX
  );
}

export async function getStoreDeliveryDate(id: string) {
  const k = `${process.env.REDIS_PREFIX}:store:deliveryDate:${id}`;
  const value = await createRedisClient().get(k);
  if (value === null) {
    return value;
  }
  return typeof value === 'string' ? new Date(value) : value;
}

export async function setStoreDeliveryDate(id: string, deliveryDate?: Date) {
  const k = `${process.env.REDIS_PREFIX}:store:deliveryDate:${id}`;
  if (!deliveryDate) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, deliveryDate.toISOString(), 'EX', CHECKOUT_PARAMS_EX);
}

export async function getStoreDogs(id: string) {
  const k = `${process.env.REDIS_PREFIX}:store:dogs:${id}`;
  const value = await createRedisClient().get(k);
  if (value === null) {
    return value;
  }
  return JSON.parse(value) as DogDto[];
}

export async function setStoreDogs(id: string, dogs?: DogDto[]) {
  const k = `${process.env.REDIS_PREFIX}:store:dogs:${id}`;
  if (!dogs) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, JSON.stringify(dogs), 'EX', CHECKOUT_PARAMS_EX);
}

export async function getStoreEmail(id: string) {
  const k = `${process.env.REDIS_PREFIX}:store:email:${id}`;
  const value = await createRedisClient().get(k);
  return value;
}

export async function setStoreEmail(id: string, email?: string) {
  const k = `${process.env.REDIS_PREFIX}:store:email:${id}`;
  if (!email) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, email, 'EX', CHECKOUT_PARAMS_EX);
}

export async function getStorePaymentIntent(id: string) {
  const k = `${process.env.REDIS_PREFIX}:store:paymentIntent:${id}`;
  const value = await createRedisClient().get(k);
  return value;
}

export async function setStorePaymentIntent(id: string, paymentIntent?: string) {
  const k = `${process.env.REDIS_PREFIX}:store:paymentIntent:${id}`;
  if (!paymentIntent) {
    return createRedisClient().del(k);
  }
  return createRedisClient().set(k, paymentIntent, 'EX', CHECKOUT_PARAMS_EX);
}

export async function deleteStoreKeys(id: string) {
  await setStoreEmail(id);
  await setStoreDogs(id);
  await setStoreDeliveryDate(id);
  await setStorePaymentIntent(id);
}
