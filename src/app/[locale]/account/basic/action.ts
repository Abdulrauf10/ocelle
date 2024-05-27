'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { User } from '@/entities';
import { UpdateUserDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';

interface UpdateBasicInfoAction {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp?: { code: string; value: string };
}

const schema = Joi.object<UpdateBasicInfoAction>({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).required(),
  whatsapp: Joi.object({
    code: Joi.string().required(),
    value: Joi.string().required(),
  }).optional(),
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

  const { customerUpdate } = await executeGraphQL(UpdateUserDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
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

  await executeQuery(async (queryRunner) => {
    await queryRunner.manager.update(User, me.id, {
      phone: value.phone,
      whatsapp: value.whatsapp,
    });
  });
}
