'use server';

import { getStoreMe } from '@/storeUserProvider';
import { SaleorUser } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';

interface SetDeliveryDateAction {
  date: Date;
}

const schema = Joi.object<SetDeliveryDateAction>({
  date: Joi.date().required(),
});

export default async function setDeliveryDateAction(formData: FormData) {
  const { value, error } = schema.validate({
    date:
      typeof formData.get('date') === 'string'
        ? new Date(formData.get('date') as string)
        : undefined,
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

    // TODO: set delivery date

    await queryRunner.manager.save(data);
  });
}
