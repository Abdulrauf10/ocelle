'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Benefits from '../Benefits';
import { dropOrderSession, getOrderConfigurations } from '../actions';

import Container from '@/components/Container';
import { getSurveySessionStore } from '@/helpers/session';
import useSentence from '@/hooks/useSentence';
import { Link, useRouter } from '@/navigation';

export default function ThankYouPage() {
  const id = React.useId();
  const t = useTranslations();
  const sentence = useSentence();
  const router = useRouter();
  const {
    data: configurations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['get-started-completeOrderConfigurations', id],
    queryFn: () => getOrderConfigurations(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  React.useEffect(() => {
    if (configurations) {
      dropOrderSession();
      getSurveySessionStore().clearAll();
    }
  }, [configurations]);

  React.useEffect(() => window.scrollTo(0, 0), []);

  if (isError) {
    router.replace('/get-started');
    return;
  }

  if (isLoading || !configurations) {
    return (
      <Container className="py-24 text-center">
        <Image
          src="/question/loading.gif"
          alt="loading indicator"
          width={200}
          height={200}
          className="inline-block"
          unoptimized
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
        {t.rich('your-{}-will-be-delivered-on-the-{}', {
          value: t('starter-box').toLowerCase(),
          date: sentence.date(configurations.deliveryDate, true),
        })}
      </p>
      <Benefits />
    </Container>
  );
}
