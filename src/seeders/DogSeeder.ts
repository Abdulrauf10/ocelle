import { addDays, startOfDay } from 'date-fns';
import { QueryRunner } from 'typeorm';

import Seeder from './Seeder';

import { Dog, DogPlan, Order, RecurringBox, Shipment, User } from '@/entities';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DateOfBirthMethod,
  DogFood,
  FoodAllergies,
  Frequency,
  MealPlan,
  Pickiness,
  Recipe,
  Sex,
} from '@/enums';
import {
  getEditableRecurringBoxDeadline,
  getRecurringBoxMinDeliveryDate,
} from '@/helpers/shipment';
import { getCalendarEvents } from '@/services/calendar';

export default class DogSeeder extends Seeder {
  /**
   * Clean the Collection
   */
  async clean(queryRunner: QueryRunner): Promise<void> {
    const orderRepository = queryRunner.manager.getRepository(Order);
    const shipmentRepository = queryRunner.manager.getRepository(Shipment);
    const recurringBoxRepository = queryRunner.manager.getRepository(RecurringBox);
    const dogRepository = queryRunner.manager.getRepository(Dog);
    const dogPlanRepository = queryRunner.manager.getRepository(DogPlan);
    const userRepository = queryRunner.manager.getRepository(User);
    await recurringBoxRepository.remove(await recurringBoxRepository.find());
    await shipmentRepository.remove(await shipmentRepository.find());
    await orderRepository.remove(await orderRepository.find());
    await dogPlanRepository.remove(await dogPlanRepository.find());
    await dogRepository.remove(await dogRepository.find());
    await userRepository.remove(await userRepository.find());
  }

  async run(queryRunner: QueryRunner): Promise<void> {
    const events = await getCalendarEvents();
    const today = startOfDay(new Date());
    const userRepository = queryRunner.manager.getRepository(User);
    const dogRepository = queryRunner.manager.getRepository(Dog);
    const dogPlanRepository = queryRunner.manager.getRepository(DogPlan);
    const recurringBoxRepository = queryRunner.manager.getRepository(RecurringBox);
    const shipmentRepository = queryRunner.manager.getRepository(Shipment);
    const orderRepository = queryRunner.manager.getRepository(Order);

    const user = userRepository.create({
      id: '1',
      phone: '88888888',
      isDeliveryUsAsBillingAddress: true,
    });

    await userRepository.save(user);

    const deliveryDate = getRecurringBoxMinDeliveryDate(events);

    const order = orderRepository.create({
      id: 'fake-order',
      createdAt: new Date(),
    });

    await orderRepository.save(order);

    const dog1 = dogRepository.create({
      name: 'Charlie',
      sex: Sex.M,
      isNeutered: true,
      dateOfBirth: new Date('2022-01-10'),
      dateOfBirthMethod: DateOfBirthMethod.Calendar,
      weight: 1.6,
      bodyCondition: BodyCondition.Rounded,
      activityLevel: ActivityLevel.Mellow,
      foodAllergies: FoodAllergies.None,
      currentEating: [DogFood.Fresh, DogFood.Raw],
      amountOfTreats: AmountOfTreats.Lots,
      pickiness: Pickiness.Picky,
      user: user,
    });

    const dog2 = dogRepository.create({
      name: 'Muffin',
      sex: Sex.M,
      isNeutered: false,
      dateOfBirth: new Date('2023-08-21'),
      dateOfBirthMethod: DateOfBirthMethod.Manually,
      weight: 1.1,
      bodyCondition: BodyCondition.JustRight,
      activityLevel: ActivityLevel.Active,
      foodAllergies: FoodAllergies.Lamb,
      currentEating: [DogFood.Homemade],
      amountOfTreats: AmountOfTreats.None,
      pickiness: Pickiness.GoodEater,
      user: user,
    });

    await dogRepository.save([dog1, dog2]);

    const plan1 = dogPlanRepository.create({
      frequency: Frequency.TwoWeek,
      mealPlan: MealPlan.Full,
      recipe1: Recipe.Duck,
      recipe2: Recipe.Pork,
      isEnabledTransitionPeriod: true,
      isEnabled: true,
      startDate: today,
      dog: dog1,
    });

    const plan2 = dogPlanRepository.create({
      frequency: Frequency.TwoWeek,
      mealPlan: MealPlan.Full,
      recipe1: Recipe.Chicken,
      isEnabledTransitionPeriod: true,
      isEnabled: true,
      startDate: today,
      dog: dog2,
    });

    await dogPlanRepository.save([plan1, plan2]);

    const shipment1 = shipmentRepository.create({
      deliveryDate,
      editableDeadline: getEditableRecurringBoxDeadline(events, deliveryDate, true),
      user,
      dog: dog1,
    });

    const shipment2 = shipmentRepository.create({
      deliveryDate,
      editableDeadline: getEditableRecurringBoxDeadline(events, deliveryDate, true),
      user,
      dog: dog2,
    });

    await shipmentRepository.save([shipment1, shipment2]);

    const box1 = recurringBoxRepository.create({
      mealPlan: plan1.mealPlan,
      frequency: plan1.frequency,
      recipe1: plan1.recipe1,
      recipe2: plan1.recipe2,
      isTransitionPeriod: true,
      startDate: today,
      endDate: addDays(today, 14),
      dog: dog1,
      order,
      shipment: shipment1,
    });

    const box2 = recurringBoxRepository.create({
      mealPlan: plan2.mealPlan,
      frequency: plan2.frequency,
      recipe1: plan2.recipe1,
      recipe2: plan2.recipe2,
      isTransitionPeriod: true,
      startDate: today,
      endDate: addDays(today, 14),
      dog: dog2,
      order,
      shipment: shipment2,
    });

    await recurringBoxRepository.save([box1, box2]);
  }
}
