import { DogDto } from '@/types/dto';
import { In, IsNull, MoreThanOrEqual, QueryRunner } from 'typeorm';
import { getCalendarEvents } from './calendar';
import { addDays, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { Dog, DogBreed, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import {
  getClosestOrderDeliveryDate,
  getEditableRecurringBoxDeadline,
  isDeliveredBox,
} from './dog';
import { executeQuery } from './queryRunner';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { orderRecurringBox } from './api';
import { OrderSize } from '@/enums';
import { OrderFragment } from '@/gql/graphql';

/**
 * Find a current available shipment otherwise return a new shipment
 */
export async function getBoxShipmentRecord(
  queryRunner: QueryRunner,
  userId: string,
  preferDeliveryDate: Date
) {
  const events = await getCalendarEvents();
  const today = startOfDay(new Date());

  const data = await queryRunner.manager.findOne(Shipment, {
    where: {
      user: { id: userId },
      editableDeadline: MoreThanOrEqual(today),
    },
    relations: {
      boxs: true,
    },
    order: {
      deliveryDate: -1,
    },
  });

  if (data) {
    return data;
  }

  const shipment = queryRunner.manager.create(Shipment, {
    deliveryDate: preferDeliveryDate,
    editableDeadline: getEditableRecurringBoxDeadline(events, preferDeliveryDate),
    user: {
      id: userId,
    },
  });

  await queryRunner.manager.save(shipment);

  return shipment;
}

export function findMostMatchBoxStartDate(boxs: RecurringBox[]) {
  return boxs[0].startDate;
}

/**
 * @param userId referer to the database user id, user must be setup before setup the recurring box
 */
export async function setupRecurringBox(
  userId: string,
  dogs: DogDto[],
  preferDeliveryDate: Date,
  saleorOrder: OrderFragment
) {
  await executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
    if (!user) {
      throw new Error('user not found');
    }
    const shipment = await getBoxShipmentRecord(queryRunner, userId, preferDeliveryDate);
    const order = queryRunner.manager.create(Order, {
      id: saleorOrder.id,
      createdAt: new Date(saleorOrder.created),
    });
    await queryRunner.manager.save(order);
    const dbDogs = dogs.map((dog) =>
      queryRunner.manager.create(Dog, {
        name: dog.name,
        sex: dog.gender,
        isNeutered: dog.isNeutered,
        dateOfBirthMethod: dog.dateOfBirthMethod,
        dateOfBirth: dog.dateOfBirth,
        weight: dog.weight,
        bodyCondition: dog.bodyCondition,
        activityLevel: dog.activityLevel,
        foodAllergies: dog.foodAllergies,
        currentEating: dog.currentlyEating,
        amountOfTreats: dog.amountOfTreats,
        pickiness: dog.pickiness,
        user: {
          id: userId,
        },
      })
    );
    await queryRunner.manager.save(dogs);
    const breeds = [];
    for (let i = 0; i < dogs.length; i++) {
      const dog = dbDogs[i];
      if (dogs[i].breeds) {
        for (const breed of dogs[i].breeds!) {
          breeds.push(queryRunner.manager.create(DogBreed, { dog, breedId: breed }));
        }
      }
    }
    await queryRunner.manager.save(breeds);
    const plans = [];
    for (let i = 0; i < dogs.length; i++) {
      const dog = dbDogs[i];
      plans.push(
        queryRunner.manager.create(DogPlan, {
          mealPlan: dogs[i].mealPlan,
          recipe1: dogs[i].recipe1,
          recipe2: dogs[i].recipe2,
          isEnabledTransitionPeriod: dogs[i].isEnabledTransitionPeriod,
          startDate: addDays(startOfDay(new Date()), 1),
          isEnabled: true,
          dog,
        })
      );
    }
    await queryRunner.manager.save(plans);
    // no any dog configurations
    const defaultStartDate = addDays(startOfDay(preferDeliveryDate), 1);
    // try to sync with existing box if exists
    const startDate =
      shipment.boxs.length > 0 ? findMostMatchBoxStartDate(shipment.boxs) : defaultStartDate;
    const endDate = addDays(startDate, user.orderSize === OrderSize.OneWeek ? 7 : 14);
    const recurringRecords = [];
    for (let i = 0; i < dogs.length; i++) {
      const dog = dbDogs[i];
      recurringRecords.push(
        queryRunner.manager.create(RecurringBox, {
          mealPlan: dogs[i].mealPlan,
          orderSize: user.orderSize,
          recipe1: dogs[i].recipe1,
          recipe2: dogs[i].recipe2,
          isTransitionPeriod: dogs[i].isEnabledTransitionPeriod,
          startDate,
          endDate,
          dog,
          order,
          shipment,
        })
      );
    }
    await queryRunner.manager.save(recurringRecords);
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
    const user = await queryRunner.manager.findOne(User, {
      where: {
        id,
        dogs: {
          boxs: {
            order: IsNull(),
          },
        },
      },
      relations: {
        dogs: {
          breeds: { breed: true },
          plan: true,
          boxs: {
            shipment: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('user not found');
    }

    if (!user.stripe || !user.stripePaymentMethod) {
      throw new StripeNotReadyError(user.id);
    }

    const orderLines: Array<{ dog: Dog; box: RecurringBox }> = [];

    for (const dog of user.dogs) {
      // dog plan is not active, prevent bug on the recurring box not deleted when deactive the subscription
      if (!dog.plan.isEnabled) {
        continue;
      }
      const box = dog.boxs[0];
      const shipmentDeadline = startOfDay(box.shipment.editableDeadline);
      // should not be order before the shipment deadline not met
      if (isSameDay(today, shipmentDeadline) || isAfter(today, shipmentDeadline)) {
        continue;
      }
      // delivered box should not be order again
      if (isDeliveredBox(box.shipment.deliveryDate)) {
        continue;
      }
      orderLines.push({ dog, box: dog.boxs[0] });
    }

    if (orderLines.length === 0) {
      throw new Error('handle recurring box has empty order lines');
    }

    const { order: _order } = await orderRecurringBox(user, orderLines);

    const order = queryRunner.manager.create(Order, {
      id: _order.id,
      createdAt: new Date(),
    });
    await queryRunner.manager.save(order);

    await queryRunner.manager.update(
      RecurringBox,
      { id: In(orderLines.map(({ box }) => box.id)) },
      { order }
    );

    const deliveryDate = getClosestOrderDeliveryDate(events);

    const shipment = queryRunner.manager.create(Shipment, {
      editableDeadline: getEditableRecurringBoxDeadline(events, deliveryDate),
      deliveryDate,
      user,
    });
    await queryRunner.manager.save(shipment);

    const recurringBoxs = orderLines.map(({ dog, box }) => {
      const startDate = addDays(box.endDate, 1);
      return queryRunner.manager.create(RecurringBox, {
        mealPlan: box.mealPlan,
        orderSize: box.orderSize,
        recipe1: box.recipe1,
        recipe2: box.recipe2,
        isTransitionPeriod: false,
        startDate: startDate,
        endDate: addDays(startDate, user.orderSize === OrderSize.OneWeek ? 7 : 14),
        dog,
        shipment,
      });
    });
    await queryRunner.manager.save(recurringBoxs);
  });
}

async function pauseDogBox(queryRunner: QueryRunner, id: number) {
  const dog = await queryRunner.manager.findOne(Dog, {
    where: {
      id,
    },
    relations: {
      plan: true,
      boxs: {
        order: true,
        shipment: true,
      },
    },
  });
  if (!dog) {
    throw new Error('dog not found');
  }
  const deleteBoxIds = [];
  const deleteShipmentIds = [];
  for (const box of dog.boxs) {
    if (box.order === undefined) {
      deleteBoxIds.push(box.id);
      deleteShipmentIds.indexOf(box.shipment.id) === -1 && deleteShipmentIds.push(box.shipment.id);
    }
  }
  await queryRunner.manager.update(DogPlan, dog.plan.id, { isEnabled: false });
  // if not set order, draft shipment
  await queryRunner.manager.delete(Shipment, { id: In(deleteShipmentIds) });
  // if not set order, draft recurring box
  await queryRunner.manager.delete(RecurringBox, { id: In(deleteBoxIds) });
}

export async function pauseRecurringBox(userId: string, dogIds?: number[]) {
  await executeQuery(async (queryRunner) => {
    if (dogIds) {
      for (const id of dogIds) {
        await pauseDogBox(queryRunner, id);
      }
    }
    const user = await queryRunner.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: {
        dogs: true,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    for (const dog of user.dogs) {
      await pauseDogBox(queryRunner, dog.id);
    }
  });
}

async function resumeDogBox(
  queryRunner: QueryRunner,
  id: number,
  userId: string,
  preferDeliveryDate: Date
) {
  const user = await queryRunner.manager.findOne(User, {
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error('user not found');
  }
  const shipment = await getBoxShipmentRecord(queryRunner, user.id, preferDeliveryDate);
  const dog = await queryRunner.manager.findOne(Dog, {
    where: {
      id,
    },
    relations: {
      plan: true,
      boxs: true,
    },
    order: {
      boxs: {
        endDate: -1,
      },
    },
  });
  if (!dog) {
    throw new Error('dog not found');
  }
  if (dog.plan.isEnabled) {
    throw new Error('dog plan is already resume');
  }
  const prevBox = dog.boxs[0];
  const defaultStartDate = addDays(startOfDay(preferDeliveryDate), 1);
  const startDate =
    prevBox && isBefore(defaultStartDate, prevBox.endDate)
      ? defaultStartDate
      : addDays(prevBox.endDate, 1);
  const box = queryRunner.manager.create(RecurringBox, {
    mealPlan: dog.plan.mealPlan,
    orderSize: user.orderSize,
    recipe1: dog.plan.recipe1,
    recipe2: dog.plan.recipe2,
    isTransitionPeriod: dog.plan.isEnabledTransitionPeriod,
    startDate,
    endDate: addDays(startDate, user.orderSize === OrderSize.OneWeek ? 7 : 14),
    dog,
    shipment,
  });
  await queryRunner.manager.save(box);
}

export async function resumeRecurringBox(
  userId: string,
  preferDeliveryDate: Date,
  dogIds?: number[]
) {
  await executeQuery(async (queryRunner) => {
    if (dogIds) {
      for (const id of dogIds) {
        await resumeDogBox(queryRunner, id, userId, preferDeliveryDate);
      }
    }
    const user = await queryRunner.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: {
        dogs: true,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    for (const dog of user.dogs) {
      await resumeDogBox(queryRunner, dog.id, userId, preferDeliveryDate);
    }
  });
}

export async function cancelRecurringBox(userId: string) {
  //
}

export async function reactivteRecurringBox(userId: string, preferDeliveryDate: Date) {
  //
}
