import React from 'react';
import Container from '@/components/Container';
import { useTranslations } from 'next-intl';
import AppThemeProvider from '@/components/AppThemeProvider';
import ChangePasswordForm from '@/components/forms/ChangePassword';
import AccountBackButton from '../AccountBackButton';
import changePasswordAction from './action';

export default function ChangePassword() {
  const t = useTranslations();

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <h1 className="heading-3 text-center font-bold text-primary">
              {t('change-{}', { value: t('password') })}
            </h1>
            <div className="py-4"></div>
            <ChangePasswordForm action={changePasswordAction} />
            <div className="mt-12 text-center">
              <AccountBackButton />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
