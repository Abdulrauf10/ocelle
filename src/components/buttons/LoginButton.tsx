'use client';

import { getLoginedMeWithoutRedirect } from '@/actions';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import React from 'react';

type LoginedMeReturn = Awaited<ReturnType<typeof getLoginedMeWithoutRedirect>>;

export default function LoginButton() {
  const t = useTranslations();
  const [me, setMe] = React.useState<LoginedMeReturn | null>();

  React.useEffect(() => {
    getLoginedMeWithoutRedirect().then((me) => setMe(me));
  }, []);

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
