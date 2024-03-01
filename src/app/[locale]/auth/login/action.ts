'use server';

import saleorAuthClient from '@/saleorAuthClient';
import Joi from 'joi';

interface LoginAction {
  email: string;
  password: string;
}

const schema = Joi.object<LoginAction>({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default async function loginAction(data: LoginAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const {
    data: { tokenCreate },
  } = await saleorAuthClient.signIn(
    {
      email: value.email,
      password: value.password,
    },
    { cache: 'no-store' }
  );

  if (tokenCreate.errors) {
    console.error(tokenCreate.errors);
    throw new Error('login failed');
  }
}
