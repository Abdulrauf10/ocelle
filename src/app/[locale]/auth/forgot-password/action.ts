'use server';

import { RequestPasswordResetDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import Joi from 'joi';
import { headers } from 'next/headers';

interface ForgotPasswordAction {
  email: string;
}

const schema = Joi.object<ForgotPasswordAction>({
  email: Joi.string().required(),
});

export async function forgotPasswordAction(formData: FormData) {
  const headersList = headers();
  const host = headersList.get('host');
  const { value, error } = schema.validate({
    email: formData.get('email'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const { requestPasswordReset } = await executeGraphQL(RequestPasswordResetDocument, {
    variables: {
      email: value.email,
      redirectUrl: `${host}/auth/reset-password`,
    },
    withAuth: false,
  });

  return { errors: requestPasswordReset?.errors };
}
