import React from 'react';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import AppThemeProvider from '@/components/AppThemeProvider';
import UserBasicInfoForm from '@/components/forms/UserBasicInfo';
import { getTranslations } from 'next-intl/server';
import updateBasicInfoAction from './action';
import BackButton from '@/components/BackButton';

async function getData() {
  return {
    firstName: 'Chan',
    lastName: 'Tai Man',
    email: 'email@example.com',
    phone: '88888888',
  };
}

export default async function BasicInfo() {
  const t = await getTranslations();
  const { firstName, lastName, email, phone } = await getData();

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <h1 className="heading-4 text-center font-bold text-primary">{t('account-info')}</h1>
            <div className="py-4"></div>
            <UserBasicInfoForm
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              middleAdornment={
                <div className="mt-10">
                  <UnderlineButton
                    type="button"
                    href="/account/change-password"
                    label={t('change-{}', { value: t('password') })}
                  />
                </div>
              }
              action={updateBasicInfoAction}
            />
            <div className="mt-12 text-center">
              <BackButton label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
