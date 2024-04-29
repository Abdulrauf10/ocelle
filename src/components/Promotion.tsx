'use client';

import { useTranslations } from 'next-intl';

import Container from './Container';

import { Link, usePathname } from '@/navigation';

export default function Promotion() {
  const t = useTranslations('Promotion');
  const b = useTranslations('Button');
  const pathname = usePathname();

  if (pathname === '/get-started/complete') {
    return undefined;
  }

  return (
    <div className="bg-primary py-2 text-center text-xl text-white max-xl:text-base">
      <Container>
        {t('content-1')}
        <Link href="/get-started" className="font-bold underline">
          {t('content-2')}
        </Link>
        !
      </Container>
    </div>
  );
}
