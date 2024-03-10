'use client';

import React from 'react';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import CircleTick from '@/components/icons/CircleTick';
import { useTranslations } from 'next-intl';
import AppThemeProvider from '@/components/AppThemeProvider';
import DeliveryDateForm from '@/components/forms/DeliveryDate';
import pauseDeliveriesAction from './action';
import AccountBackButton from '../AccountBackButton';

export default function PauseDelivery() {
  const t = useTranslations();
  const [completed, setCompleted] = React.useState(false);

  const handleOnComplete = React.useCallback(() => {
    setCompleted(true);
  }, []);

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        {completed ? (
          <Container>
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary p-1.5">
              <CircleTick className="relative top-px" />
            </div>
            <h1 className="heading-4 mt-2 text-center font-bold text-primary">{t('done')}</h1>
            <p className="mx-auto mt-4 max-w-[360px] text-center">
              {t.rich('your-orders-are-now-paused-delivery-will-resume-on-the-{}', {
                strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
                date: '[23rd of February 2024]',
              })}
            </p>
            <div className="mt-8 text-center">
              <UnderlineButton
                type="button"
                href="/account"
                label={t('back-to-{}', { name: t('my-info') })}
              />
            </div>
          </Container>
        ) : (
          <Container>
            <h1 className="heading-4 text-center font-bold text-primary">
              {t('pause-all-deliveries')}
            </h1>
            <p className="mx-auto mt-4 max-w-[680px] text-center">
              {t('pause-all-deliveries:description')}
            </p>
            <div className="py-4"></div>
            <div className="text-center text-xl font-bold text-gold">
              {t('when-would-you-like-to-resume')}
            </div>
            <div className="mt-4">
              <DeliveryDateForm
                initialDate={new Date()}
                action={pauseDeliveriesAction}
                onComplete={handleOnComplete}
              />
            </div>
            <div className="mt-8 text-center">
              <AccountBackButton />
            </div>
          </Container>
        )}
      </main>
    </AppThemeProvider>
  );
}
