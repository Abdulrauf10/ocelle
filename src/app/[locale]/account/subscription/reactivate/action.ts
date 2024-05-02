'use server';

import { getLoginedMe } from '@/actions';
import { resumeRecurringBox } from '@/services/recurring';

export default async function reactivatePlanAction(deliveryDate: Date) {
  const me = await getLoginedMe();

  await resumeRecurringBox(me.id, deliveryDate);
}
