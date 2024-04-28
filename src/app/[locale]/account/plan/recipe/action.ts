'use server';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan, RecurringBox } from '@/entities';
import { Recipe } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';
import { getCalendarEvents } from '@/helpers/calendar';
import { isBefore, startOfDay } from 'date-fns';

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

    const editableBox = data.boxs.find(
      (box) => box.order === undefined && !isBefore(today, box.shipment.editableDeadline)
    );

    if (editableBox) {
      await queryRunner.manager.update(RecurringBox, editableBox.id, {
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
