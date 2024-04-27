import { RecurringBox, Shipment } from '@/entities';
import { startOfDay } from 'date-fns';
import { MoreThanOrEqual, QueryRunner } from 'typeorm';
import { getEditableRecurringBoxDeadline } from './dog';
import { getCalendarEvents } from './calendar';

/**
 * Find a current available shipment otherwise return a new shipment
 */
export async function getBoxShipmentRecord(
  queryRunner: QueryRunner,
  userId: string,
  preferDeliveryDate: Date
) {
  const events = await getCalendarEvents();
  const today = startOfDay(new Date());

  const data = await queryRunner.manager.findOne(Shipment, {
    where: {
      user: { id: userId },
      lockBoxDate: MoreThanOrEqual(today),
    },
    relations: {
      boxs: true,
    },
    order: {
      deliveryDate: -1,
    },
  });

  if (data) {
    return data;
  }

  const shipment = queryRunner.manager.create(Shipment, {
    deliveryDate: preferDeliveryDate,
    lockBoxDate: getEditableRecurringBoxDeadline(events, preferDeliveryDate),
    user: {
      id: userId,
    },
  });

  await queryRunner.manager.save(shipment);

  return shipment;
}

export function findMostMatchBoxStartDate(boxs: RecurringBox[]) {
  return boxs[0].startDate;
}
