'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan } from '@/entities';
import { Recipe } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';

interface SetRecipeAction {
  id: number;
  recipe1: Recipe;
  recipe2?: Recipe;
}

const schema = Joi.object<SetRecipeAction>({
  id: Joi.number().positive().required(),
  recipe1: Joi.valid(...Object.values(Recipe)).required(),
  recipe2: Joi.valid(...Object.values(Recipe)).optional(),
});

export default async function setRecipeAction(data: SetRecipeAction) {
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
      throw new Error('data not found');
    }

    await queryRunner.manager.update(DogPlan, data.plan.id, {
      recipe1: value.recipe1,
      recipe2: value.recipe2,
    });
  });
}
