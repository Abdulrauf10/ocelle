'use client';

import Container from '@/components/Container';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import Image from 'next/image';
import { dropCheckoutSession, getDeliveryDate } from '../actions';
import { formatDate } from '@/helpers/date';
import React from 'react';

export default function CompletePage() {
  const t = useTranslations();
  const router = useRouter();
  const [ran, setRan] = React.useState(false);
  const [deliveryDate, setDeliveryDate] = React.useState<Date>();

  const startCleanUp = React.useCallback(async () => {
    if (ran) {
      return;
    }
    try {
      setRan(true);
      const deliveryDate = await getDeliveryDate();
      if (!deliveryDate) {
        throw new Error('delivery date is undefined');
      }
      setDeliveryDate(deliveryDate);
      await dropCheckoutSession();
    } catch (e) {
      console.error(e);
      router.replace('/');
    }
  }, [ran, router]);

  React.useEffect(() => {
    startCleanUp();
  }, [startCleanUp]);

  if (!deliveryDate) {
    return (
      <Container className="py-24 text-center">
        <Image
          src="/question/loading.gif"
          alt="loading indicator"
          width={200}
          height={200}
          className="inline-block"
        />
        <h1 className="heading-4 mt-8 font-bold text-primary">{t('processing-your-order')}</h1>
      </Container>
    );
  }

  return (
    <Container className="py-24 text-center">
      <Link href="/" className="relative z-10 mx-auto inline-block px-2">
        <Image
          alt="Ocelle"
          src="/ocelle-logo.png"
          width={160}
          height={48}
          className="min-w-[160px]"
        />
      </Link>
      <h1 className="heading-4 mt-6 font-bold text-primary">{t('thank-you-for-your-order')}</h1>
      <p className="mt-4 text-primary">
        {t('your-{}-will-be-delivered-on-the-{}', {
          value: t('order').toLowerCase(),
          date: formatDate(t, deliveryDate, true),
        })}
      </p>
    </Container>
  );
}
