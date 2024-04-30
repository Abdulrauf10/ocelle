'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { User } from '@/entities';
import { OrderSize } from '@/enums';
import { getNumericEnumValues } from '@/helpers/enum';
import { executeQuery } from '@/helpers/queryRunner';

interface SetOrderSizeAction {
  size: OrderSize;
}

const schema = Joi.object<SetOrderSizeAction>({
  size: Joi.valid(...getNumericEnumValues(OrderSize)).required(),
});

export default async function setOrderSizeAction(data: SetOrderSizeAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  await executeQuery(async (queryRunner) => {
    await queryRunner.manager.update(User, { id: me.id }, { orderSize: value.size });
  });
}
