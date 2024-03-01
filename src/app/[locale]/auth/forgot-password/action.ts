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

export default async function forgotPasswordAction(data: ForgotPasswordAction) {
  const headersList = headers();
  const host = headersList.get('host');
  const { value, error } = schema.validate(data);

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

  if (requestPasswordReset?.errors) {
    console.error(requestPasswordReset.errors);
    throw new Error('forget password failed');
  }
}
