'use server';

import { isBefore, startOfDay } from 'date-fns';
import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan, RecurringBox } from '@/entities';
import { MealPlan } from '@/enums';
import { getNumericEnumValues } from '@/helpers/enum';
import { executeQuery } from '@/helpers/queryRunner';

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

  const me = await getLoginedMe();
  const today = startOfDay(new Date());

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { id: me.id },
      },
      relations: {
        plan: true,
        boxs: {
          order: true,
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
      throw new Error('dog not found');
    }

    const editableBox = data.boxs.find(
      (box) => box.order === undefined && !isBefore(today, box.shipment.editableDeadline)
    );

    if (editableBox) {
      await queryRunner.manager.update(RecurringBox, editableBox.id, { mealPlan: value.plan });
    }

    await queryRunner.manager.update(DogPlan, data.plan.id, { mealPlan: value.plan });
  });
}
