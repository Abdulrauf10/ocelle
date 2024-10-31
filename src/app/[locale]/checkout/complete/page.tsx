'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useTimeout } from 'usehooks-ts';

import { dropCheckoutSession, getOrderConfigurations } from '../actions';

import Container from '@/components/Container';
import { useCart } from '@/contexts/cart';
import useSentence from '@/hooks/useSentence';
import { Link, useRouter } from '@/navigation';

export default function CompletePage() {
  const id = React.useId();
  const t = useTranslations();
  const sentence = useSentence();
  const cart = useCart();
  const router = useRouter();
  const {
    data: configurations,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['checkout-completeOrderConfigurations', id],
    queryFn: () => getOrderConfigurations(),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  useTimeout(() => {
    // redirect after 30 seconds
    router.replace('/');
  }, 30 * 1000);

  React.useEffect(() => {
    if (configurations) {
      dropCheckoutSession();
      cart.clear();
    }
  }, [configurations, cart]);

  if (isError) {
    router.replace('/');
    return;
  }

  if (isLoading || !configurations) {
    return (
      <Container className="flex min-h-[100vh] flex-col items-center justify-center py-8">
        <Image
          src="/get-started/loading.gif"
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
    <Container className="flex min-h-[100vh] flex-col items-center justify-center py-8">
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
      <h1 className="heading-4 text-center font-bold text-primary">
        {t('thank-you-for-your-order')}
      </h1>
      <p className="mx-auto mt-4 text-center text-primary">
        {t.rich('your-{}-will-be-delivered-on-the-{}', {
          value: t('order').toLowerCase(),
          date: sentence.date(configurations.deliveryDate, true),
        })}
      </p>
    </Container>
  );
}
