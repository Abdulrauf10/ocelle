import { startOfDay } from 'date-fns';
import { LessThan, MoreThan } from 'typeorm';

import { Shipment } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { handleRecurringBox } from '@/services/recurring';

export default async function recurringBoxScheduler() {
  console.log('[Recurring Box] Start: %s', new Date());
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
      order: {
        deliveryDate: -1,
      },
    });
  });
  console.log('[Recurring Box] Total Shipments: %s', shipments.length);
  for (const shipment of shipments) {
    try {
      await handleRecurringBox(shipment.user.id);
    } catch (e) {
      console.error('[Recurring Box] Failed to handle box, user id: %s', shipment.user.id);
      console.error(e);
    }
  }
  console.log('[Recurring Box] Compeleted: %s', new Date());
}
