'use server';

import { UpdateUserDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { getLoginedMe } from '@/actions';
import Joi from 'joi';

interface UpdateBasicInfoAction {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const schema = Joi.object<UpdateBasicInfoAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

export default async function updateBasicInfoAction(data: UpdateBasicInfoAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  if (!me) {
    throw new Error('cannot get the current user');
  }

  // TODO: update user phone

  const { customerUpdate } = await executeGraphQL(UpdateUserDocument, {
    variables: {
      id: me.id,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
    },
  });

  if (!customerUpdate || customerUpdate.errors.length > 0) {
    console.error(customerUpdate?.errors);
    throw new Error('update user failed');
  }
}
