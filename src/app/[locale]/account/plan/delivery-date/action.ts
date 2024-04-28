'use server';

import { RecurringBox, Shipment } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { startOfDay } from 'date-fns';
import { getLoginedMe } from '@/actions';
import { In, MoreThanOrEqual } from 'typeorm';
import { getEditableRecurringBoxDeadline } from '@/helpers/dog';
import { getCalendarEvents } from '@/helpers/calendar';

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
  const events = await getCalendarEvents();
  const today = startOfDay(new Date());
  const editableDeadline = getEditableRecurringBoxDeadline(events, deliveryDate);

  if (editableDeadline < today) {
    throw new Error('delivery date is unavailable');
  }

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.find(Shipment, {
      where: {
        user: {
          id: me.id,
        },
        editableDeadline: MoreThanOrEqual(today),
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
      // merge all shipments into single one
      const boxIds = [];
      for (const shipment of data) {
        for (const box of shipment.boxs) {
          boxIds.indexOf(box.id) === -1 && boxIds.push(box.id);
        }
      }
      await queryRunner.manager.update(RecurringBox, { id: In(boxIds) }, { shipment });
    }

    await queryRunner.manager.update(Shipment, shipment.id, {
      deliveryDate,
      editableDeadline,
    });
  });
}
