'use server';

import { getStoreMe } from '@/storeUserProvider';
import { Dog } from '@/entities';
import { Recipe } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';

interface SetRecipeAction {
  id: string;
  recipe1: Recipe;
  recipe2?: Recipe;
}

const schema = Joi.object<SetRecipeAction>({
  id: Joi.string().required(),
  recipe1: Joi.string().required(),
  recipe2: Joi.string().optional(),
});

export default async function setRecipeAction(formData: FormData) {
  const { value, error } = schema.validate({
    id: formData.get('id'),
    recipe1: formData.get('recipe1'),
    recipe2: formData.get('recipe2'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: parseInt(value.id),
        user: { saleorId: me.id },
      },
      relations: {
        plan: true,
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    data.plan.recipe1 = value.recipe1;
    data.plan.recipe2 = value.recipe2;

    await queryRunner.manager.save(data);
  });
}
