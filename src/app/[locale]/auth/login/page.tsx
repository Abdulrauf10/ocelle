'use client';

import AppThemeProvider from '@/components/AppThemeProvider';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import UnderlineButton from '@/components/UnderlineButton';
import PasswordField from '@/components/controls/PasswordField';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import loginAction from './action';

export default function Login() {
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
            {t('greetings')}
          </Headings>
          <p className="mt-4 text-xl">{t('please-log-in-to-continue')}</p>
          <div className="mx-auto max-w-[260px] max-xs:max-w-full">
            <form action={loginAction} className="mx-auto mt-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} label={t('email')} fullWidth {...field} />
                )}
              />
              <div className="py-4"></div>
              <PasswordField
                name="password"
                control={control}
                rules={{ required: true }}
                label={t('password')}
                fullWidth
              />
              <div className="py-6"></div>
              <Button fullWidth disabled={!isValid}>
                {t('log-in')}
              </Button>
            </form>
            <UnderlineButton
              href="/auth/forgot-password"
              className="mt-4 text-lg"
              label={t('forgot-password')}
            />
            <hr className="mt-4 border-primary" />
            <Headings tag="h2" styles="h2" className="mt-6">
              {t('new-to-ocelle')}
            </Headings>
            <Button href="/get-started" reverse fullWidth className="mt-8">
              {t('build-your-plan')}
            </Button>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
