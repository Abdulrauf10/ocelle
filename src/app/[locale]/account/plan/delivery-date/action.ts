'use server';

import { startOfDay } from 'date-fns';
import Joi from 'joi';
import { MoreThanOrEqual } from 'typeorm';

import { getLoginedMe } from '@/actions';
import { Shipment } from '@/entities';
import { getEditableRecurringBoxDeadline } from '@/helpers/dog';
import { executeQuery } from '@/helpers/queryRunner';
import { getCalendarEvents } from '@/services/calendar';

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
    const shipment = await queryRunner.manager.findOne(Shipment, {
      where: {
        user: {
          id: me.id,
        },
        editableDeadline: MoreThanOrEqual(today),
      },
    });

    if (!shipment) {
      throw new Error('shipment not found');
    }

    await queryRunner.manager.update(Shipment, shipment.id, {
      deliveryDate,
      editableDeadline,
    });
  });
}
