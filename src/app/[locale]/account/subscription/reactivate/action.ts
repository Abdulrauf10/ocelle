'use server';

import { getLoginedMe } from '@/actions';
import { reactivteRecurringBox } from '@/helpers/recurring';

export default async function reactivatePlanAction(deliveryDate: Date) {
  const me = await getLoginedMe();

  await reactivteRecurringBox(me.id, deliveryDate);
}
