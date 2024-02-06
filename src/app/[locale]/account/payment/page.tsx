'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import { ThemeProvider } from '@mui/material';
import Button from '@/components/Button';
import theme from '@/app/mui-theme';
import CardForm from '@/components/forms/Card';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

export default function Payments() {
  const t = useTranslations();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <Headings tag="h1" styles="h2" className="text-center text-primary">
              Payment Info
            </Headings>
            <div className="py-4"></div>
            <CardForm control={control} />
            <div className="-mx-2 mt-8 flex">
              <div className="w-1/2 px-2">
                <Button fullWidth onClick={reset} reverse>
                  {t('cancel')}
                </Button>
              </div>
              <div className="w-1/2 px-2">
                <Button fullWidth>{t('save-changes')}</Button>
              </div>
            </div>
            <div className="mt-12 text-center">
              <UnderlineButton type="button" onClick={() => router.back()} label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
