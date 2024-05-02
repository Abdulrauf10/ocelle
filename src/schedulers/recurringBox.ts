import { Shipment, User } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { handleRecurringBox } from '@/services/recurring';

export default async function recurringBoxScheduler() {
  console.log('[Recurring Box] Start: %s', new Date());
  console.log();
  const shipments = await executeQuery(async (queryRunner) => {
    const query = queryRunner.manager
      .getRepository(Shipment)
      .createQueryBuilder('s')
      .setFindOptions({
        loadEagerRelations: true,
      })
      .leftJoinAndSelect('s.user', 'k')
      .where(
        (qb) =>
          's.id = ' +
          qb
            .subQuery()
            .select('id')
            .from(Shipment, 'v')
            .where('s.user_id = v.user_id')
            .orderBy('v.delivery_date', 'DESC')
            .limit(1)
            .getQuery()
      );
    return query.getMany();
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
