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

export async function resetPasswordAction(formData: FormData) {
  const { value, error } = schema.validate({
    email: formData.get('email'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const {
    data: { setPassword },
  } = await saleorAuthClient.resetPassword(value);

  return { errors: setPassword.errors };
}
