import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import UnderlineButton from '@/components/UnderlineButton';
import React from 'react';
import forgotPasswordAction from './action';
import ForgetPasswordForm from '@/components/forms/ForgetPassword';
import { useTranslations } from 'next-intl';

export default function ForgotPassword() {
  const t = useTranslations();

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
            <ForgetPasswordForm action={forgotPasswordAction} />
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
