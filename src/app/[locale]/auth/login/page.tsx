import { useTranslations } from 'next-intl';
import React from 'react';

import loginAction from './action';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import LoginForm from '@/components/forms/Login';

export default function Login() {
  const t = useTranslations();

  return (
    <AppThemeProvider>
      <main className="py-10 text-center text-primary">
        <Container>
          <h1 className="heading-4 font-bold">{t('greetings')}</h1>
          <p className="body-2 mt-4">{t('please-log-in-to-continue')}</p>
          <div className="mx-auto max-w-[210px] max-xs:max-w-full">
            <LoginForm
              action={loginAction}
              className={{ button: 'body-2 mx-auto max-w-[210px]' }}
            />
          </div>
          <div className="mx-auto max-w-[210px]">
            <UnderlineButton
              href="/auth/forgot-password"
              className="body-2 mt-4"
              label={t('forgot-password')}
            />
            <hr className="mt-4 border-primary" />
            <h2 className="heading-4 mt-6 font-bold">{t('new-to-ocelle')}</h2>
            <Button href="/get-started" reverse fullWidth className="body-2 mt-8">
              {t('build-your-plan')}
            </Button>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
