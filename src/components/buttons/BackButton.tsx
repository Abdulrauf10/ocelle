'use client';

import { useTranslations } from 'next-intl';

import UnderlineButton from '@/components/buttons/UnderlineButton';
import { useRouter } from '@/navigation';

export default function BackButton({ label }: { label: string }) {
  const t = useTranslations();
  const router = useRouter();

  return <UnderlineButton type="button" label={label} onClick={() => router.back()} />;
}
