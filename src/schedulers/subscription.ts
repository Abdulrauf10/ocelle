import { DEFUALT_SHIPPING_ZONE, SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { Order, RecurringBox, Shipment, User } from '@/entities';
import { OrderSize } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import {
  CompleteDraftOrderDocument,
  CreateDraftOrderDocument,
  FindProductsDocument,
  FindShippingZonesDocument,
  GetChannelDocument,
  GetOrderDocument,
  InitializeTransactionDocument,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
} from '@/gql/graphql';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  calculateRecipeTotalPriceInBox,
  getClosestOrderDeliveryDate,
  getSubscriptionProductActuallyQuanlityInSaleor,
} from '@/helpers/dog';
import { getStripeAppId } from '@/helpers/env';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { recipeToVariant } from '@/helpers/saleor';
import { addDays } from 'date-fns';
import invariant from 'ts-invariant';
import { In, IsNull, LessThanOrEqual } from 'typeorm';

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
  const events = await getCalendarEvents();
  const shippingMethod = await findSubscriptionShippingMethod();
  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_CHANNEL_SLUG,
    },
  });
  if (!channel) {
    throw new Error('channel not found');
  }
  const { products: _products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {},
  });
  const products = _products?.edges.map((edge) => edge.node) || [];
  const users = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(User, {
      where: {
        dogs: {
          boxs: {
            order: IsNull(),
            shipment: {
              deliveryDate: LessThanOrEqual(getClosestOrderDeliveryDate(events)),
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
      const boxs: RecurringBox[] = [];
      const lines = [];
      for (const dog of user.dogs) {
        const breeds = dog.breeds.map((x) => x.breed);
        const box = dog.boxs.find((box) => box.order === undefined);
        if (!box) {
          throw new Error("dog don't contains box to be the order");
        }
        boxs.push(box);
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

      //TODO: get status of payment intent using transactionInitialize.transaction.pspReference

      if (!transactionInitialize || transactionInitialize.errors.length > 0) {
        transactionInitialize && console.error(transactionInitialize);
        // TODO: delete draft order when payment failed?
        throw new Error('cannot initialize transaction');
      }

      // we need to wait for the payment hook to be called before completing the draft order
      for (let i = 0; i < 30; i++) {
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
        if (
          order.authorizeStatus !== OrderAuthorizeStatusEnum.None &&
          order.chargeStatus !== OrderChargeStatusEnum.None
        ) {
          break;
        }
        // wait for 8 seconds to continue
        await new Promise((resolve) => setTimeout(resolve, 1000 * 8));
      }

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
          { id: In(boxs.map((box) => box.id)) },
          { order }
        );

        const nextBoxs = boxs.map((box) => {
          return queryRunner.manager.create(RecurringBox, {
            mealPlan: box.mealPlan,
            orderSize: box.orderSize,
            recipe1: box.recipe1,
            recipe2: box.recipe2,
            isTransitionPeriod: false,
            startDate: addDays(box.endDate, 1),
            endDate: addDays(box.endDate, 1 + (box.orderSize === OrderSize.OneWeek ? 7 : 14)),
            dog: box.dog,
          });
        });
        await queryRunner.manager.save(nextBoxs);

        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: getClosestOrderDeliveryDate(events),
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
