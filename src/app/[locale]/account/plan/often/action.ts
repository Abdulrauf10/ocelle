'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogPlan } from '@/entities';
import { Frequency } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';

interface SetFrequencyAction {
  id: number;
  frequency: Frequency;
}

const schema = Joi.object<SetFrequencyAction>({
  id: Joi.number().positive().required(),
  frequency: Joi.valid(...Object.values(Frequency)).required(),
});

export default async function setFrequencyAction(data: SetFrequencyAction) {
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

    await queryRunner.manager.update(DogPlan, data.plan.id, { frequency: value.frequency });
  });
}
