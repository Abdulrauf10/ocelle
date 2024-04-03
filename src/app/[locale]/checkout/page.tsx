import React from 'react';
import { getClosestOrderDeliveryDate } from '@/helpers/dog';
import AppThemeProvider from '@/components/AppThemeProvider';
import CouponForm from '@/components/forms/Coupon';
import GuestCheckoutForm from '@/components/forms/GuestCheckoutForm';
import { getCalendarEvents } from '@/helpers/calendar';
import {
  applyCoupon,
  deleteCartLine,
  finalizeCheckout,
  getCartOrCheckout,
  initializeStripeTranscation,
  updateCartLine,
  updateCheckoutData,
} from './actions';
import { CartContextProvider } from '@/contexts/cart';
import StripeLoader from '@/components/StripeLoader';
import UnderlineButton from '@/components/UnderlineButton';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import Notice from '@/components/Notice';
import Header from '@/components/Header';

export default async function Checkout() {
  const t = await getTranslations();
  const cartOrCheckout = await getCartOrCheckout();
  const calendarEvents = await getCalendarEvents();
  const closestDeliveryDate = getClosestOrderDeliveryDate(calendarEvents);
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
      <Notice />
      <Header disableLanguageSwitch disableGetStartedButton disableMenuButton disableLoginButton />
      <CartContextProvider
        lines={cartOrCheckout.lines}
        totalPrice={cartOrCheckout.totalPrice.gross}
      >
        <StripeLoader clientSecret={paymentIntent.client_secret} publishableKey={publishableKey}>
          <div className="py-10">
            <Container className="mb-4 text-right">
              <UnderlineButton
                href="/how-it-works/individual"
                theme="primary"
                label={t('continue-browsing')}
                underline
              />
            </Container>
            <GuestCheckoutForm
              clientSecret={paymentIntent.client_secret}
              closestDeliveryDate={closestDeliveryDate}
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
