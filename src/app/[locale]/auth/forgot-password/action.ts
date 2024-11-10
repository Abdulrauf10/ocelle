'use server';

import Joi from 'joi';
import { getTranslations } from 'next-intl/server';

import { AuthForgotPasswordError } from '@/errors/auth';
import authService from '@/services/auth';

interface ForgotPasswordAction {
  email: string;
}

const schema = Joi.object<ForgotPasswordAction>({
  email: Joi.string().lowercase().required(),
});

export default async function forgotPasswordAction(data: ForgotPasswordAction) {
  const t = await getTranslations();

  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  try {
    await authService.forgotPassword(value.email);
  } catch (err) {
    if (
      err instanceof AuthForgotPasswordError &&
      err.errors?.find((err) => err.code === 'NOT_FOUND')
    ) {
      return t('user-not-found');
    }
    throw err;
  }
}
