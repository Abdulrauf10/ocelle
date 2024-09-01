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
          <div className="mt-4"></div>
          <p className="body-2">{t('please-log-in-to-continue')}</p>
          <div className="mx-auto max-w-[210px] lang-zh:max-w-[280px] max-xs:max-w-full">
            <LoginForm
              action={loginAction}
              className={{ button: 'body-2 mx-auto max-w-[210px] lang-zh:max-w-[280px]' }}
            />
          </div>
          <div className="mx-auto max-w-[210px] lang-zh:max-w-[280px]">
            <div className="mt-4"></div>
            <UnderlineButton
              href="/auth/forgot-password"
              className="body-2"
              label={t('forgot-password')}
            />
            <hr className="mt-4 border-primary" />
            <div className="mt-6"></div>
            <h2 className="heading-4 font-bold">{t('new-to-ocelle')}</h2>
            <div className="mt-8"></div>
            <Button fontSize="small" href="/get-started" reverse fullWidth>
              {t('build-your-plan')}
            </Button>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
