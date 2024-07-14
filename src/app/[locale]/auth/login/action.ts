'use server';

import Joi from 'joi';

import { User } from '@/entities';
import { GetCurrentUserDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';
import { redirect } from '@/navigation';
import { getServerAuthClient } from '@/saleorAuthClient';

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
    return 'schema is not valid';
  }

  const {
    data: { tokenCreate },
  } = await getServerAuthClient().signIn(
    {
      email: value.email,
      password: value.password,
    },
    { cache: 'no-store' }
  );

  if (tokenCreate.errors.length > 0) {
    console.error(tokenCreate.errors);
    return 'email or password is in-vaild';
  }

  const { me } = await executeGraphQL(GetCurrentUserDocument, {});

  const user = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.findOne(User, { where: { id: me!.id }, relations: { dogs: true } });
  });

  if (!user) {
    getServerAuthClient().signOut();
    return 'the user account is not initialled, please contact info@ocelle.dog for more.';
  }

  if (user.dogs.length === 0) {
    // not yet completed any surveys
    getServerAuthClient().signOut();
    return 'please completed the dog survey before log in the system.';
  }

  redirect('/account/plan');
}
