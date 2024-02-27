'use server';

import { getStoreMe } from '@/storeUserProvider';
import { SaleorUser } from '@/entities';
import { OrderSize } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';

interface SetOrderSizeAction {
  size: string;
}

const schema = Joi.object<SetOrderSizeAction>({
  size: Joi.string().required(),
});

export default async function setOrderSizeAction(formData: FormData) {
  const { value, error } = schema.validate({
    size: formData.get('size'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(SaleorUser, {
      where: {
        saleorId: me.id,
      },
    });

    if (!data) {
      throw new Error('user not found');
    }

    data.orderSize = value.size === '7' ? OrderSize.OneWeek : OrderSize.TwoWeek;

    await queryRunner.manager.save(data);
  });
}
