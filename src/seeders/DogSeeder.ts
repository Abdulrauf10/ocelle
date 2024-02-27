import { Dog, DogPlan, SaleorUser } from '@/entities';
import Seeder from './Seeder';
import { QueryRunner } from 'typeorm';
import { FoodAllergies, MealPlan, OrderSize, Recipe } from '@/enums';

export default class DogSeeder extends Seeder {
  /**
   * Clean the Collection
   */
  async clean(queryRunner: QueryRunner): Promise<void> {
    const dogRepository = queryRunner.manager.getRepository(Dog);
    const dogPlanRepository = queryRunner.manager.getRepository(DogPlan);
    const userRepository = queryRunner.manager.getRepository(SaleorUser);
    await dogPlanRepository.remove(await dogPlanRepository.find());
    await dogRepository.remove(await dogRepository.find());
    await userRepository.remove(await userRepository.find());
  }

  async run(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(SaleorUser);
    const dogRepository = queryRunner.manager.getRepository(Dog);
    const dogPlanRepository = queryRunner.manager.getRepository(DogPlan);

    const user = userRepository.create({ orderSize: OrderSize.TwoWeek, saleorId: '1' });

    await userRepository.save(user);

    const dog1 = dogRepository.create({
      name: 'Charlie',
      sex: 'M',
      isNeutered: true,
      dateOfBirth: new Date('2022-01-10'),
      dateOfBirthMethod: 'Calendar',
      weight: 1.6,
      bodyCondition: 'Rounded',
      activityLevel: 'Mellow',
      foodAllergies: FoodAllergies.None,
      currentEating: 'Fresh',
      amountOfTreats: 'Lots',
      pickiness: 'Picky',
      user: user,
    });

    const dog2 = dogRepository.create({
      name: 'Muffin',
      sex: 'M',
      isNeutered: false,
      dateOfBirth: new Date('2023-08-21'),
      dateOfBirthMethod: 'Manually',
      weight: 1.1,
      bodyCondition: 'JustRight',
      activityLevel: 'Active',
      foodAllergies: FoodAllergies.Lamb,
      currentEating: 'Homemade',
      amountOfTreats: 'None',
      pickiness: 'GoodEater',
      user: user,
    });

    await dogRepository.save([dog1, dog2]);

    const plan1 = dogPlanRepository.create({
      mealPlan: MealPlan.Full,
      recipe1: Recipe.Duck,
      recipe2: Recipe.Pork,
      isEnabledTransitionPeriod: true,
      isEnabled: true,
      lastDeliveryDate: new Date(),
      dog: dog1,
    });

    const plan2 = dogPlanRepository.create({
      mealPlan: MealPlan.Full,
      recipe1: Recipe.Chicken,
      isEnabledTransitionPeriod: true,
      isEnabled: true,
      lastDeliveryDate: new Date(),
      dog: dog2,
    });

    await dogPlanRepository.save([plan1, plan2]);
  }
}
