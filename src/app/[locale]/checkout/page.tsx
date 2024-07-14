import { getTranslations } from 'next-intl/server';
import React from 'react';

import {
  applyCoupon,
  deleteCartLine,
  finalizeCheckout,
  initializeStripeTranscation,
  updateCartLine,
  updateCheckoutData,
} from './actions';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Promotion from '@/components/Promotion';
import StripeLoader from '@/components/StripeLoader';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import CouponForm from '@/components/forms/Coupon';
import GuestCheckoutForm from '@/components/forms/GuestCheckout';
import { getRecurringBoxMinDeliveryDate } from '@/helpers/shipment';
import calendarService from '@/services/calendar';

export default async function Checkout() {
  const t = await getTranslations();
  const calendarEvents = await calendarService.getCalendarEvents();
  const minDeliveryDate = getRecurringBoxMinDeliveryDate(calendarEvents);
  const { paymentIntent, publishableKey } = await initializeStripeTranscation();

  return (
    <AppThemeProvider
      theme={{
        components: {
          MuiAutocomplete: {
            styleOverrides: {
              input: {
                paddingTop: '3.5px !important',
                paddingBottom: '3.5px !important',
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              input: {
                padding: '10px 16.5px',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                transform: 'translate(16px, 10px) scale(1)',
                ['&.Mui-focused, &.MuiFormLabel-filled']: {
                  transform: 'translate(16px, -9px) scale(.75)',
                },
              },
            },
          },
        },
      }}
    >
      <Promotion />
      <Header disableLanguageSwitch disableGetStartedButton disableMenuButton disableLoginButton />
      <StripeLoader clientSecret={paymentIntent.client_secret} publishableKey={publishableKey}>
        <div className="py-10">
          <div className="relative">
            <Container className="mb-4 text-right max-md:absolute max-md:right-0">
              <UnderlineButton
                href="/how-it-works/individual-pack"
                theme="primary"
                label={t('continue-browsing')}
                underline
              />
            </Container>
            <GuestCheckoutForm
              clientSecret={paymentIntent.client_secret}
              minDeliveryDate={minDeliveryDate}
              calendarEvents={calendarEvents}
              couponForm={<CouponForm action={applyCoupon} />}
              onCartUpdate={updateCartLine}
              onCartDelete={deleteCartLine}
              onBeforeTransaction={updateCheckoutData}
              onCompleteTransaction={finalizeCheckout}
            />
          </div>
        </div>
      </StripeLoader>
    </AppThemeProvider>
  );
}
