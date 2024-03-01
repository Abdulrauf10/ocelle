'use server';

import { getStoreMe } from '@/storeUserProvider';
import { DogPlan } from '@/entities';
import { MealPlan } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';

interface SetMealPlanAction {
  id: number;
  plan: MealPlan;
}

const schema = Joi.object<SetMealPlanAction>({
  id: Joi.number().positive().required(),
  plan: Joi.valid(...getNumericEnumValues(MealPlan)).required(),
});

export default async function setMealPlanAction(data: SetMealPlanAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(DogPlan, {
      where: {
        dog: { id: value.id, user: { saleorId: me.id } },
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    data.mealPlan = value.plan;

    await queryRunner.manager.save(data);
  });
}
