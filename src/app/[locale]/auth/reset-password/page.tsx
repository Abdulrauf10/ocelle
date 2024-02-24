'use client';

import React from 'react';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import PasswordField from '@/components/controls/PasswordField';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import AppThemeProvider from '@/components/AppThemeProvider';
import { resetPasswordAction } from './action';

export default function ResetPassword() {
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
            {t('change-{}', { value: t('password') })}
          </Headings>
          <div className="mx-auto max-w-[280px] max-xs:max-w-full">
            <form action={resetPasswordAction} className="mx-auto mt-6">
              <PasswordField
                name="password"
                control={control}
                rules={{ required: true }}
                label={t('new-password')}
                fullWidth
              />
              <div className="py-4"></div>
              <PasswordField
                name="confirmPassword"
                control={control}
                rules={{ required: true }}
                label={t('confirm-{}', { value: t('new-password') })}
                fullWidth
              />
              <div className="py-6"></div>
              <Button fullWidth disabled={!isValid}>
                {t('set-{}', { value: t('new-password') })}
              </Button>
            </form>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
