'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan } from '@/entities';
import { Recipe } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';
import priceService from '@/services/price';

interface CalculateBoxPriceAction {
  id: number;
  recipe1?: Recipe;
  recipe2?: Recipe;
}

const calculateBoxPriceSchema = Joi.object<CalculateBoxPriceAction>({
  id: Joi.number().positive().required(),
  recipe1: Joi.valid(...Object.values(Recipe)).optional(),
  recipe2: Joi.valid(...Object.values(Recipe)).optional(),
});

export async function calculateBoxPrice(data: CalculateBoxPriceAction) {
  const { value, error } = calculateBoxPriceSchema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  const dog = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { id: me.id },
      },
      relations: {
        breeds: {
          breed: true,
        },
        plan: true,
      },
    });
  });

  if (!dog) {
    throw new Error('dog not found');
  }

  if (!data.recipe1) {
    return;
  }

  return {
    total: await priceService.calculateTotalPriceInBox(
      dog.breeds.map((relation) => relation.breed),
      dog.dateOfBirth,
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: data.recipe1, recipe2: data.recipe2 },
      dog.plan.mealPlan,
      dog.plan.frequency,
      false
    ),
    daily: await priceService.calculateTotalPerDayPrice(
      dog.breeds.map((relation) => relation.breed),
      dog.dateOfBirth,
      dog.isNeutered,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
      { recipe1: data.recipe1, recipe2: data.recipe2 },
      dog.plan.mealPlan,
      dog.plan.frequency,
      false
    ),
  };
}

interface SetRecipeAction {
  id: number;
  recipe1: Recipe;
  recipe2?: Recipe;
}

const setRecipeActionSchema = Joi.object<SetRecipeAction>({
  id: Joi.number().positive().required(),
  recipe1: Joi.valid(...Object.values(Recipe)).required(),
  recipe2: Joi.valid(...Object.values(Recipe)).optional(),
});

export async function setRecipeAction(data: SetRecipeAction) {
  const { value, error } = setRecipeActionSchema.validate(data);

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
