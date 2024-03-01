import React from 'react';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import AppThemeProvider from '@/components/AppThemeProvider';
import CardForm from '@/components/forms/Card';
import AccountBackButton from '../AccountBackButton';
import { getTranslations } from 'next-intl/server';
import updateCreditCardAction from './action';

async function getData() {
  return {
    name: 'Chan Tai Man',
    cardNo: '3320202020200201',
    cardExp: '10/26',
    cvc: '102',
  };
}

export default async function Payments() {
  const t = await getTranslations();
  const { name, cardNo, cardExp, cvc } = await getData();

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <Headings tag="h1" styles="h2" className="text-center text-primary">
              {t('payment-info')}
            </Headings>
            <div className="py-4"></div>
            <CardForm
              name={name}
              cardNo={cardNo}
              cardExp={cardExp}
              cvc={cvc}
              action={updateCreditCardAction}
            />
            <div className="mt-12 text-center">
              <AccountBackButton />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
