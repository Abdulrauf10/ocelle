import { getTranslations } from 'next-intl/server';
import React from 'react';
import invariant from 'ts-invariant';

import updateCreditCardAction from './action';

import { getLoginedMe } from '@/actions';
import stripeClient from '@/clients/stripe';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import StripeLoader from '@/components/StripeLoader';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import CardForm from '@/components/forms/Card';

invariant(
  process.env.STRIPE_PUBLISHABLE_KEY,
  'Missing STRIPE_PUBLISHABLE_KEY environment variable'
);

export default async function Payments() {
  const t = await getTranslations();
  const me = await getLoginedMe();
  const setupIntent = await stripeClient.createSetupIntent({
    customer: me.stripe,
    payment_method_types: ['card'],
    usage: 'off_session',
    payment_method_options: {
      card: {
        request_three_d_secure: 'challenge',
      },
    },
  });

  if (!setupIntent.client_secret) {
    throw new Error('client secret not found');
  }

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <h1 className="heading-4 text-center font-bold text-primary">{t('payment-info')}</h1>
            <div className="py-4"></div>
            <StripeLoader
              publishableKey={process.env.STRIPE_PUBLISHABLE_KEY!}
              clientSecret={setupIntent.client_secret}
            >
              <CardForm clientSecret={setupIntent.client_secret} action={updateCreditCardAction} />
            </StripeLoader>
            <div className="mt-12 text-center">
              <UnderlineBackButton label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
