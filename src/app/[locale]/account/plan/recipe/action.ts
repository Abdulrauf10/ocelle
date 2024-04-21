'use server';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan, RecurringBox } from '@/entities';
import { Recipe } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';
import { isImmutableBox } from '@/helpers/dog';
import { getCalendarEvents } from '@/helpers/calendar';
import { MoreThanOrEqual } from 'typeorm';
import { startOfDay } from 'date-fns';

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

  const events = await getCalendarEvents();
  const me = await getLoginedMe();
  const today = startOfDay(new Date());

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { id: me.id },
        boxs: {
          shipment: {
            lockBoxDate: MoreThanOrEqual(today),
          },
        },
      },
      relations: {
        boxs: {
          shipment: true,
        },
      },
      order: {
        boxs: {
          shipment: -1,
        },
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    if (!isImmutableBox(events, data.boxs[0].shipment.deliveryDate)) {
      await queryRunner.manager.update(RecurringBox, data.boxs[0].id, {
        recipe1: value.recipe1,
        recipe2: value.recipe2,
      });
    }

    await queryRunner.manager.update(DogPlan, data.plan.id, {
      recipe1: value.recipe1,
      recipe2: value.recipe2,
    });
  });
}
