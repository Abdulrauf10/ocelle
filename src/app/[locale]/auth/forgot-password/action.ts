'use server';

import Joi from 'joi';

import authService from '@/services/auth';

interface ForgotPasswordAction {
  email: string;
}

const schema = Joi.object<ForgotPasswordAction>({
  email: Joi.string().required(),
});

export default async function forgotPasswordAction(data: ForgotPasswordAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  await authService.forgotPassword(value.email);
}
