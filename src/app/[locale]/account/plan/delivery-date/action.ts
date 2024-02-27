'use server';

import { getStoreMe } from '@/storeUserProvider';
import { SaleorUser } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';

interface SetDeliveryDateAction {
  deliveryDate: string;
}

const schema = Joi.object<SetDeliveryDateAction>({
  deliveryDate: Joi.date().required(),
});

export default async function setDeliveryDateAction(formData: FormData) {
  const { value, error } = schema.validate({
    deliveryDate: formData.get('date'),
  });

  if (error) {
    throw new Error('schema is not valid');
  }

  const deliveryDate = new Date(value.deliveryDate);
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
