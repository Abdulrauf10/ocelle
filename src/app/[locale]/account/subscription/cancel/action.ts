import { getLoginedMe } from '@/actions';
import recurringService from '@/services/recurring';

export default async function cancelSubscription() {
  const me = await getLoginedMe();

  await recurringService.pause(me.id);
}
