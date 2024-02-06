'use client';

import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import UnderlineButton from '@/components/UnderlineButton';
import { TextField, ThemeProvider } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function Login() {
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
            Greetings!
          </Headings>
          <p className="mt-4 text-xl">Please log in to continue.</p>
          <div className="mx-auto max-w-[260px] max-xs:max-w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} label={t('email')} fullWidth {...field} />
                )}
              />
              <div className="py-4"></div>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label="Password"
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth>{t('log-in')}</Button>
            </form>
            <UnderlineButton
              href="/auth/forgot-password"
              className="mt-4 text-lg"
              label="Forgot Password?"
            />
            <hr className="mt-4 border-primary" />
            <Headings tag="h2" styles="h2" className="mt-6">
              New To OCELLE?
            </Headings>
            <Button href="/get-started" reverse fullWidth className="mt-8">
              {t('build-your-plan')}
            </Button>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
