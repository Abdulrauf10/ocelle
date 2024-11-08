import TextField, { TextFieldProps } from '@mui/material/TextField';
import {
  AuBankAccountElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  FpxBankElement,
  IbanElement,
  IdealBankElement,
} from '@stripe/react-stripe-js';
import { StripeElementChangeEvent } from '@stripe/stripe-js';
import React from 'react';

import StripeInput from '../inputs/StripeInput';

type StripeElement =
  | typeof AuBankAccountElement
  | typeof CardCvcElement
  | typeof CardExpiryElement
  | typeof CardNumberElement
  | typeof FpxBankElement
  | typeof IbanElement
  | typeof IdealBankElement;

interface StripeTextFieldProps<T extends StripeElement>
  extends Omit<TextFieldProps, 'onChange' | 'inputComponent' | 'inputProps'> {
  inputProps?: React.ComponentProps<T>;
  labelErrorMessage?: string;
  stripeElement?: T;
}

export const StripeTextField = <T extends StripeElement>(props: StripeTextFieldProps<T>) => {
  const {
    helperText,
    InputLabelProps,
    InputProps = {},
    inputProps,
    error,
    labelErrorMessage,
    stripeElement,
    ...other
  } = props;
  const [empty, setEmpty] = React.useState(true);
  const [notched, setNotched] = React.useState(false);

  const baseInputProps = {
    ...inputProps,
    ...InputProps.inputProps,
  };

  return (
    <TextField
      fullWidth
      InputLabelProps={{
        ...InputLabelProps,
        shrink: !empty || notched,
      }}
      error={error}
      InputProps={{
        ...InputProps,
        notched: !empty || notched,
        inputProps: {
          ...baseInputProps,
          component: stripeElement,
          onChange: ({ empty }: StripeElementChangeEvent) => setEmpty(empty),
          onFocus: () => setNotched(true),
          onBlur: () => setNotched(false),
          options: {
            ...baseInputProps.options,
            disabled: other.disabled,
          },
        },
        inputComponent: StripeInput,
      }}
      helperText={
        (error || helperText) && (
          <span className="body-3">{error ? labelErrorMessage : helperText}</span>
        )
      }
      {...(other as any)}
    />
  );
};

export function StripeTextFieldNumber(props: StripeTextFieldProps<typeof CardNumberElement>) {
  return <StripeTextField stripeElement={CardNumberElement} {...props} />;
}

export function StripeTextFieldExpiry(props: StripeTextFieldProps<typeof CardExpiryElement>) {
  return <StripeTextField stripeElement={CardExpiryElement} {...props} />;
}

export function StripeTextFieldCVC(props: StripeTextFieldProps<typeof CardCvcElement>) {
  return <StripeTextField stripeElement={CardCvcElement} {...props} />;
}
