'use server';

import { getStoreMe } from '@/storeUserProvider';
import { DogPlan } from '@/entities';
import { Recipe } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';

interface SetRecipeAction {
  id: number;
  recipe1: Recipe;
  recipe2?: Recipe;
}

const schema = Joi.object<SetRecipeAction>({
  id: Joi.number().positive().required(),
  recipe1: Joi.valid(...getNumericEnumValues(Recipe)).required(),
  recipe2: Joi.valid(...getNumericEnumValues(Recipe)).optional(),
});

export default async function setRecipeAction(data: SetRecipeAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(DogPlan, {
      where: {
        dog: { id: value.id, user: { id: me.id } },
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    data.recipe1 = value.recipe1;
    data.recipe2 = value.recipe2;

    await queryRunner.manager.save(data);
  });
}
