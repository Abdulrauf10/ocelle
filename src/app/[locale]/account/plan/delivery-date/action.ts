'use server';

import { User } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { startOfDay } from 'date-fns';
import { getLoginedMe } from '@/actions';

interface SetDeliveryDateAction {
  date: Date;
}

const schema = Joi.object<SetDeliveryDateAction>({
  date: Joi.date().required(),
});

export default async function setDeliveryDateAction(data: SetDeliveryDateAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const deliveryDate = startOfDay(value.date);
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

    await queryRunner.manager.save(data);
  });
}
