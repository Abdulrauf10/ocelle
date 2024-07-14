'use server';

import { getLoginedMe } from '@/actions';
import recurringService from '@/services/recurring';

export default async function reactivatePlanAction(deliveryDate: Date) {
  const me = await getLoginedMe();

  await recurringService.resume(me.id, deliveryDate);
}
