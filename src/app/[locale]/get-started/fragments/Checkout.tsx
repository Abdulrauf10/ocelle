import { motion } from 'framer-motion';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { applyCoupon, finalizeDraftOrder, handleMutateDraftOrder } from '../actions';
import { pageVariants } from '../transition';

import AppThemeProvider from '@/components/AppThemeProvider';
import StripeLoader from '@/components/StripeLoader';
import SubscriptionCheckoutForm from '@/components/forms/SubscriptionCheckout';
import { OrderProvider } from '@/contexts/order';

export default function CheckoutFragment() {
  const { dogs, owner } = useSurvey();
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
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
        <OrderProvider initOrder={state.order}>
          <StripeLoader
            clientSecret={state.stripe.paymentIntent.client_secret}
            publishableKey={state.stripe.publishableKey}
          >
            <SubscriptionCheckoutForm
              defaultValues={owner}
              dogs={dogs.map((dog, idx) => {
                return {
                  name: dog.name!,
                  mealPlan: dog.mealPlan!,
                  recipe1: dog.recipe1!,
                  recipe2: dog.recipe2,
                  isEnabledTransitionPeriod: dog.isEnabledTransitionPeriod!,
                  perDayPrice: state.dogsPerDayPrice[idx].price,
                };
              })}
              clientSecret={state.stripe.paymentIntent.client_secret}
              closestDeliveryDate={state.closestDeliveryDate}
              calendarEvents={state.calendarEvents}
              onApplyCoupon={applyCoupon}
              onEditMealPlan={() => navigate(Stage.ChoosePlan, { state: { isEdit: true } })}
              onEditRecipes={() => navigate(Stage.RecommendedPlan, { state: { isEdit: true } })}
              onEditTransitionPeriod={() =>
                navigate(Stage.RecommendedPlan, { state: { isEdit: true } })
              }
              onBeforeTransaction={handleMutateDraftOrder}
              onCompleteTransaction={finalizeDraftOrder}
            />
          </StripeLoader>
        </OrderProvider>
      </AppThemeProvider>
    </motion.div>
  );
}
