'use server';

import { RecurringBox, Shipment, User } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { startOfDay } from 'date-fns';
import { getLoginedMe } from '@/actions';
import { In, IsNull } from 'typeorm';

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
    const data = await queryRunner.manager.find(Shipment, {
      where: {
        boxs: {
          order: IsNull(),
          dog: {
            user: {
              id: me.id,
            },
          },
        },
      },
      relations: {
        boxs: {
          dog: true,
        },
      },
    });

    if (data.length === 0) {
      throw new Error('shipments not found');
    }

    const shipment = data[0];

    if (data.length > 1) {
      // merge all shipment into single one
      const boxIds = [];
      for (const shipment of data) {
        for (const box of shipment.boxs) {
          boxIds.indexOf(box.id) === -1 && boxIds.push(box.id);
        }
      }
      await queryRunner.manager.update(RecurringBox, { id: In(boxIds) }, { shipment });
    }

    await queryRunner.manager.update(Shipment, shipment.id, { deliveryDate });
  });
}
