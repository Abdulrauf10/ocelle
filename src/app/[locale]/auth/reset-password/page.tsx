import React from 'react';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import { useTranslations } from 'next-intl';
import AppThemeProvider from '@/components/AppThemeProvider';
import resetPasswordAction from './action';
import ResetPasswordForm from '@/components/forms/ResetPassword';
import { redirect } from '@/navigation';

export default function ResetPassword({
  searchParams,
}: {
  searchParams?: { email?: string; token?: string };
}) {
  const t = useTranslations();

  if (!searchParams || !searchParams.email || !searchParams.token) {
    return redirect('/auth/login');
  }

  return (
    <AppThemeProvider>
      <main className="py-10 text-center text-primary">
        <Container>
          <Headings tag="h1" styles="h2">
            {t('change-{}', { value: t('password') })}
          </Headings>
          <div className="mx-auto max-w-[280px] max-xs:max-w-full">
            <ResetPasswordForm
              action={async (data) => {
                'use server';
                return await resetPasswordAction({
                  ...data,
                  email: searchParams.email!,
                  token: searchParams.token!,
                });
              }}
            />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
