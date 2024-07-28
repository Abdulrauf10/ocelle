'use server';

import Joi from 'joi';

import authService from '@/services/auth';

interface ResetPasswordAction {
  email: string;
  password: string;
  token: string;
}

const schema = Joi.object<ResetPasswordAction>({
  email: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export default async function resetPasswordAction(data: ResetPasswordAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  await authService.resetPassword(value.email, value.password, value.token);
}
