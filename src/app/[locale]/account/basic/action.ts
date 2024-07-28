'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import userService from '@/services/user';

interface UpdateBasicInfoAction {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp?: { code: string; value: string };
}

const schema = Joi.object<UpdateBasicInfoAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).required(),
  whatsapp: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).optional(),
});

export default async function updateBasicInfoAction(data: UpdateBasicInfoAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  if (!me) {
    throw new Error('cannot get the current user');
  }

  await userService.update(
    me.id,
    value.firstName,
    value.lastName,
    value.email,
    value.phone,
    value.whatsapp
  );
}
