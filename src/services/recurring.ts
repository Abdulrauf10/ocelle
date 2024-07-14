import { addDays, startOfDay } from 'date-fns';
import { In, LessThan, MoreThan, MoreThanOrEqual } from 'typeorm';

import calendarService from './calendar';
import orderService from './order';
import shippingService from './shipping';

import { SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { Dog, DogBreed, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import { Frequency } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { OrderFragment } from '@/gql/graphql';
import { calculateRecurringBoxDuration } from '@/helpers/box';
import { executeQuery } from '@/helpers/queryRunner';
import {
  getEditableRecurringBoxDeadline,
  getRecurringBoxDefaultDeliveryDate,
} from '@/helpers/shipment';
import { DogDto } from '@/types/dto';

class RecurringService {
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
      for (const data of dogs) {
        const startDate = addDays(startOfDay(preferDeliveryDate), 1);
        const endDate = addDays(startDate, 14);
        const dog = queryRunner.manager.create(Dog, {
          name: data.name,
          sex: data.sex,
          isNeutered: data.isNeutered,
          dateOfBirthMethod: data.dateOfBirthMethod,
          dateOfBirth: data.dateOfBirth,
          weight: data.weight,
          bodyCondition: data.bodyCondition,
          activityLevel: data.activityLevel,
          foodAllergies: data.foodAllergies,
          currentEating: data.currentEating,
          amountOfTreats: data.amountOfTreats,
          pickiness: data.pickiness,
          user,
        });
        await queryRunner.manager.save(dog);
        const breeds = [];
        for (const id of data.breeds ?? []) {
          breeds.push(queryRunner.manager.create(DogBreed, { dog, breedId: id }));
        }
        await queryRunner.manager.save(breeds);
        const plan = queryRunner.manager.create(DogPlan, {
          mealPlan: data.mealPlan,
          frequency: Frequency.TwoWeek,
          recipe1: data.recipe1,
          recipe2: data.recipe2,
          isEnabledTransitionPeriod: data.isEnabledTransitionPeriod,
          startDate,
          isEnabled: true,
          dog,
        });
        await queryRunner.manager.save(plan);
        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: preferDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, preferDeliveryDate, true),
          user,
          dog,
        });
        await queryRunner.manager.save(shipment);
        const box = queryRunner.manager.create(RecurringBox, {
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
        await queryRunner.manager.save(box);
      }
    });
  }

  async orderRecurringBox(user: User, orderLines: Array<{ dog: Dog; box: RecurringBox }>) {
    const shippingMethod = await shippingService.findShippingMethod(
      SHIPPING_METHOD_SF_EXPRESS_FREE
    );
    const dogsCreate = orderLines.map(({ dog, box }) => {
      return {
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
      };
    });
    const { id } = await orderService.create(dogsCreate, false);

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
    const today = startOfDay(new Date());

    return await executeQuery(async (queryRunner) => {
      const shipments = await queryRunner.manager.find(Shipment, {
        where: {
          user: {
            id: user.id,
          },
          // should not be order before the shipment deadline not met
          editableDeadline: LessThan(today),
          // delivered box should not be order again
          deliveryDate: MoreThan(today),
        },
        relations: {
          box: {
            dog: {
              breeds: { breed: true },
              plan: true,
            },
          },
        },
      });

      const orderLines: Array<{ dog: Dog; box: RecurringBox; shipment: Shipment }> = [];

      for (const shipment of shipments) {
        const { dog } = shipment;
        const prevBox = await queryRunner.manager.findOne(RecurringBox, {
          where: {
            dog: {
              id: dog.id,
            },
          },
          order: {
            startDate: -1,
          },
        });
        if (!prevBox) {
          console.error('failed to find the recurring box of dog ' + dog.id);
          continue;
        }
        const { startDate, endDate } = calculateRecurringBoxDuration(
          prevBox.endDate,
          dog.plan.frequency
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
        orderLines.push({ dog, box, shipment });
      }

      if (orderLines.length > 0) {
        const { order: _order } = await this.orderRecurringBox(user, orderLines);

        const order = queryRunner.manager.create(Order, {
          id: _order.id,
          createdAt: new Date(),
          user,
        });
        await queryRunner.manager.save(order);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(orderLines.map(({ box }) => box.id)) },
          { order }
        );
      }

      for (const { dog, box } of orderLines) {
        const { startDate } = calculateRecurringBoxDuration(box.endDate, dog.plan.frequency);
        const defaultDeliveryDate = getRecurringBoxDefaultDeliveryDate(events, startDate);
        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: defaultDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, defaultDeliveryDate),
          user,
          dog,
        });
        await queryRunner.manager.save(shipment);
      }
    });
  }

  async pause(id: string, includeDogIds?: number[]) {
    const today = startOfDay(new Date());

    await executeQuery(async (queryRunner) => {
      const dogs = await queryRunner.manager.find(Dog, {
        where: {
          id: includeDogIds ? In(includeDogIds) : undefined,
          user: {
            id,
          },
        },
        relations: {
          plan: true,
        },
      });
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
      const dogs = await queryRunner.manager.find(Dog, {
        where: {
          id: includeDogIds ? In(includeDogIds) : undefined,
          user: {
            id,
          },
        },
        relations: {
          plan: true,
        },
      });
      for (const dog of dogs) {
        const prevBox = await queryRunner.manager.findOne(RecurringBox, {
          where: {
            dog: {
              id: dog.id,
            },
          },
          order: {
            startDate: -1,
          },
        });
        if (!prevBox) {
          console.error('failed to find the recurring box of dog ' + dog.id);
          continue;
        }
        const { startDate } = calculateRecurringBoxDuration(prevBox.endDate, dog.plan.frequency);
        const defaultDeliveryDate =
          preferDeliveryDate ?? getRecurringBoxDefaultDeliveryDate(events, startDate);
        const shipment = queryRunner.manager.create(Shipment, {
          deliveryDate: defaultDeliveryDate,
          editableDeadline: getEditableRecurringBoxDeadline(events, defaultDeliveryDate),
          dog,
          user: {
            id,
          },
        });
        await queryRunner.manager.save(shipment);
        await queryRunner.manager.update(DogPlan, { id: dog.plan.id }, { isEnabled: true });
      }
    });
  }
}

const recurringService = new RecurringService();

export default recurringService;
