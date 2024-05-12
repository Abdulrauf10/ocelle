'use client';

import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '../buttons/Button';
import PartialCardForm, { useCardStripeForm } from './partial/CardStripe';

export default function CardForm({
  clientSecret,
  action,
}: {
  clientSecret: string;
  action(data: { paymentMethodId: string }): Promise<void>;
}) {
  const t = useTranslations();
  const stripe = useStripe();
  const elements = useElements();
  const form = useCardStripeForm();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitInProgress || !stripe || !elements) {
        return;
      }
      setIsSubmitInProgress(true);
      try {
        const card = elements.getElement(CardNumberElement);
        if (!card) {
          throw new Error('cannot find card element');
        }
        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card,
          },
        });
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
        const paymentMethodId =
          typeof setupIntent.payment_method === 'string'
            ? setupIntent.payment_method
            : setupIntent.payment_method!.id;
        await action({ paymentMethodId });
        form.reset();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitInProgress(false);
      }
    },
    [isSubmitInProgress, elements, stripe, clientSecret, action, form]
  );

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <PartialCardForm form={form} />
      <div className="-mx-2 mt-8 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            reverse
            type="button"
            onClick={() => form.reset()}
            disabled={isSubmitInProgress || form.empty}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={isSubmitInProgress || form.empty}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
