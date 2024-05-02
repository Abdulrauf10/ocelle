import { getLoginedMe } from '@/actions';
import { pauseRecurringBox } from '@/services/recurring';

export default async function cancelSubscription() {
  const me = await getLoginedMe();

  await pauseRecurringBox(me.id);
}
