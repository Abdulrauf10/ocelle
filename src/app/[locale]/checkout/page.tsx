import { getTranslations } from 'next-intl/server';
import React from 'react';

import {
  applyCoupon,
  deleteCartLine,
  finalizeCheckout,
  initializeCheckout,
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
import { CartContextProvider } from '@/contexts/cart';
import { getRecurringBoxMinDeliveryDate } from '@/helpers/shipment';
import { getCalendarEvents } from '@/services/calendar';

export default async function Checkout() {
  const t = await getTranslations();
  const checkout = await initializeCheckout();
  const calendarEvents = await getCalendarEvents();
  const minDeliveryDate = getRecurringBoxMinDeliveryDate(calendarEvents);
  const { paymentIntent, publishableKey } = await initializeStripeTranscation();

  return (
    <AppThemeProvider
      theme={{
        components: {
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
      <CartContextProvider
        lines={checkout.lines}
        shippingPrice={checkout.shippingPrice.gross}
        totalPrice={checkout.totalPrice.gross}
      >
        <StripeLoader clientSecret={paymentIntent.client_secret} publishableKey={publishableKey}>
          <div className="py-10">
            <Container className="mb-4 text-right">
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
        </StripeLoader>
      </CartContextProvider>
    </AppThemeProvider>
  );
}
