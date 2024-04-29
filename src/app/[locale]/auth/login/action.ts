'use server';

import Joi from 'joi';

import { User } from '@/entities';
import { GetCurrentUserDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { redirect } from '@/navigation';
import saleorAuthClient from '@/saleorAuthClient';

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

  if (tokenCreate.errors.length > 0) {
    console.error(tokenCreate.errors);
    throw new Error('email or password is invaild');
  }

  const { me } = await executeGraphQL(GetCurrentUserDocument, {});

  const user = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(User, { where: { id: me!.id }, relations: { dogs: true } });
  });

  if (!user) {
    saleorAuthClient.signOut();
    throw new Error('cannot find the user in the database, login failed');
  }

  if (user.dogs.length === 0) {
    // not yet completed any surveys
    saleorAuthClient.signOut();
    throw new Error('not yet completed any surveys, login failed');
  }

  redirect('/account/plan');
}
