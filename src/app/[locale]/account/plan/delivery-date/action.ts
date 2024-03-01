'use server';

import { getStoreMe } from '@/storeUserProvider';
import { SaleorUser } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { startOfDay } from 'date-fns';

interface SetDeliveryDateAction {
  deliveryDate: Date;
}

const schema = Joi.object<SetDeliveryDateAction>({
  deliveryDate: Joi.date().required(),
});

export default async function setDeliveryDateAction(data: SetDeliveryDateAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const deliveryDate = startOfDay(value.deliveryDate);
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
    console.log(deliveryDate);

    await queryRunner.manager.save(data);
  });
}
