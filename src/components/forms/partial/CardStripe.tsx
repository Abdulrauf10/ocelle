'use client';

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
} from '@stripe/react-stripe-js';
import { StripeElementChangeEvent } from '@stripe/stripe-js';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Lock from '../../icons/Lock';
import Stripe from '../../icons/Stripe';

import {
  StripeTextFieldCVC,
  StripeTextFieldExpiry,
  StripeTextFieldNumber,
} from '@/components/controls/StripeTextField';

type CardFieldType = 'no' | 'exp' | 'cvc';

interface CardStripeFieldState {
  empty: boolean;
  complete: boolean;
  error?: {
    type: 'validation_error';
    code: string;
    message: string;
  };
}

interface UseCardStripeFormReturn {
  formState: {
    cardNo?: CardStripeFieldState;
    cardExp?: CardStripeFieldState;
    cardCvc?: CardStripeFieldState;
  };
  empty: boolean;
  complete: boolean;
  handleCardFieldChange(field: CardFieldType, event: StripeElementChangeEvent): void;
  reset(): void;
}

export function useCardStripeForm(): UseCardStripeFormReturn {
  const elements = useElements();
  const [numberState, setNumberState] = React.useState<CardStripeFieldState>();
  const [expireState, setExpireState] = React.useState<CardStripeFieldState>();
  const [cvcState, setCvcState] = React.useState<CardStripeFieldState>();

  const handleCardFieldChange = React.useCallback(
    (field: CardFieldType, event: StripeElementChangeEvent) => {
      switch (field) {
        case 'no': {
          setNumberState({ empty: event.empty, complete: event.complete, error: event.error });
          break;
        }
        case 'exp': {
          setExpireState({ empty: event.empty, complete: event.complete, error: event.error });
          break;
        }
        case 'cvc': {
          setCvcState({ empty: event.empty, complete: event.complete, error: event.error });
          break;
        }
        default:
          throw new Error('unknown card field type of ' + field);
      }
    },
    []
  );

  const reset = React.useCallback(() => {
    if (!elements) {
      return;
    }
    elements.getElement(CardNumberElement)?.clear();
    elements.getElement(CardExpiryElement)?.clear();
    elements.getElement(CardCvcElement)?.clear();

    setNumberState(undefined);
    setExpireState(undefined);
    setCvcState(undefined);
  }, [elements]);

  return {
    formState: {
      cardNo: numberState,
      cardExp: expireState,
      cardCvc: cvcState,
    },
    empty: (numberState?.empty || expireState?.empty || cvcState?.empty) ?? true,
    complete: (numberState?.complete && expireState?.complete && cvcState?.complete) ?? false,
    handleCardFieldChange,
    reset,
  };
}

export interface IPartialCardStripeForm {
  cardNo: string;
  cardExp: string;
  cardCvc: string;
}

export default function PartialCardStripeForm({ form }: { form: UseCardStripeFormReturn }) {
  const t = useTranslations();
  const elements = useElements();
  const { formState, handleCardFieldChange } = form;

  const handleChange = React.useCallback(
    (field: CardFieldType) => {
      return (event: StripeElementChangeEvent) => {
        handleCardFieldChange(field, event);
      };
    },
    [handleCardFieldChange]
  );

  React.useEffect(() => {
    if (!elements) {
      return;
    }
    const handleCardNumberChange = handleChange('no');
    const handleCardExpireChange = handleChange('exp');
    const handleCardCvcChange = handleChange('cvc');
    elements.getElement(CardNumberElement)?.on('change', handleCardNumberChange);
    elements.getElement(CardExpiryElement)?.on('change', handleCardExpireChange);
    elements.getElement(CardCvcElement)?.on('change', handleCardCvcChange);
    return () => {
      elements.getElement(CardNumberElement)?.off('change', handleCardNumberChange);
      elements.getElement(CardExpiryElement)?.off('change', handleCardExpireChange);
      elements.getElement(CardCvcElement)?.off('change', handleCardCvcChange);
    };
  }, [elements, handleChange]);

  return (
    <>
      <div className="-mx-3 flex flex-wrap items-center">
        <Stripe className="mx-3 my-2 w-20" />
        <div className="mx-3 my-2 flex items-center">
          <Lock className="relative -top-0.5 w-4" />
          <p className="ml-4">
            <span className="body-3 text-lg text-[#7B8D97]">
              {t('all-transactions-are-secure-and-encrypted')}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <div className="-m-1.5 flex flex-wrap items-center">
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/visa.svg" alt="Master Card" width={42} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary bg-white">
              <Image src="/payments/mc.svg" alt="Master Card" width={42} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-[#286CB4] bg-[#286CB4]">
              <Image src="/payments/amex.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/union-pay.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/google-pay.svg" alt="Master Card" width={45} height={27} />
            </div>
          </div>
          <div className="p-1.5">
            <div className="rounded-[4px] border border-primary">
              <Image src="/payments/apple-pay.svg" alt="Master Card" width={45} height={28} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="-m-2 flex flex-wrap">
          <div className="w-full p-2">
            <StripeTextFieldNumber
              label={t('card-number')}
              error={!!formState.cardNo?.error}
              labelErrorMessage={formState.cardNo?.error?.message}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <StripeTextFieldExpiry
              label={t('expiration-date')}
              error={!!formState.cardExp?.error}
              labelErrorMessage={formState.cardExp?.error?.message}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <StripeTextFieldCVC
              label={t('cvc')}
              error={!!formState.cardCvc?.error}
              labelErrorMessage={formState.cardCvc?.error?.message}
              InputProps={{
                inputProps: {
                  options: {
                    placeholder: '',
                    style: {
                      base: {
                        fontSize: '16px',
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
