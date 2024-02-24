'use client';

import AppThemeProvider from '@/components/AppThemeProvider';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import UnderlineButton from '@/components/UnderlineButton';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { forgotPasswordAction } from './action';

export default function ForgotPassword() {
  const t = useTranslations();
  const {
    control,
    formState: { isValid },
  } = useForm();

  return (
    <AppThemeProvider>
      <main className="py-10 text-center text-primary">
        <Container>
          <Headings tag="h1" styles="h2">
            {t('set-{}', { value: t('new-password') })}
          </Headings>
          <p className="mt-4 text-xl">
            {t('trouble-logging-in-please-enter-your-email-to-reset-your-password')}
          </p>
          <div className="mx-auto max-w-[300px] max-xs:max-w-full">
            <form action={forgotPasswordAction} className="mx-auto mt-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} label={t('email')} fullWidth {...field} />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth disabled={!isValid}>
                {t('submit')}
              </Button>
            </form>
            <UnderlineButton
              href="/auth/login"
              className="mt-4 text-lg"
              label={t('back-to-{}', { name: t('log-in') })}
            />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
