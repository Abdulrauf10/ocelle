import { Order, RecurringBox, Shipment, User } from '@/entities';
import { OrderSize } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { orderRecurringBox } from '@/helpers/api';
import { getCalendarEvents } from '@/helpers/calendar';
import { getClosestOrderDeliveryDate, getEditableRecurringBoxDeadline } from '@/helpers/dog';
import { executeQuery } from '@/helpers/queryRunner';
import { addDays, startOfDay } from 'date-fns';
import invariant from 'ts-invariant';
import { In, IsNull, LessThan } from 'typeorm';

export default async function subscriptionScheduler() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');
  const today = startOfDay(new Date());
  const events = await getCalendarEvents();
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
      const { order: _order } = await orderRecurringBox(user, user.dogs);

      await executeQuery(async (queryRunner) => {
        const order = queryRunner.manager.create(Order, {
          id: _order.id,
          createdAt: new Date(),
        });
        await queryRunner.manager.save(order);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(user.dogs.map((dog) => dog.boxs[0].id)) },
          { order }
        );

        const planActiveDogs = user.dogs.filter((dog) => dog.plan.isEnabled);

        const nextBoxs = planActiveDogs.map((dog) => {
          const box = dog.boxs[0];
          const startDate = addDays(box.endDate, 1);
          return queryRunner.manager.create(RecurringBox, {
            mealPlan: box.mealPlan,
            orderSize: box.orderSize,
            recipe1: box.recipe1,
            recipe2: box.recipe2,
            isTransitionPeriod: false,
            startDate: startDate,
            endDate: addDays(startDate, user.orderSize === OrderSize.OneWeek ? 7 : 14),
            dog: box.dog,
          });
        });
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
