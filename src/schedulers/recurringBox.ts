import { User } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { handleRecurringBox } from '@/services/recurring';

export default async function recurringBoxScheduler() {
  console.log('[Recurring Box] Start: %s', new Date());
  const users = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(User, {
      where: {
        dogs: {
          plan: {
            isEnabled: true,
          },
        },
      },
    });
  });
  console.log('[Recurring Box] Total user to handle: %s', users.length);
  for (const user of users) {
    try {
      await handleRecurringBox(user);
    } catch (e) {
      console.error('[Recurring Box] Failed to handle user with id: %s', user.id);
      console.error(e);
    }
  }
  console.log('[Recurring Box] Compeleted: %s', new Date());
}
