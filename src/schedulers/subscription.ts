import { DEFUALT_SHIPPING_ZONE, SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import { OrderSize } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import {
  CompleteDraftOrderDocument,
  CreateDraftOrderDocument,
  FindShippingZonesDocument,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
} from '@/gql/graphql';
import { findProducts, getThrowableChannel } from '@/helpers/api';
import { awaitable } from '@/helpers/async';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  calculateRecipeTotalPriceInBox,
  getClosestOrderDeliveryDate,
  getEditableRecurringBoxDeadline,
  getSubscriptionProductActuallyQuanlityInSaleor,
} from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { recipeToVariant } from '@/helpers/saleor';
import { addDays, startOfDay } from 'date-fns';
import invariant from 'ts-invariant';
import { In, IsNull, LessThan } from 'typeorm';

async function findSubscriptionShippingMethod() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { shippingZones } = await executeGraphQL(FindShippingZonesDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      filter: {
        search: DEFUALT_SHIPPING_ZONE,
      },
    },
  });

  const shippingZone = shippingZones && shippingZones.edges[0].node;

  if (!shippingZone) {
    throw new Error('cannot find shipping zone');
  }

  const shippingMethod = shippingZone.shippingMethods?.find(
    (shippingMethod) => shippingMethod.name === SHIPPING_METHOD_SF_EXPRESS_FREE
  );

  if (!shippingMethod) {
    throw new Error('cannot find shipping method');
  }

  return shippingMethod;
}

export default async function subscriptionScheduler() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');
  const today = startOfDay(new Date());
  const events = await getCalendarEvents();
  const shippingMethod = await findSubscriptionShippingMethod();
  const channel = await getThrowableChannel();
  const products = await findProducts();
  const users = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(User, {
      where: {
        dogs: {
          boxs: {
            order: IsNull(),
            shipment: {
              lockBoxDate: LessThan(today),
            },
          },
        },
      },
      relations: {
        dogs: {
          breeds: {
            breed: true,
          },
          plan: true,
          boxs: {
            shipment: true,
          },
        },
      },
    });
  });
  for (const user of users) {
    try {
      if (!user.stripe || !user.stripePaymentMethod) {
        throw new StripeNotReadyError(user.id);
      }
      const records: Array<{ plan: DogPlan; box: RecurringBox }> = [];
      const lines = [];
      for (const dog of user.dogs) {
        const box = dog.boxs[0];
        const breeds = dog.breeds.map((x) => x.breed);
        const recipe1Variant = recipeToVariant(products, breeds, dog.dateOfBirth, box.recipe1);
        if (!recipe1Variant) {
          throw new Error('recipe1 variant not found in saleor');
        }
        const recipe1TotalPrice = calculateRecipeTotalPriceInBox(
          breeds,
          dog.dateOfBirth,
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipeToBeCalcuate: box.recipe1, recipeReference: box.recipe2 },
          box.mealPlan,
          OrderSize.TwoWeek,
          box.isTransitionPeriod
        );
        lines.push({
          variantId: recipe1Variant.id,
          quantity: getSubscriptionProductActuallyQuanlityInSaleor(recipe1TotalPrice),
        });
        if (box.recipe2) {
          const recipe2Variant = recipeToVariant(products, breeds, dog.dateOfBirth, box.recipe2);
          if (!recipe2Variant) {
            throw new Error('recipe2 variant not found in saleor');
          }
          const recipe2TotalPrice = calculateRecipeTotalPriceInBox(
            breeds,
            dog.dateOfBirth,
            dog.isNeutered,
            dog.weight,
            dog.bodyCondition,
            dog.activityLevel,
            { recipeToBeCalcuate: box.recipe2, recipeReference: box.recipe1 },
            box.mealPlan,
            OrderSize.TwoWeek,
            box.isTransitionPeriod
          );
          lines.push({
            variantId: recipe2Variant.id,
            quantity: getSubscriptionProductActuallyQuanlityInSaleor(recipe2TotalPrice),
          });
        }
        records.push({ plan: dog.plan, box });
      }

      const { draftOrderCreate } = await executeGraphQL(CreateDraftOrderDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          input: {
            user: user.id,
            channelId: channel.id,
            shippingMethod: shippingMethod.id,
            lines,
          },
        },
      });

      if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
        draftOrderCreate && console.error(draftOrderCreate?.errors);
        throw new Error('create draft order failed');
      }

      // do payment processing
      const { transactionInitialize } = await executeGraphQL(InitializeTransactionDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          checkoutOrOrderId: draftOrderCreate.order!.id,
          paymentGateway: {
            id: getStripeAppId(),
            data: {
              customer: user.stripe,
              payment_method: user.stripePaymentMethod,
              off_session: true,
              confirm: true,
            },
          },
        },
      });

      //TODO: get status of payment intent using transactionInitialize.transaction.pspReference, possible 3D secure

      if (!transactionInitialize || transactionInitialize.errors.length > 0) {
        transactionInitialize && console.error(transactionInitialize);
        // TODO: delete draft order when payment failed?
        throw new Error('cannot initialize transaction');
      }

      // we need to wait for the payment hook to be called before completing the draft order
      await awaitable(
        async () => {
          const { order } = await executeGraphQL(GetOrderDocument, {
            withAuth: false,
            headers: {
              Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
            },
            variables: { id: draftOrderCreate.order!.id },
          });
          if (!order) {
            throw new Error('order not found');
          }
          return order;
        },
        ({ authorizeStatus, chargeStatus }) =>
          authorizeStatus !== OrderAuthorizeStatusEnum.None &&
          chargeStatus !== OrderChargeStatusEnum.None
      );

      const { draftOrderComplete } = await executeGraphQL(CompleteDraftOrderDocument, {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: { id: draftOrderCreate.order!.id },
      });

      if (!draftOrderCreate || draftOrderCreate.errors.length > 0) {
        draftOrderCreate && console.error(draftOrderCreate?.errors);
        throw new Error('complete draft order failed');
      }

      console.log(draftOrderComplete!.order);

      await executeQuery(async (queryRunner) => {
        const order = queryRunner.manager.create(Order, {
          id: draftOrderComplete!.order!.id,
          createdAt: new Date(),
        });
        await queryRunner.manager.save(order);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(records.map(({ box }) => box.id)) },
          { order }
        );

        const planActiveRecords = records.filter(({ plan }) => plan.isEnabled);

        const nextBoxs = planActiveRecords.map(({ box }) =>
          queryRunner.manager.create(RecurringBox, {
            mealPlan: box.mealPlan,
            orderSize: box.orderSize,
            recipe1: box.recipe1,
            recipe2: box.recipe2,
            isTransitionPeriod: false,
            startDate: addDays(box.endDate, 1),
            endDate: addDays(box.endDate, 1 + (box.orderSize === OrderSize.OneWeek ? 7 : 14)),
            dog: box.dog,
          })
        );
        await queryRunner.manager.save(nextBoxs);

        const deliveryDate = getClosestOrderDeliveryDate(events);

        const shipment = queryRunner.manager.create(Shipment, {
          lockBoxDate: getEditableRecurringBoxDeadline(events, deliveryDate),
          deliveryDate,
        });
        await queryRunner.manager.save(shipment);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(nextBoxs.map((box) => box.id)) },
          { shipment }
        );
      });
    } catch (e) {
      console.error(e);
    }
  }
}
