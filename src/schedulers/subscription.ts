import { User } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';
import { handleRecurringBox } from '@/helpers/recurring';
import { startOfDay } from 'date-fns';
import { IsNull, LessThan } from 'typeorm';

export default async function subscriptionScheduler() {
  const today = startOfDay(new Date());
  const users = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(User, {
      where: {
        dogs: {
          boxs: {
            order: IsNull(),
            shipment: {
              editableDeadline: LessThan(today),
            },
          },
        },
      },
      relations: {
        dogs: {
          breeds: {
            breed: true,
          },
          plan: true,
          boxs: {
            shipment: true,
          },
        },
      },
    });
  });
  for (const user of users) {
    try {
      await handleRecurringBox(user.id);
    } catch (e) {
      console.error('failed to handle subscription recurring box, user id: %s', user.id);
      console.error(e);
    }
  }
}
