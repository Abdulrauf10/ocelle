import { getLoginedMe } from '@/actions';
import { cancelRecurringBox } from '@/services/recurring';

export default async function cancelSubscription() {
  const me = await getLoginedMe();

  await cancelRecurringBox(me.id);
}
