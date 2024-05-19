import { addDays, startOfDay } from 'date-fns';
import { In, IsNull, LessThan, MoreThan, MoreThanOrEqual, QueryRunner } from 'typeorm';

import { orderRecurringBox } from './api';
import { getCalendarEvents } from './calendar';

import { Dog, DogBreed, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import { Frequency } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { OrderFragment } from '@/gql/graphql';
import { maxDate } from '@/helpers/date';
import {
  getClosestOrderDeliveryDate,
  getEditableRecurringBoxDeadline,
  getEditableRecurringBoxDeadlineByStartDate,
} from '@/helpers/dog';
import { executeQuery } from '@/helpers/queryRunner';
import { isOrderableDog } from '@/helpers/shipment';
import { DogDto } from '@/types/dto';

/**
 * Find a current available shipment otherwise return a new shipment
 * @param id User ID
 */
export async function upsertEditableShipmentRecord(
  queryRunner: QueryRunner,
  id: string,
  preferDeliveryDate: Date,
  noBufferZone?: boolean
) {
  const events = await getCalendarEvents();
  const today = startOfDay(new Date());

  const data = await queryRunner.manager.findOne(Shipment, {
    where: {
      user: { id },
      editableDeadline: MoreThanOrEqual(today),
    },
    relations: {
      boxs: true,
    },
  });

  if (data) {
    return data;
  }

  const shipment = queryRunner.manager.create(Shipment, {
    deliveryDate: preferDeliveryDate,
    editableDeadline: getEditableRecurringBoxDeadline(events, preferDeliveryDate, noBufferZone),
    user: {
      id,
    },
  });

  await queryRunner.manager.save(shipment);

  return shipment;
}

export function findMostMatchBoxStartDate(boxs: RecurringBox[]) {
  return boxs[0].startDate;
}

/**
 * @param id referer to the database user id, user must be setup before setup the recurring box
 */
export async function setupRecurringBox(
  id: string,
  dogs: DogDto[],
  preferDeliveryDate: Date,
  saleorOrder: OrderFragment
) {
  await executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(User, { where: { id } });
    if (!user) {
      throw new Error('user not found');
    }
    const shipment = await upsertEditableShipmentRecord(queryRunner, id, preferDeliveryDate, true);
    const order = queryRunner.manager.create(Order, {
      id: saleorOrder.id,
      createdAt: new Date(saleorOrder.created),
      user: {
        id,
      },
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
        user: {
          id,
        },
      });
      await queryRunner.manager.save(dog);
      const breeds = [];
      for (let i = 0; i < dogs.length; i++) {
        if (data.breeds) {
          for (const id of data.breeds!) {
            breeds.push(queryRunner.manager.create(DogBreed, { dog, breedId: id }));
          }
        }
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

/**
 * checking is the box need to order new one
 * @param id user id
 */
export async function handleRecurringBox(id: string) {
  const events = await getCalendarEvents();
  const today = startOfDay(new Date());

  return await executeQuery(async (queryRunner) => {
    const shipment = await queryRunner.manager.findOne(Shipment, {
      where: {
        user: {
          id,
        },
        // should not be order before the shipment deadline not met
        editableDeadline: LessThan(today),
        // delivered box should not be order again
        deliveryDate: MoreThan(today),
      },
      relations: {
        user: true,
        boxs: true,
      },
      order: {
        editableDeadline: -1,
      },
    });
    const dogs = await queryRunner.manager.find(Dog, {
      where: {
        user: {
          id,
        },
        boxs: {
          prevBox: IsNull(),
        },
      },
      relations: {
        breeds: { breed: true },
        plan: true,
        boxs: true,
      },
    });

    let minEndDate: Date | undefined = undefined;
    for (const dog of dogs) {
      if (!dog.boxs[0]) {
        throw new Error('dog do not have starter box');
      }
      if (dog.plan.isEnabled && (!minEndDate || dog.boxs[0].endDate < minEndDate)) {
        minEndDate = dog.boxs[0].endDate;
      }
    }

    if (!shipment) {
      // shipment not exists due to errors, re-create the shipment and re-run on next day
      if (minEndDate) {
        const deliveryDate = maxDate(
          getEditableRecurringBoxDeadlineByStartDate(events, addDays(minEndDate, 1)),
          getClosestOrderDeliveryDate(events)
        );
        await queryRunner.manager.save(
          queryRunner.manager.create(Shipment, {
            editableDeadline: getEditableRecurringBoxDeadline(events, deliveryDate),
            deliveryDate,
            user: {
              id,
            },
          })
        );
      }
      return;
    }

    // shipment already bind with the boxs
    if (shipment.boxs.length > 0) {
      return;
    }

    const user = shipment.user;

    if (!user.stripe || !user.stripePaymentMethod) {
      throw new StripeNotReadyError(user.id);
    }

    const orderLines: Array<{ dog: Dog; box: RecurringBox }> = [];

    for (const dog of dogs) {
      const prevBox = dog.boxs[0];
      if (!isOrderableDog(dog.plan, prevBox)) {
        continue;
      }
      // TODO: reactive plan have interrupted start date
      const startDate = addDays(prevBox.endDate, 1);
      const box = queryRunner.manager.create(RecurringBox, {
        mealPlan: dog.plan.mealPlan,
        frequency: dog.plan.frequency,
        recipe1: dog.plan.recipe1,
        recipe2: dog.plan.recipe2,
        isTransitionPeriod: false,
        startDate: startDate,
        endDate: addDays(startDate, dog.plan.frequency === Frequency.OneWeek ? 7 : 14),
        dog,
        shipment,
        prevBox,
      });
      orderLines.push({ dog, box });
    }

    if (orderLines.length > 0) {
      const { order: _order } = await orderRecurringBox(user, orderLines);

      const order = queryRunner.manager.create(Order, {
        id: _order.id,
        createdAt: new Date(),
        user,
      });
      await queryRunner.manager.save(order);

      const boxs = [];
      for (const { box } of orderLines) {
        box.order = order;
        boxs.push(box);
      }
      await queryRunner.manager.save(boxs);
    }

    if (minEndDate) {
      const deliveryDate = maxDate(
        getEditableRecurringBoxDeadlineByStartDate(events, addDays(minEndDate, 1)),
        getClosestOrderDeliveryDate(events)
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(Shipment, {
          editableDeadline: getEditableRecurringBoxDeadline(events, deliveryDate),
          deliveryDate,
          user,
        })
      );
    }
  });
}

export async function pauseRecurringBox(id: string, includeDogIds?: number[]) {
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
    for (const dog of dogs) {
      await queryRunner.manager.update(DogPlan, dog.plan.id, { isEnabled: false });
    }
    const totalActiveDogs = await queryRunner.manager.count(Dog, {
      where: {
        plan: {
          isEnabled: true,
        },
        user: {
          id,
        },
      },
    });
    // delete draft shipment if not active dogs
    if (totalActiveDogs === 0) {
      await queryRunner.manager.delete(Shipment, {
        user: {
          id,
        },
        editableDeadline: MoreThanOrEqual(today),
      });
    }
  });
}

export async function resumeRecurringBox(
  id: string,
  preferDeliveryDate: Date,
  includeDogIds?: number[]
) {
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
      await queryRunner.manager.update(DogPlan, { id: dog.plan.id }, { isEnabled: true });
    }
    await upsertEditableShipmentRecord(queryRunner, id, preferDeliveryDate);
  });
}
