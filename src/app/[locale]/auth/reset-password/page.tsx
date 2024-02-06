'use client';

import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import { TextField, ThemeProvider } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function ResetPassword() {
  const t = useTranslations();
  const { control, handleSubmit } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    //
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="py-10 text-center text-primary">
        <Container>
          <Headings tag="h1" styles="h2">
            {t('change-{}', { value: t('password') })}
          </Headings>
          <div className="mx-auto max-w-[280px] max-xs:max-w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6">
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label={t('new-password')}
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-4"></div>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label={t('confirm-{}', { value: t('new-password') })}
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth>{t('set-{}', { value: t('new-password') })}</Button>
            </form>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
