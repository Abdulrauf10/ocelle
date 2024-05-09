import { useTranslations } from 'next-intl';
import React from 'react';

import changePasswordAction from './action';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import ChangePasswordForm from '@/components/forms/ChangePassword';

export default function ChangePassword() {
  const t = useTranslations();

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <h1 className="heading-4 text-center font-bold text-primary">
              {t('change-{}', { value: t('password') })}
            </h1>
            <div className="py-4"></div>
            <ChangePasswordForm action={changePasswordAction} />
            <div className="mt-12 text-center">
              <UnderlineBackButton label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
