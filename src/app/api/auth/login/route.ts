import { NextResponse } from 'next/server';
import Joi from 'joi';
import saleorAuthClient from '@/saleorAuthClient';

interface LoginPOST {
  email: string;
  password: string;
}

const schema = Joi.object<LoginPOST>({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const dynamic = 'force-dynamic'; // defaults to auto

export async function POST(request: Request) {
  const { value, error } = schema.validate(await request.json());

  if (error) {
    return NextResponse.json({ error });
  }

  await saleorAuthClient.signIn(
    {
      email: value.email,
      password: value.password,
    },
    { cache: 'no-store' }
  );

  return NextResponse.json({});
}
