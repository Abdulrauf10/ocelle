import { addDays, startOfDay } from 'date-fns';
import { In, IsNull, LessThan, MoreThanOrEqual, QueryRunner } from 'typeorm';

import calendarService from './calendar';
import orderService from './order';
import shippingService from './shipping';
import userService from './user';

import { SHIPPING_METHOD_SF_EXPRESS_FREE } from '@/consts';
import { Dog, DogBreed, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import { Frequency } from '@/enums';
import StripeNotReadyError from '@/errors/StripeNotReadyError';
import { CountryCode, OrderFragment } from '@/gql/graphql';
import { getInterruptibleNextRecurringBoxPreiod, getNextRecurringBoxPreiod } from '@/helpers/box';
import { executeQuery } from '@/helpers/queryRunner';
import {
  getEditableRecurringBoxDeadline,
  getInterruptedRecurringBoxDefaultDeliveryDate,
  getNormalRecurringBoxDefaultDeliveryDate,
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
  async findDeadlinedShipmentByDog(queryRunner: QueryRunner, dogId: number) {
    const today = startOfDay(new Date());

    return queryRunner.manager.findOne(Shipment, {
      where: {
        dog: {
          id: dogId,
        },
        // should not be order before the shipment deadline not met
        editableDeadline: LessThan(today),
      },
      order: {
        deliveryDate: -1,
      },
      relations: {
        dog: {
          breeds: { breed: true },
          plan: true,
        },
        box: true,
      },
    });
  }
  async isContainsEditableShipment(queryRunner: QueryRunner, dogId: number) {
    const today = startOfDay(new Date());

    return !!(await queryRunner.manager.findOne(Shipment, {
      where: {
        dog: {
          id: dogId,
        },
        editableDeadline: MoreThanOrEqual(today),
      },
    }));
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

  async orderRecurringBox(userId: string, lines: DogOrderDto[]) {
    const user = await userService.getById(userId);

    const shippingMethod = await shippingService.findShippingMethod(
      SHIPPING_METHOD_SF_EXPRESS_FREE
    );
    const { id } = await orderService.create(lines, false);

    await orderService.update(id, {
      user: user.id,
      shippingAddress: {
        firstName: user.defaultShippingAddress!.firstName,
        lastName: user.defaultShippingAddress!.lastName,
        streetAddress1: user.defaultShippingAddress!.streetAddress1,
        streetAddress2: user.defaultShippingAddress!.streetAddress2,
        city: user.defaultShippingAddress!.city,
        postalCode: user.defaultShippingAddress!.postalCode,
        countryArea: user.defaultShippingAddress!.countryArea,
        country: user.defaultShippingAddress!.country.code as CountryCode,
      },
      billingAddress: {
        firstName: user.defaultBillingAddress!.firstName,
        lastName: user.defaultBillingAddress!.lastName,
        streetAddress1: user.defaultBillingAddress!.streetAddress1,
        streetAddress2: user.defaultBillingAddress!.streetAddress2,
        city: user.defaultBillingAddress!.city,
        postalCode: user.defaultBillingAddress!.postalCode,
        countryArea: user.defaultBillingAddress!.countryArea,
        country: user.defaultBillingAddress!.country.code as CountryCode,
      },
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
   * @param user user with dog relations
   */
  async handle(user: User) {
    if (!user.stripe || !user.stripePaymentMethod) {
      throw new StripeNotReadyError(user.id);
    }

    const events = await calendarService.getCalendarEvents();

    return await executeQuery(async (queryRunner) => {
      const orderLines: Array<{ meta: DogOrderDto; box: RecurringBox }> = [];

      for (const { id: dogId } of user.dogs) {
        const shipment = await this.findDeadlinedShipmentByDog(queryRunner, dogId);
        if (!shipment) {
          console.error('no last shipment for the dog', dogId);
          continue;
        }
        try {
          const { box, dog } = shipment;
          const prevBox = await this.findDogLastBox(queryRunner, dog.id);
          if (!prevBox) {
            console.error('failed to find the recurring box of dog', dog.id);
            continue;
          }
          // reactive plan have interrupted start date
          const { startDate, endDate } = getInterruptibleNextRecurringBoxPreiod(
            prevBox.endDate,
            dog.plan.frequency,
            events
          );
          if (box === null) {
            // if shipment have no ordered box
            const nextBox = queryRunner.manager.create(RecurringBox, {
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
            await queryRunner.manager.insert(RecurringBox, nextBox);
            orderLines.push({
              meta: {
                breeds: dog.breeds.map((x) => x.breed),
                dateOfBirth: dog.dateOfBirth,
                isNeutered: dog.isNeutered,
                weight: dog.weight,
                bodyCondition: dog.bodyCondition,
                activityLevel: dog.activityLevel,
                recipe1: nextBox.recipe1,
                recipe2: nextBox.recipe2,
                mealPlan: nextBox.mealPlan,
                frequency: nextBox.frequency,
                isEnabledTransitionPeriod: nextBox.isTransitionPeriod,
              },
              box: nextBox,
            });
          } else if (dog.plan.isEnabled) {
            const hasEditableShipment = await this.isContainsEditableShipment(queryRunner, dog.id);
            if (hasEditableShipment) {
              continue;
            }
            // started box already have a ordered box, only add a new shipment
            const defaultDeliveryDate = getInterruptedRecurringBoxDefaultDeliveryDate(
              events,
              startDate
            );
            const shipment = queryRunner.manager.create(Shipment, {
              deliveryDate: defaultDeliveryDate,
              editableDeadline: getEditableRecurringBoxDeadline(events, defaultDeliveryDate),
              user,
              dog,
            });
            await queryRunner.manager.save(shipment);
          }
        } catch (e) {
          console.error('failed to process the shipment ' + shipment.id);
          console.error(e);
        }
      }

      if (orderLines.length > 0) {
        const { order: _order } = await this.orderRecurringBox(
          user.id,
          orderLines.map((line) => line.meta)
        );

        const order = queryRunner.manager.create(Order, {
          id: _order.id,
          createdAt: new Date(),
          user,
        });
        await queryRunner.manager.insert(Order, order);

        await queryRunner.manager.update(
          RecurringBox,
          { id: In(orderLines.map(({ box }) => box.id)) },
          { order }
        );
      }

      for (const { meta, box } of orderLines) {
        const { startDate } = getNextRecurringBoxPreiod(box.endDate, meta.frequency);
        const defaultDeliveryDate = getNormalRecurringBoxDefaultDeliveryDate(events, startDate);
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
          preferDeliveryDate ?? getNormalRecurringBoxDefaultDeliveryDate(events, startDate);
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
