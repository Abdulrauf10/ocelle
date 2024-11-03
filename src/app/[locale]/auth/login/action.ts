'use server';

import Joi from 'joi';
import { getTranslations } from 'next-intl/server';

import { AuthInvalidCredentialsError, AuthNotYetCompleteSurveyError } from '@/errors/auth';
import { UserMeError } from '@/errors/user';
import { redirect } from '@/navigation';
import authService from '@/services/auth';

interface LoginAction {
  email: string;
  password: string;
}

const schema = Joi.object<LoginAction>({
  email: Joi.string().lowercase().required(),
  password: Joi.string().required(),
});

export default async function loginAction(data: LoginAction) {
  const t = await getTranslations();

  const { value, error } = schema.validate(data);

  if (error) {
    return 'schema is not valid';
  }

  try {
    await authService.login(value.email, value.password);
  } catch (e) {
    if (e instanceof AuthInvalidCredentialsError) {
      return t('email-or-password-is-in-vaild');
    }
    if (e instanceof UserMeError) {
      return 'the user account is not initialled, please contact info@ocelle.dog for more.';
    }
    if (e instanceof AuthNotYetCompleteSurveyError) {
      return 'please completed the dog survey before log in the system.';
    }
  }

  redirect('/account/plan');
}
