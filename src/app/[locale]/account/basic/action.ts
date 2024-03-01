'use server';

import { UpdateUserDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { getStoreMe } from '@/storeUserProvider';
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

export default async function updateBasicInfoAction(formData: FormData) {
  const { value, error } = schema.validate({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

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

  if (customerUpdate?.errors) {
    console.error(customerUpdate?.errors);
    throw new Error('update user failed');
  }
}
