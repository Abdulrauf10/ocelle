'use server';

import Joi from 'joi';

import authService from '@/services/auth';

interface ChangePasswordAction {
  currentPassword: string;
  newPassword: string;
}

const schema = Joi.object<ChangePasswordAction>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export default async function changePasswordAction(data: ChangePasswordAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  await authService.changePassword(value.currentPassword, value.newPassword);
}
