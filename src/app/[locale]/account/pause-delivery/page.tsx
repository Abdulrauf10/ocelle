'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import DateCalendar from '@/components/controls/DateCalendar';
import CircleTick from '@/components/icons/CircleTick';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';
import AppThemeProvider from '@/components/AppThemeProvider';

export default function PauseDelivery() {
  const t = useTranslations();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();
  const [completed, setCompleted] = React.useState(false);

  const onSubmit = React.useCallback((values: unknown) => {
    console.log(values);
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
            <Headings tag="h1" styles="h2" className="mt-2 text-center text-primary">
              {t('done')}
            </Headings>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Container>
              <Headings tag="h1" styles="h2" className="text-center text-primary">
                {t('pause-all-deliveries')}
              </Headings>
              <p className="mx-auto mt-4 max-w-[680px] text-center">
                {t('pause-all-deliveries:description')}
              </p>
              <div className="py-4"></div>
              <div className="text-center text-xl font-bold text-gold">
                {t('when-would-you-like-to-resume')}
              </div>
              <div className="mt-4">
                <DateCalendar name="deliveryDate" control={control} minDate={new Date()} />
              </div>
              <div className="mt-8 text-center">
                <UnderlineButton type="button" onClick={() => router.back()} label={t('go-back')} />
              </div>
            </Container>
          </form>
        )}
      </main>
    </AppThemeProvider>
  );
}
