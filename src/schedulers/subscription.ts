import { startOfDay } from 'date-fns';
import { LessThan, MoreThan } from 'typeorm';

import { Shipment } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { handleRecurringBox } from '@/services/recurring';

export default async function subscriptionScheduler() {
  const today = startOfDay(new Date());
  const shipments = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(Shipment, {
      where: {
        editableDeadline: LessThan(today),
        deliveryDate: MoreThan(today),
      },
      relations: {
        user: true,
      },
    });
  });
  for (const shipment of shipments) {
    try {
      await handleRecurringBox(shipment.user.id);
    } catch (e) {
      console.error('failed to handle subscription recurring box, user id: %s', shipment.user.id);
      console.error(e);
    }
  }
}
