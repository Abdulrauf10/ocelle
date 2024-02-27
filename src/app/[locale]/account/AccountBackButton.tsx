'use client';

import UnderlineButton from '@/components/UnderlineButton';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function AccountBackButton() {
  const t = useTranslations();
  const router = useRouter();

  return <UnderlineButton type="button" label={t('go-back')} onClick={() => router.back()} />;
}
