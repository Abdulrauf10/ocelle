'use server';

import { getStoreMe } from '@/storeUserProvider';
import { Dog } from '@/entities';
import { MealPlan } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';

interface SetMealPlanAction {
  id: number;
  plan: 'half' | 'full';
}

const schema = Joi.object<SetMealPlanAction>({
  id: Joi.number().positive().required(),
  plan: Joi.string().valid('half', 'full').required(),
});

export default async function setMealPlanAction(formData: FormData) {
  const { value, error } = schema.validate({
    id: formData.get('id'),
    plan: formData.get('plan'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { saleorId: me.id },
      },
      relations: {
        plan: true,
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    data.plan.mealPlan = value.plan === 'full' ? MealPlan.Full : MealPlan.Half;

    await queryRunner.manager.save(data);
  });
}
