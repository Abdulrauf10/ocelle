import { getLoginedMe } from '@/actions';
import { cancelRecurringBox } from '@/helpers/recurring';

export default async function cancelSubscription() {
  const me = await getLoginedMe();

  await cancelRecurringBox(me.id);
}
