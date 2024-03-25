import React from 'react';
import Stage from '../Stage';
import { FragmentProps } from '@/components/FragmentRouter';
import AppThemeProvider from '@/components/AppThemeProvider';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { processCheckout } from '../actions';
import CheckoutForm from '../CheckoutForm';
import { useSurvey } from '../SurveyContext';

export default function CheckoutFragment({ state, navigate }: FragmentProps<Stage>) {
  const { dogs } = useSurvey();

  if (!state) {
    throw new Error('failed to process checkout, state is undefined');
  }

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
      <Elements
        options={{ clientSecret: state.stripe.paymentIntent.client_secret }}
        stripe={loadStripe(state.stripe.publishableKey)}
      >
        <CheckoutForm
          dogs={dogs}
          defaultDeliveryDate={state.defaultDeliveryDate}
          calendarEvents={state.calendarEvents}
          onEditMealPlan={() => navigate(Stage.ChoosePlan, { state: { isEdit: true } })}
          onEditRecipes={() => navigate(Stage.RecommendedPlan, { state: { isEdit: true } })}
          onEditTransitionPeriod={() =>
            navigate(Stage.RecommendedPlan, { state: { isEdit: true } })
          }
          action={async (data) => {
            await processCheckout(data);
          }}
        />
      </Elements>
    </AppThemeProvider>
  );
}
