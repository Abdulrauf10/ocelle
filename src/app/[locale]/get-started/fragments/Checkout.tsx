import React from 'react';
import Stage from '../Stage';
import AppThemeProvider from '@/components/AppThemeProvider';
import { completeCheckout, processCheckout } from '../actions';
import CheckoutForm from '../CheckoutForm';
import { CardNumberElement } from '@stripe/react-stripe-js';
import { useSurvey } from '../SurveyContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';
import { useRouter } from '@/navigation';
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
          <CheckoutForm
            dogs={dogs}
            closestDeliveryDate={state.closestDeliveryDate}
            calendarEvents={state.calendarEvents}
            onEditMealPlan={() => navigate(Stage.ChoosePlan, { state: { isEdit: true } })}
            onEditRecipes={() => navigate(Stage.RecommendedPlan, { state: { isEdit: true } })}
            onEditTransitionPeriod={() =>
              navigate(Stage.RecommendedPlan, { state: { isEdit: true } })
            }
            action={async (data, stripe, elements) => {
              await processCheckout(data);
              const card = elements.getElement(CardNumberElement);
              if (!card) {
                throw new Error('cannot find card element');
              }
              const address = data.isSameBillingAddress
                ? data.deliveryAddress
                : data.billingAddress!;
              const { error } = await stripe.confirmCardPayment(
                state.stripe.paymentIntent.client_secret,
                {
                  payment_method: {
                    card,
                    billing_details: {
                      name: address.firstName + ' ' + address.lastName,
                      email: data.email,
                      address: {
                        city: address.district,
                        country: address.country,
                        line1: address.streetAddress1,
                        line2: address.streetAddress2,
                        state: address.region,
                      },
                      phone: '+852' + data.phone, // assume all phones are from HK
                    },
                  },
                  receipt_email: data.email,
                  // save_payment_method: true,
                }
              );
              if (error) {
                console.log(error);
                // This point will only be reached if there is an immediate error when
                // confirming the payment. Otherwise, your customer will be redirected to
                // your `return_url`. For some payment methods like iDEAL, your customer will
                // be redirected to an intermediate site first to authorize the payment, then
                // redirected to the `return_url`.
                if (error.type === 'card_error' || error.type === 'validation_error') {
                  console.error(error.message ?? 'Something went wrong');
                } else {
                  console.error('An unexpected error occurred');
                }
                return;
              }
              await completeCheckout();
              router.push('/get-started/complete');
            }}
          />
        </StripeLoader>
      </AppThemeProvider>
    </motion.div>
  );
}
