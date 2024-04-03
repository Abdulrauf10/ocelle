'use client';

import UnderlineButton from '@/components/buttons/UnderlineButton';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function BackButton({ label }: { label: string }) {
  const t = useTranslations();
  const router = useRouter();

  return <UnderlineButton type="button" label={label} onClick={() => router.back()} />;
}
