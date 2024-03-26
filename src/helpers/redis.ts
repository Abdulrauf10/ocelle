import { MealPlan, OrderSize, Recipe } from '@/enums';
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

export async function getCheckoutParameters(checkoutId: string) {
  const value = await createRedisClient().get(`${process.env.REDIS_PREFIX}:checkout-${checkoutId}`);
  if (value === null) {
    return value;
  }
  const json = JSON.parse(value);
  return {
    email: json.email as string,
    orderSize: json.orderSize as OrderSize,
    dogs: json.dogs as DogDto[],
    deliveryDate:
      typeof json.deliveryDate === 'string'
        ? new Date(json.deliveryDate)
        : (json.deliveryDate as undefined),
  };
}

export async function setCheckoutParameters(
  checkoutId: string,
  email: string,
  orderSize: OrderSize,
  dogs: DogDto[],
  deliveryDate?: Date
) {
  return createRedisClient().set(
    `${process.env.REDIS_PREFIX}:checkout-${checkoutId}`,
    JSON.stringify({
      email,
      orderSize,
      dogs,
      deliveryDate,
    }),
    'EX',
    60 * 60 * 24 * 60 // cache alive 60 days
  );
}
