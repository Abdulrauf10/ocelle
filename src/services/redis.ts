import { Redis } from 'ioredis';
import invariant from 'ts-invariant';

import { CalendarEvent } from '@/types';
import { DogDto } from '@/types/dto';

invariant(process.env.REDIS_PREFIX, 'Missing REDIS_PREFIX env variable');

const TEXT_TO_SPEECH_PARAMS_EX = 60 * 60 * 24 * 30; // cache alive 30 days
const CHECKOUT_PARAMS_EX = 60 * 60 * 24 * 60; // cache alive 60 days

class RedisService {
  createRedisClient() {
    return new Redis();
  }

  async getCalendarEvents() {
    const value = await this.createRedisClient().get(`${process.env.REDIS_PREFIX}:calendar-events`);
    if (value === null) {
      return value;
    }
    return JSON.parse(value) as CalendarEvent[];
  }

  async setCalendarEvents(calendar: CalendarEvent[]) {
    return this.createRedisClient().set(
      `${process.env.REDIS_PREFIX}:calendar-events`,
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
