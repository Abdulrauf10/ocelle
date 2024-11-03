'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import pauseDeliveriesAction from './action';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DatePickerForm from '@/components/forms/DatePicker';
import CircleTick from '@/components/icons/CircleTick';
import useSentence from '@/hooks/useSentence';

export default function PauseDelivery() {
  const t = useTranslations();
  const sentence = useSentence();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [completed, setCompleted] = React.useState(false);

  const handleOnComplete = React.useCallback((values: { date: Date }) => {
    setSelectedDate(values.date);
    setCompleted(true);
  }, []);

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        {selectedDate && completed ? (
          <Container>
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary p-1.5">
              <CircleTick className="relative top-px" />
            </div>
            <div className="mt-2"></div>
            <h1 className="heading-4 text-center font-bold text-primary">{t('done')}</h1>
            <p className="mx-auto mt-4 max-w-[600px] text-center">
              {t.rich('your-orders-are-now-paused-delivery-will-resume-on-the-{}', {
                date: sentence.date(selectedDate, true),
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
              {t.rich('pause-all-deliveries:description')}
            </p>
            <div className="py-4"></div>
            <div className="text-center text-xl font-bold text-gold">
              {t('when-would-you-like-to-resume')}
            </div>
            <div className="mt-4">
              <DatePickerForm
                initialDate={new Date()}
                action={pauseDeliveriesAction}
                onComplete={handleOnComplete}
              />
            </div>
            <div className="mt-8 text-center">
              <UnderlineBackButton label={t('go-back')} />
            </div>
          </Container>
        )}
      </main>
    </AppThemeProvider>
  );
}
