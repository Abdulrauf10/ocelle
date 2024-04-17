'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import PartialCardForm from './partial/CardStripe';
import Button from '../buttons/Button';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

export default function CardForm({
  action,
}: {
  action(data: { paymentMethodId: string }): Promise<void>;
}) {
  const t = useTranslations();
  const stripe = useStripe();
  const elements = useElements();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);
  const [isNumberEmpty, setIsNumberEmpty] = React.useState(true);
  const [isExpireEmpty, setIsExpireEmpty] = React.useState(true);
  const [isCvcEmpty, setIsCvcEmpty] = React.useState(true);

  const handleClearForm = React.useCallback(() => {
    if (!elements) {
      return;
    }
    elements.getElement(CardNumberElement)?.clear();
    elements.getElement(CardExpiryElement)?.clear();
    elements.getElement(CardCvcElement)?.clear();
  }, [elements]);

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
        const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card });
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
        console.log(paymentMethod);
        await action({ paymentMethodId: paymentMethod.id });
        handleClearForm();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitInProgress(false);
      }
    },
    [isSubmitInProgress, elements, stripe, action, handleClearForm]
  );

  React.useEffect(() => {
    if (!elements) {
      return;
    }
    elements.getElement(CardNumberElement)?.on('change', ({ empty }) => {
      setIsNumberEmpty(empty);
    });
    elements.getElement(CardExpiryElement)?.on('change', ({ empty }) => {
      setIsExpireEmpty(empty);
    });
    elements.getElement(CardCvcElement)?.on('change', ({ empty }) => {
      setIsCvcEmpty(empty);
    });
  }, [elements]);

  const isEmpty = isNumberEmpty || isExpireEmpty || isCvcEmpty;

  return (
    <form ref={ref} onSubmit={onSubmit}>
      <PartialCardForm />
      <div className="-mx-2 mt-8 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            reverse
            type="button"
            onClick={handleClearForm}
            disabled={isSubmitInProgress || isEmpty}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={isSubmitInProgress || isEmpty}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
