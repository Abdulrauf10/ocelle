'use server';

import { SaleorUser } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { getStoreMe } from '@/storeUserProvider';
import { startOfDay } from 'date-fns';
import Joi from 'joi';

interface PauseDeliveriesAction {
  deliveryDate: string;
}

const schema = Joi.object<PauseDeliveriesAction>({
  deliveryDate: Joi.date().required(),
});

export default async function pauseDeliveriesAction(formData: FormData) {
  const { value, error } = schema.validate({
    deliveryDate: formData.get('deliveryDate'),
  });

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
  });
}
