import { RequestPasswordResetDocument, SetForgotPasswordDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import Joi from 'joi';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

interface ForgotPasswordPOST {
  email: string;
}

const schemaPOST = Joi.object<ForgotPasswordPOST>({
  email: Joi.string().required(),
});

export const dynamic = 'force-dynamic'; // defaults to auto

export async function POST(request: Request) {
  const headersList = headers();
  const host = headersList.get('host');
  const { value, error } = schemaPOST.validate(await request.json());

  if (error) {
    return NextResponse.json({ error });
  }

  const { requestPasswordReset } = await executeGraphQL(RequestPasswordResetDocument, {
    variables: {
      email: value.email,
      redirectUrl: `${host}/auth/reset-password`,
    },
    withAuth: false,
  });

  return NextResponse.json({ errors: requestPasswordReset?.errors });
}

interface ForgotPasswordPUT {
  email: string;
  password: string;
  token: string;
}

const schemaPUT = Joi.object<ForgotPasswordPUT>({
  email: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export async function PUT(request: Request) {
  const { value, error } = schemaPUT.validate(await request.json());

  if (error) {
    return NextResponse.json({ error });
  }

  const { setPassword } = await executeGraphQL(SetForgotPasswordDocument, {
    variables: {
      email: value.email,
      password: value.password,
      token: value.token,
    },
    withAuth: false,
  });

  return NextResponse.json({ errors: setPassword?.errors });
}
