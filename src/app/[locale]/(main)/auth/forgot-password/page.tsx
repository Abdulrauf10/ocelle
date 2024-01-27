'use client';

import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { TextField, ThemeProvider } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function ForgotPassword() {
  const t = useTranslations('general');
  const { control, handleSubmit } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    //
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-beige py-10 text-center text-primary">
        <Container>
          <H2 inline>Set New Password</H2>
          <p className="mt-4 text-xl">
            Trouble logging in? Please enter your email to reset your password.
          </p>
          <div className="mx-auto max-w-[300px] max-xs:max-w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} label={t('email')} fullWidth {...field} />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth>{t('submit')}</Button>
            </form>
            <UnderlineButton
              href="/auth/login"
              className="mt-4 text-lg"
              label={t('back-to', { name: t('log-in') })}
            />
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
