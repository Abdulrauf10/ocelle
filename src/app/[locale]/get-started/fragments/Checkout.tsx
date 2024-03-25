import React from 'react';
import Stage from '../Stage';
import AppThemeProvider from '@/components/AppThemeProvider';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { processCheckout } from '../actions';
import CheckoutForm from '../CheckoutForm';
import { useSurvey } from '../SurveyContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

export default function CheckoutFragment() {
  const { dogs } = useSurvey();
  const navigate = useNavigate();
  const { state } = useLocation();
  const elementOptions = React.useMemo(() => {
    return { clientSecret: state.stripe.paymentIntent.client_secret };
  }, [state.stripe]);
  const stripePromise = React.useMemo(
    () => loadStripe(state.stripe.publishableKey),
    [state.stripe]
  );

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
        <Elements options={elementOptions} stripe={stripePromise}>
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
    </motion.div>
  );
}
