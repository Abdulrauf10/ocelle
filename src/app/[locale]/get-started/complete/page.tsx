'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Benefits from '../Benefits';
import { dropOrderSession, getDeliveryDate } from '../actions';

import Container from '@/components/Container';
import { getSurveySessionStore } from '@/helpers/session';
import useSentence from '@/hooks/useSentence';
import { Link, useRouter } from '@/navigation';

export default function ThankYouPage() {
  const t = useTranslations();
  const sentence = useSentence();
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
      setDeliveryDate(new Date(deliveryDate));
      await dropOrderSession();
      getSurveySessionStore().clearAll();
    } catch (e) {
      console.error(e);
      router.replace('/get-started');
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
        <div className="mt-8"></div>
        <h1 className="heading-4 font-bold text-primary">{t('processing-your-order')}</h1>
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
      <div className="mt-6"></div>
      <h1 className="heading-4 font-bold text-primary">{t('thank-you-for-your-order')}</h1>
      <p className="mt-4 text-primary">
        {t('your-{}-will-be-delivered-on-the-{}', {
          value: t('starter-box').toLowerCase(),
          date: sentence.date(deliveryDate, true),
        })}
      </p>
      <Benefits />
    </Container>
  );
}
