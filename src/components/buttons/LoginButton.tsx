import { getLoginedMeWithoutRedirect } from '@/actions';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

export default async function LoginButton() {
  const t = await getTranslations();
  const me = await getLoginedMeWithoutRedirect();

  if (!me) {
    return (
      <Link href="/auth/login" className="whitespace-nowrap hover:underline max-lg:mr-0">
        {t('log-in')}
      </Link>
    );
  }

  return (
    <Link href="/account/plan" className="whitespace-nowrap hover:underline max-lg:mr-0">
      {me.firstName}
    </Link>
  );
}
