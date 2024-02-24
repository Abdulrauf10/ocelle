'use server';

import { SetForgotPasswordDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
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

  const { setPassword } = await executeGraphQL(SetForgotPasswordDocument, {
    variables: {
      email: value.email,
      password: value.password,
      token: value.token,
    },
    withAuth: false,
  });

  return { errors: setPassword?.errors };
}
