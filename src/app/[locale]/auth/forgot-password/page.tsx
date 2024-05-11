import { useTranslations } from 'next-intl';
import React from 'react';

import forgotPasswordAction from './action';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import ForgetPasswordForm from '@/components/forms/ForgetPassword';

export default function ForgotPassword() {
  const t = useTranslations();

  return (
    <AppThemeProvider>
      <main className="py-10 text-center text-primary">
        <Container>
          <h1 className="heading-4 font-bold">{t('set-{}', { value: t('new-password') })}</h1>
          <div className="mt-4"></div>
          <p className="body-2">
            {t('trouble-logging-in-please-enter-your-email-to-reset-your-password')}
          </p>
          <div className="mx-auto max-w-[300px] max-xs:max-w-full">
            <ForgetPasswordForm
              action={forgotPasswordAction}
              className={{ button: 'body-2 mx-auto max-w-[230px]' }}
            />
            <div className="mt-4"></div>
            <div className="mx-auto max-w-[230px]">
              <UnderlineButton
                href="/auth/login"
                className="body-2"
                label={t('back-to-{}', { name: t('log-in') })}
              />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
