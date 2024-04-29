'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { User } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { DogPlanDto } from '@/types/dto';

interface UpdateSubscriptionAction {
  plans: DogPlanDto[];
}

const dogPlanDtoSchema = Joi.object<DogPlanDto>({
  id: Joi.number().required(),
  name: Joi.string().required(),
  enabled: Joi.boolean().required(),
});

const schema = Joi.object<UpdateSubscriptionAction>({
  plans: Joi.array().items(dogPlanDtoSchema.required()).required(),
});

export default async function updateSubscriptionAction(data: UpdateSubscriptionAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  // TODO: handle plans enable status change
}
