'use server';

import { Dog, DogPlan, RecurringBox } from '@/entities';
import { MealPlan } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';
import { getLoginedMe } from '@/actions';
import { getCalendarEvents } from '@/helpers/calendar';
import { isImmutableBox } from '@/helpers/dog';
import { MoreThanOrEqual } from 'typeorm';
import { startOfDay } from 'date-fns';

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
      throw new Error('dog not found');
    }

    if (!isImmutableBox(events, data.boxs[0].shipment.deliveryDate)) {
      await queryRunner.manager.update(RecurringBox, data.boxs[0].id, { mealPlan: value.plan });
    }

    await queryRunner.manager.update(DogPlan, data.plan.id, { mealPlan: value.plan });
  });
}
