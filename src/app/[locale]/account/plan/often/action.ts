'use server';

import { getStoreMe } from '@/storeUserProvider';
import { User } from '@/entities';
import { OrderSize } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';

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

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(User, {
      where: {
        id: me.id,
      },
    });

    if (!data) {
      throw new Error('user not found');
    }

    data.orderSize = value.size;

    await queryRunner.manager.save(data);
  });
}
