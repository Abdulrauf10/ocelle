'use server';

import { startOfDay, subDays } from 'date-fns';
import { RedirectType } from 'next/navigation';
import invariant from 'ts-invariant';

import { HandleMutateDraftOrderAction } from './types';
import { handleMutateDraftOrderActionSchema } from './validators';

import { deleteOrderCookie, getOrderCookie, setOrderCookie } from '@/actions';
import stripeClient from '@/clients/stripe';
import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import { OrderDiscountType, OrderFragment, OrderLineFragment } from '@/gql/graphql';
import {
  getRecurringBoxMinDeliveryDate,
  isLegalDeliveryDate,
  isOperationDate,
} from '@/helpers/shipment';
import { redirect } from '@/navigation';
import breedService from '@/services/breed';
import calendarService from '@/services/calendar';
import orderService from '@/services/order';
import PriceService from '@/services/price';
import recurringService from '@/services/recurring';
import redisService from '@/services/redis';
import userService from '@/services/user';
import { BreedDto, CartReturn, DogDto, MinPricesDto } from '@/types/dto';

export async function calculateDogsTotalPerDayPrice(dogs: DogDto[]) {
  const values = [];
  for (const dog of dogs) {
    const breeds =
      dog.breeds && dog.breeds.length > 0 ? await breedService.getByIds(dog.breeds) : [];
    const price = await PriceService.calculatePerDayBoxPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: dog.recipe1, recipe2: dog.recipe2 },
      dog.mealPlan,
      Frequency.TwoWeek,
      dog.isEnabledTransitionPeriod
    );
    values.push({ name: dog.name, price });
  }
  return values;
}

export async function getBoxPrices(
  breeds: BreedDto[],
  dateOfBirth: string,
  isNeutered: boolean,
  weight: number,
  bodyCondition: BodyCondition,
  activityLevel: ActivityLevel,
  { recipe1, recipe2 }: { recipe1?: Recipe; recipe2?: Recipe },
  mealPlan: MealPlan,
  isEnabledTransitionPeriod: boolean
) {
  const discount = 0.5;
  if (!recipe1) {
    return {
      total: 0,
      daily: 0,
      discountedTotal: 0,
      discountedDaily: 0,
    };
  }
  return {
    total: await PriceService.calculateBoxPrice(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      isEnabledTransitionPeriod
    ),
    daily: await PriceService.calculatePerDayBoxPrice(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      isEnabledTransitionPeriod
    ),
    discountedTotal: await PriceService.calculateDiscountedBoxPrice(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      isEnabledTransitionPeriod,
      discount
    ),
    discountedDaily: await PriceService.calculateDiscountedPerDayBoxPrice(
      breeds,
      new Date(dateOfBirth),
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      { recipe1, recipe2 },
      mealPlan,
      Frequency.TwoWeek,
      isEnabledTransitionPeriod,
      discount
    ),
  };
}

export async function getMinPerDayPrice(
  dog: Pick<
    DogDto,
    | 'breeds'
    | 'dateOfBirth'
    | 'isNeutered'
    | 'weight'
    | 'bodyCondition'
    | 'activityLevel'
    | 'foodAllergies'
  >
): Promise<MinPricesDto> {
  const breeds = dog.breeds && dog.breeds.length > 0 ? await breedService.getByIds(dog.breeds) : [];
  return {
    halfPlan: await PriceService.findMinPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      dog.foodAllergies,
      MealPlan.Half,
      Frequency.TwoWeek,
      0.5
    ),
    fullPlan: await PriceService.findMinPerDayPrice(
      breeds,
      new Date(dog.dateOfBirth),
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      dog.foodAllergies,
      MealPlan.Full,
      Frequency.TwoWeek,
      0.5
    ),
  };
}

async function getOrder(): Promise<OrderFragment> {
  const orderId = await getOrderCookie();

  if (!orderId) {
    throw new Error('order id cannot be found');
  }

  return orderService.getById(orderId);
}

export async function createDraftOrder(dogs: DogDto[]) {
  const dogsCreate = [];

  for (const dog of dogs) {
    dogsCreate.push({
      breeds: dog.breeds && dog.breeds.length > 0 ? await breedService.getByIds(dog.breeds) : [],
      dateOfBirth: new Date(dog.dateOfBirth),
      isNeutered: dog.isNeutered,
      weight: dog.weight,
      bodyCondition: dog.bodyCondition,
      activityLevel: dog.activityLevel,
      recipe1: dog.recipe1,
      recipe2: dog.recipe2,
      mealPlan: dog.mealPlan,
      frequency: Frequency.TwoWeek,
      isEnabledTransitionPeriod: dog.isEnabledTransitionPeriod,
    });
  }

  const order = await orderService.create(dogsCreate, true);

  await redisService.setStoreDogs(order.id, dogs);

  const prevOrderId = await getOrderCookie();

  if (prevOrderId) {
    // try to cancel all transactions of the prev draft order, slient mode
    try {
      await orderService.cancelOrderTransactions(prevOrderId);
    } catch (e) {
      console.error(e);
    }
  }

  await setOrderCookie(order.id);

  return order;
}

export async function initializeStripeTranscation() {
  const order = await getOrder();

  const { transaction, data } = await orderService.initialTransaction(order.id, {
    automatic_payment_methods: {
      enabled: true,
    },
    setup_future_usage: 'off_session',
  });

  const paymentIntent = await stripeClient.retrivePaymentIntent(transaction.pspReference);

  await redisService.setStorePaymentIntent(order.id, paymentIntent.id);

  return data;
}

export async function applyCoupon({ coupon }: { coupon: string }) {
  const { id } = await getOrder();

  return await orderService.update(id, { voucherCode: coupon });
}

export async function handleMutateDraftOrder(data: HandleMutateDraftOrderAction) {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { value, error } = handleMutateDraftOrderActionSchema.validate(data);

  if (error) {
    console.log(error);
    throw new Error('schema is not valid');
  }

  const order = await getOrder();
  const paymentIntent = await redisService.getStorePaymentIntent(order.id);

  const calendarEvents = await calendarService.getCalendarEvents();

  if (!paymentIntent) {
    throw new Error('payment intent not found');
  }

  if (
    !isOperationDate(subDays(value.deliveryDate, 1), calendarEvents) ||
    !isLegalDeliveryDate(value.deliveryDate, calendarEvents) ||
    getRecurringBoxMinDeliveryDate(calendarEvents) > startOfDay(value.deliveryDate)
  ) {
    throw new Error('delivery date is unavailable');
  }

  await redisService.setStoreEmail(order.id, value.email);
  await redisService.setStoreDeliveryDate(order.id, value.deliveryDate);

  const user = await userService.findOrCreate(
    value.firstName,
    value.lastName,
    value.email,
    value.password,
    value.isSameBillingAddress ?? false,
    value.phone,
    value.whatsapp
  );

  await userService.updateAndSetDefaultAddress(
    user.id,
    value.deliveryAddress,
    value.isSameBillingAddress ? undefined : value.billingAddress
  );

  const customer = await userService.attachStripe(user.id);

  if (!order.user) {
    await orderService.update(order.id, { user: user.id });
  } else if (order.user.id !== user.id) {
    throw new Error('incorrect user id of the current draft order');
  }

  await orderService.updateAddress(
    order.id,
    value.deliveryAddress,
    value.isSameBillingAddress ? value.deliveryAddress : value.billingAddress!
  );

  // link user to the payment intent
  await stripeClient.updatePaymentIntent(paymentIntent, { customer });
}

export async function finalizeDraftOrder(paymentMethodId: string) {
  try {
    const { id, shippingMethods, user: orderUser } = await getOrder();
    const surveyDogs = await redisService.getStoreDogs(id);
    const deliveryDate = await redisService.getStoreDeliveryDate(id);

    if (shippingMethods.length === 0) {
      throw new Error('there have no available shipping method');
    }

    if (deliveryDate === null || surveyDogs === null) {
      throw new Error(
        'receive incompleted checkout, reason: ' +
          (deliveryDate === null || surveyDogs === null
            ? 'params not available'
            : 'checkout is not authorized')
      );
    }

    if (!orderUser) {
      throw new Error('checkout is not linked with user, please contact ocelle for more.');
    }

    await orderService.update(id, { shippingMethod: shippingMethods[0].id });

    const order = await orderService.complete(id);

    const user = await userService.getById(orderUser.id);

    if (!user.stripe) {
      throw new Error('user is not linked with stripe');
    }

    await stripeClient.attachPaymentMethod(paymentMethodId, user.stripe);
    await userService.attachStripePaymentMethod(user.id, paymentMethodId);

    await recurringService.setup(user.id, surveyDogs, deliveryDate, order);
  } catch (e) {
    console.error(e);
    throw e;
  }

  redirect('/get-started/complete', RedirectType.replace);
}

export async function getOrderConfigurations() {
  const id = await getOrderCookie();

  if (!id) {
    return undefined;
  }

  const deliveryDate = await redisService.getStoreDeliveryDate(id);

  await redisService.deleteStoreKeys(id);

  if (!deliveryDate) {
    return undefined;
  }

  return {
    deliveryDate,
  };
}

export async function dropOrderSession() {
  await deleteOrderCookie();
}
