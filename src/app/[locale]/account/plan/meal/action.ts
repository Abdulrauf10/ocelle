'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan } from '@/entities';
import { MealPlan } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';

interface SetMealPlanAction {
  id: number;
  plan: MealPlan;
}

const schema = Joi.object<SetMealPlanAction>({
  id: Joi.number().positive().required(),
  plan: Joi.valid(...Object.values(MealPlan)).required(),
});

export default async function setMealPlanAction(data: SetMealPlanAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { id: me.id },
      },
      relations: {
        plan: true,
      },
    });

    if (!data) {
      throw new Error('dog not found');
    }

    await queryRunner.manager.update(DogPlan, data.plan.id, { mealPlan: value.plan });
  });
}
