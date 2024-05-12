import { motion } from 'framer-motion';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { applyCoupon, finalizeCheckout, updateCheckoutData } from '../actions';
import { pageVariants } from '../transition';

import AppThemeProvider from '@/components/AppThemeProvider';
import StripeLoader from '@/components/StripeLoader';
import CouponForm from '@/components/forms/Coupon';
import SubscriptionCheckoutForm from '@/components/forms/SubscriptionCheckout';

export default function CheckoutFragment() {
  const { dogs, owner } = useSurvey();
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
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
        <StripeLoader
          clientSecret={state.stripe.paymentIntent.client_secret}
          publishableKey={state.stripe.publishableKey}
        >
          <SubscriptionCheckoutForm
            defaultValues={owner}
            initialCheckout={state.checkout}
            dogs={dogs}
            clientSecret={state.stripe.paymentIntent.client_secret}
            closestDeliveryDate={state.closestDeliveryDate}
            calendarEvents={state.calendarEvents}
            couponForm={<CouponForm action={applyCoupon} />}
            onEditMealPlan={() => navigate(Stage.ChoosePlan, { state: { isEdit: true } })}
            onEditRecipes={() => navigate(Stage.RecommendedPlan, { state: { isEdit: true } })}
            onEditTransitionPeriod={() =>
              navigate(Stage.RecommendedPlan, { state: { isEdit: true } })
            }
            onBeforeTransaction={updateCheckoutData}
            onCompleteTransaction={finalizeCheckout}
          />
        </StripeLoader>
      </AppThemeProvider>
    </motion.div>
  );
}
