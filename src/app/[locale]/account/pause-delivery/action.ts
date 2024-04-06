'use server';

import { User } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { getLoginedMe } from '@/actions';
import { startOfDay } from 'date-fns';
import Joi from 'joi';

interface PauseDeliveriesAction {
  deliveryDate: Date;
}

const schema = Joi.object<PauseDeliveriesAction>({
  deliveryDate: Joi.date().required(),
});

export default async function pauseDeliveriesAction(data: PauseDeliveriesAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const deliveryDate = startOfDay(value.deliveryDate);
  const me = await getLoginedMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(User, {
      where: {
        id: me.id,
      },
    });

    if (!data) {
      throw new Error('user not found');
    }

    // TODO: set delivery date
    console.log(deliveryDate);
  });
}
