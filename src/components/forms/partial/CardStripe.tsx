'use client';

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
} from '@stripe/react-stripe-js';
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js';
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

interface CardStripeFieldState {
  empty: boolean;
  complete: boolean;
  error?: {
    type: 'validation_error';
    code: string;
    message: string;
  };
}

type ElementType = 'cardNumber' | 'cardExpiry' | 'cardCvc';

type ChangeEvent =
  | StripeCardNumberElementChangeEvent
  | StripeCardExpiryElementChangeEvent
  | StripeCardCvcElementChangeEvent;

interface UseCardStripeFormReturn {
  formState: {
    cardNo?: CardStripeFieldState;
    cardExp?: CardStripeFieldState;
    cardCvc?: CardStripeFieldState;
  };
  empty: boolean;
  complete: boolean;
  trigger(): void;
  handleChange(event: ChangeEvent): void;
  handleBlur(event: { elementType: ElementType }): void;
  reset(): void;
}

export function useCardStripeForm(): UseCardStripeFormReturn {
  const elements = useElements();
  const [numberState, setNumberState] = React.useState<CardStripeFieldState>();
  const [expireState, setExpireState] = React.useState<CardStripeFieldState>();
  const [cvcState, setCvcState] = React.useState<CardStripeFieldState>();

  const handleChange = React.useCallback((event: ChangeEvent) => {
    switch (event.elementType) {
      case 'cardNumber': {
        setNumberState({ empty: event.empty, complete: event.complete, error: event.error });
        break;
      }
      case 'cardExpiry': {
        setExpireState({ empty: event.empty, complete: event.complete, error: event.error });
        break;
      }
      case 'cardCvc': {
        setCvcState({ empty: event.empty, complete: event.complete, error: event.error });
        break;
      }
    }
  }, []);

  const handleBlur = React.useCallback(
    (event: { elementType: ElementType }) => {
      switch (event.elementType) {
        case 'cardNumber': {
          if (numberState === undefined) {
            setNumberState({ empty: true, complete: false });
          }
          break;
        }
        case 'cardExpiry': {
          if (expireState === undefined) {
            setExpireState({ empty: true, complete: false });
          }
          break;
        }
        case 'cardCvc': {
          if (cvcState === undefined) {
            setCvcState({ empty: true, complete: false });
          }
          break;
        }
        default:
          throw new Error('unknown card field type of ' + event.elementType);
      }
    },
    [numberState, expireState, cvcState]
  );

  const trigger = React.useCallback(() => {
    handleBlur({ elementType: 'cardNumber' });
    handleBlur({ elementType: 'cardExpiry' });
    handleBlur({ elementType: 'cardCvc' });
  }, [handleBlur]);

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
    trigger,
    handleChange,
    handleBlur,
    reset,
  };
}

export interface IPartialCardStripeForm {
  cardNo: string;
  cardExp: string;
  cardCvc: string;
}

export default function PartialCardStripeForm({
  form,
  disabled,
}: {
  form: UseCardStripeFormReturn;
  disabled?: boolean;
}) {
  const t = useTranslations();
  const elements = useElements();
  const { formState, handleChange, handleBlur } = form;

  React.useEffect(() => {
    if (!elements) {
      return;
    }
    elements.getElement(CardNumberElement)?.on('change', handleChange);
    elements.getElement(CardExpiryElement)?.on('change', handleChange);
    elements.getElement(CardCvcElement)?.on('change', handleChange);
    elements.getElement(CardNumberElement)?.on('blur', handleBlur);
    elements.getElement(CardExpiryElement)?.on('blur', handleBlur);
    elements.getElement(CardCvcElement)?.on('blur', handleBlur);
    return () => {
      elements.getElement(CardNumberElement)?.off('change', handleChange);
      elements.getElement(CardExpiryElement)?.off('change', handleChange);
      elements.getElement(CardCvcElement)?.off('change', handleChange);
      elements.getElement(CardNumberElement)?.off('blur', handleBlur);
      elements.getElement(CardExpiryElement)?.off('blur', handleBlur);
      elements.getElement(CardCvcElement)?.off('blur', handleBlur);
    };
  }, [elements, handleChange, handleBlur]);

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
              error={!!formState.cardNo?.empty || !!formState.cardNo?.error}
              labelErrorMessage={
                !!formState.cardNo?.empty
                  ? t('please-enter-your-{}', {
                      name: t('card-number').toLowerCase(),
                    })
                  : formState.cardNo?.error?.message
              }
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
              disabled={disabled}
            />
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <StripeTextFieldExpiry
              label={t('expiration-date')}
              error={!!formState.cardExp?.empty || !!formState.cardExp?.error}
              labelErrorMessage={
                !!formState.cardExp?.empty
                  ? t('please-enter-your-{}', {
                      name: t('expiration-date').toLowerCase(),
                    })
                  : formState.cardExp?.error?.message
              }
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
              disabled={disabled}
            />
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <StripeTextFieldCVC
              label={t('cvc')}
              error={!!formState.cardCvc?.empty || !!formState.cardCvc?.error}
              labelErrorMessage={
                !!formState.cardCvc?.empty
                  ? t('please-enter-your-{}', {
                      name: t('cvc').toLowerCase(),
                    })
                  : formState.cardCvc?.error?.message
              }
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
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </>
  );
}
