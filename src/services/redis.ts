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

class RedisService {
  createRedisClient() {
    return new Redis();
  }

  async get1823PublicHolidays() {
    const value = await this.createRedisClient().get(
      `${process.env.REDIS_PREFIX}:1823-public-holidays`
    );
    if (value === null) {
      return value;
    }
    return JSON.parse(value) as I1823ICalendar;
  }

  async set1823PublicHolidays(calendar: I1823ICalendar) {
    return this.createRedisClient().set(
      `${process.env.REDIS_PREFIX}:1823-public-holidays`,
      JSON.stringify(calendar),
      'EX',
      60 * 60 * 24 * 30 // cache alive 30 days
    );
  }

  async getOcelleTextToSpeech() {
    const value = await this.createRedisClient().get(
      `${process.env.REDIS_PREFIX}:ocelle-text-to-speech`
    );
    if (value === null) {
      return value;
    }
    return new Uint8Array(Buffer.from(value, 'base64'));
  }

  async setOcelleTextToSpeech(array: Uint8Array) {
    return this.createRedisClient().set(
      `${process.env.REDIS_PREFIX}:ocelle-text-to-speech`,
      Buffer.from(array).toString('base64'),
      'EX',
      TEXT_TO_SPEECH_PARAMS_EX
    );
  }

  async getStoreDeliveryDate(id: string) {
    const k = `${process.env.REDIS_PREFIX}:store:deliveryDate:${id}`;
    const value = await this.createRedisClient().get(k);
    if (value === null) {
      return value;
    }
    return typeof value === 'string' ? new Date(value) : value;
  }

  async setStoreDeliveryDate(id: string, deliveryDate?: Date) {
    const k = `${process.env.REDIS_PREFIX}:store:deliveryDate:${id}`;
    if (!deliveryDate) {
      return this.createRedisClient().del(k);
    }
    return this.createRedisClient().set(k, deliveryDate.toISOString(), 'EX', CHECKOUT_PARAMS_EX);
  }

  async getStoreDogs(id: string) {
    const k = `${process.env.REDIS_PREFIX}:store:dogs:${id}`;
    const value = await this.createRedisClient().get(k);
    if (value === null) {
      return value;
    }
    return JSON.parse(value) as DogDto[];
  }

  async setStoreDogs(id: string, dogs?: DogDto[]) {
    const k = `${process.env.REDIS_PREFIX}:store:dogs:${id}`;
    if (!dogs) {
      return this.createRedisClient().del(k);
    }
    return this.createRedisClient().set(k, JSON.stringify(dogs), 'EX', CHECKOUT_PARAMS_EX);
  }

  async getStoreEmail(id: string) {
    const k = `${process.env.REDIS_PREFIX}:store:email:${id}`;
    const value = await this.createRedisClient().get(k);
    return value;
  }

  async setStoreEmail(id: string, email?: string) {
    const k = `${process.env.REDIS_PREFIX}:store:email:${id}`;
    if (!email) {
      return this.createRedisClient().del(k);
    }
    return this.createRedisClient().set(k, email, 'EX', CHECKOUT_PARAMS_EX);
  }

  async getStorePaymentIntent(id: string) {
    const k = `${process.env.REDIS_PREFIX}:store:paymentIntent:${id}`;
    const value = await this.createRedisClient().get(k);
    return value;
  }

  async setStorePaymentIntent(id: string, paymentIntent?: string) {
    const k = `${process.env.REDIS_PREFIX}:store:paymentIntent:${id}`;
    if (!paymentIntent) {
      return this.createRedisClient().del(k);
    }
    return this.createRedisClient().set(k, paymentIntent, 'EX', CHECKOUT_PARAMS_EX);
  }

  async deleteStoreKeys(id: string) {
    await this.setStoreEmail(id);
    await this.setStoreDogs(id);
    await this.setStoreDeliveryDate(id);
    await this.setStorePaymentIntent(id);
  }
}

const redisService = new RedisService();

export default redisService;
