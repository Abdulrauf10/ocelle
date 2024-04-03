import React from 'react';
import Stage from '../Stage';
import AppThemeProvider from '@/components/AppThemeProvider';
import { applyCoupon, finalizeCheckout, updateCheckoutData } from '../actions';
import SubscriptionCheckoutForm from '@/components/forms/SubscriptionCheckoutForm';
import { useSurvey } from '../SurveyContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';
import { useRouter } from '@/navigation';
import CouponForm from '@/components/forms/Coupon';
import StripeLoader from '@/components/StripeLoader';

export default function CheckoutFragment() {
  const { dogs } = useSurvey();
  const router = useRouter();
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
