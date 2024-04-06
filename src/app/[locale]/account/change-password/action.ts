'use server';

import { ChangePasswordDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import Joi from 'joi';

interface ChangePasswordAction {
  currentPassword: string;
  newPassword: string;
}

const schema = Joi.object<ChangePasswordAction>({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export default async function changePasswordAction(data: ChangePasswordAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const { passwordChange } = await executeGraphQL(ChangePasswordDocument, {
    variables: {
      oldPassword: value.currentPassword,
      newPassword: value.newPassword,
    },
  });

  if (!passwordChange || passwordChange.errors.length > 0) {
    console.error(passwordChange?.errors);
    throw new Error('change password failed');
  }
}
