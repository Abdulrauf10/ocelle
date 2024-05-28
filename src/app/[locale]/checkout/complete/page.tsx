'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import { dropCheckoutSession, getDeliveryDate } from '../actions';

import Container from '@/components/Container';
import useSentence from '@/hooks/useSentence';
import { Link, useRouter } from '@/navigation';

export default function CompletePage() {
  const id = React.useId();
  const t = useTranslations();
  const sentence = useSentence();
  const router = useRouter();
  const {
    data: deliveryDate,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['completeDeliveryDate', id],
    queryFn: async () => await getDeliveryDate(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  React.useEffect(() => {
    if (deliveryDate) {
      dropCheckoutSession();
    }
  }, [deliveryDate]);

  if (isError) {
    router.replace('/');
    return;
  }

  if (isLoading || !deliveryDate) {
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
        {t.rich('your-{}-will-be-delivered-on-the-{}', {
          value: t('order').toLowerCase(),
          date: sentence.date(new Date(deliveryDate), true),
        })}
      </p>
    </Container>
  );
}
