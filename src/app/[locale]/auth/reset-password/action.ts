'use server';

import saleorAuthClient from '@/saleorAuthClient';
import Joi from 'joi';

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

  const {
    data: { setPassword },
  } = await saleorAuthClient.resetPassword(value);

  if (setPassword.errors) {
    console.error(setPassword.errors);
    throw new Error('reset password failed');
  }
}
