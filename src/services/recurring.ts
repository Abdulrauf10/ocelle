import { addDays, startOfDay } from 'date-fns';
import { In, IsNull, LessThan, MoreThanOrEqual, QueryRunner } from 'typeorm';

import calendarService from './calendar';
import orderService from './order';
import shippingService from './shipping';

import { SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { Dog, DogBreed, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import { Frequency } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { OrderFragment } from '@/gql/graphql';
import { getInterruptibleNextRecurringBoxPreiod, getNextRecurringBoxPreiod } from '@/helpers/box';
import { executeQuery } from '@/helpers/queryRunner';
import {
  getEditableRecurringBoxDeadline,
  getRecurringBoxDefaultDeliveryDate,
} from '@/helpers/shipment';
import { DogDto, DogOrderDto } from '@/types/dto';

class RecurringService {
  async findDogsByUserId(queryRunner: QueryRunner, id: string, include?: number[]) {
    return queryRunner.manager.find(Dog, {
      where: {
        id: include ? In(include) : undefined,
        user: {
          id,
        },
      },
      relations: {
        plan: true,
      },
    });
  }
  async findDogLastBox(queryRunner: QueryRunner, id: number) {
    return queryRunner.manager.findOne(RecurringBox, {
      where: {
        dog: {
          id,
        },
      },
      order: {
        startDate: -1,
      },
    });
  }
  async findDeadlinedShipments(queryRunner: QueryRunner, userId: string) {
    const today = startOfDay(new Date());

    return queryRunner.manager.find(Shipment, {
      where: {
        user: {
          id: userId,
        },
        // should not be order before the shipment deadline not met
        editableDeadline: LessThan(today),
        // delivered box should not be order again
        // TODO: now only serve `second recurring box +` but not `get started -> first recurring box`
        box: {
          id: IsNull(),
        },
      },
      relations: {
        dog: {
          breeds: { breed: true },
          plan: true,
        },
      },
    });
  }
  /**
   * @param id referer to the database user id, user must be setup before setup the recurring box
   */
  async setup(id: string, dogs: DogDto[], preferDeliveryDate: Date, saleorOrder: OrderFragment) {
    const events = await calendarService.getCalendarEvents();
    await executeQuery(async (queryRunner) => {
      const user = await queryRunner.manager.findOne(User, { where: { id } });
      if (!user) {
        throw new Error('user not found');
      }
      const order = queryRunner.manager.create(Order, {
        id: saleorOrder.id,
        createdAt: new Date(saleorOrder.created),
        user,
      });
      await queryRunner.manager.save(order);
      for (const { breeds, ...data } of dogs) {
        const startDate = addDays(startOfDay(preferDeliveryDate), 1);
        const endDate = addDays(startDate, 14);
        const dog = queryRunner.manager.create(Dog, { ...data, user });
        await queryRunner.manager.insert(Dog, dog);
        if (breeds) {
          await queryRunner.manager.insert(
            DogBreed,
            breeds.map((id) => ({ dogId: dog.id, breedId: id }))
          );
        }
        await queryRunner.manager.insert(DogPlan, {
          mealPlan: data.mealPlan,
          frequency: Frequency.TwoWeek,
          recipe1: data.recipe1,
          recipe2: data.recipe2,
          isEnabledTransitionPeriod: data.isEnabledTransitionPeriod,
          startDate,
          isEnabled: true,
          dog,
        });
        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: preferDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, preferDeliveryDate, true),
          user,
          dog,
        });
        await queryRunner.manager.insert(Shipment, shipment);
        await queryRunner.manager.insert(RecurringBox, {
          mealPlan: data.mealPlan,
          frequency: Frequency.TwoWeek,
          recipe1: data.recipe1,
          recipe2: data.recipe2,
          isTransitionPeriod: data.isEnabledTransitionPeriod,
          startDate,
          endDate,
          dog,
          order,
          shipment,
        });
      }
    });
  }

  async orderRecurringBox(user: User, lines: DogOrderDto[]) {
    const shippingMethod = await shippingService.findShippingMethod(
      SHIPPING_METHOD_SF_EXPRESS_FREE
    );
    const { id } = await orderService.create(lines, false);

    await orderService.update(id, {
      user: user.id,
      shippingMethod: shippingMethod.id,
    });

    // TODO: get status of payment intent using transactionInitialize.transaction.pspReference, possible 3D secure
    // TODO: delete draft order when payment failed?
    const { transaction, transactionEvent } = await orderService.initialTransaction(id, {
      customer: user.stripe,
      payment_method: user.stripePaymentMethod,
      off_session: true,
      confirm: true,
    });

    const order = await orderService.complete(id);

    return {
      order,
      transaction,
      transactionEvent,
    };
  }

  /**
   * checking is the box need to order new one
   * @param id user id
   */
  async handle(user: User) {
    if (!user.stripe || !user.stripePaymentMethod) {
      throw new StripeNotReadyError(user.id);
    }

    const events = await calendarService.getCalendarEvents();

    return await executeQuery(async (queryRunner) => {
      const shipments = await this.findDeadlinedShipments(queryRunner, user.id);

      const lines: Array<{ meta: DogOrderDto; box: RecurringBox }> = [];

      for (const shipment of shipments) {
        try {
          const { dog } = shipment;
          const prevBox = await this.findDogLastBox(queryRunner, dog.id);
          if (!prevBox) {
            console.error('failed to find the recurring box of dog ' + dog.id);
            continue;
          }
          // reactive plan have interrupted start date
          const { startDate, endDate } = getInterruptibleNextRecurringBoxPreiod(
            prevBox.endDate,
            dog.plan.frequency,
            events
          );
          const box = queryRunner.manager.create(RecurringBox, {
            mealPlan: dog.plan.mealPlan,
            frequency: dog.plan.frequency,
            recipe1: dog.plan.recipe1,
            recipe2: dog.plan.recipe2,
            isTransitionPeriod: false,
            startDate: startDate,
            endDate,
            dog,
            shipment,
            prevBox,
          });
          await queryRunner.manager.insert(RecurringBox, box);
          lines.push({
            meta: {
              breeds: dog.breeds.map((x) => x.breed),
              dateOfBirth: dog.dateOfBirth,
              isNeutered: dog.isNeutered,
              weight: dog.weight,
              bodyCondition: dog.bodyCondition,
              activityLevel: dog.activityLevel,
              recipe1: box.recipe1,
              recipe2: box.recipe2,
              mealPlan: box.mealPlan,
              frequency: box.frequency,
              isEnabledTransitionPeriod: box.isTransitionPeriod,
            },
            box,
          });
        } catch (e) {
          console.error('failed to process the shipment ' + shipment.id);
          console.error(e);
        }
      }

      if (lines.length > 0) {
        const { order: _order } = await this.orderRecurringBox(
          user,
          lines.map((line) => line.meta)
        );

        const order = queryRunner.manager.create(Order, {
          id: _order.id,
          createdAt: new Date(),
          user,
        });
        await queryRunner.manager.insert(Order, order);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(lines.map(({ box }) => box.id)) },
          { order }
        );
      }

      for (const { meta, box } of lines) {
        const { startDate } = getNextRecurringBoxPreiod(box.endDate, meta.frequency);
        const defaultDeliveryDate = getRecurringBoxDefaultDeliveryDate(events, startDate);
        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: defaultDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, defaultDeliveryDate),
          user,
          dog: box.dog,
        });
        await queryRunner.manager.save(shipment);
      }
    });
  }

  async pause(id: string, includeDogIds?: number[]) {
    const today = startOfDay(new Date());

    await executeQuery(async (queryRunner) => {
      const dogs = await this.findDogsByUserId(queryRunner, id, includeDogIds);
      const ids = dogs.map((dog) => dog.id);
      await queryRunner.manager.update(DogPlan, { dog: { id: In(ids) } }, { isEnabled: false });
      await queryRunner.manager.delete(Shipment, {
        dog: {
          id: In(ids),
        },
        user: {
          id,
        },
        editableDeadline: MoreThanOrEqual(today),
      });
    });
  }

  async resume(id: string, preferDeliveryDate?: Date, includeDogIds?: number[]) {
    const events = await calendarService.getCalendarEvents();
    await executeQuery(async (queryRunner) => {
      const dogs = await this.findDogsByUserId(queryRunner, id, includeDogIds);
      for (const dog of dogs) {
        const prevBox = await this.findDogLastBox(queryRunner, dog.id);
        if (!prevBox) {
          console.error('failed to find the recurring box of dog ' + dog.id);
          continue;
        }
        const { startDate } = getNextRecurringBoxPreiod(prevBox.endDate, dog.plan.frequency);
        const defaultDeliveryDate =
          preferDeliveryDate ?? getRecurringBoxDefaultDeliveryDate(events, startDate);
        await queryRunner.manager.insert(Shipment, {
          deliveryDate: defaultDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, defaultDeliveryDate),
          dog,
          user: {
            id,
          },
        });
        await queryRunner.manager.update(DogPlan, { id: dog.plan.id }, { isEnabled: true });
      }
    });
  }
}

const recurringService = new RecurringService();

export default recurringService;
