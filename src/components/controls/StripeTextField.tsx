import React from 'react';
import {
  AuBankAccountElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  FpxBankElement,
  IbanElement,
  IdealBankElement,
} from '@stripe/react-stripe-js';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import StripeInput from '../inputs/StripeInput';
import { StripeElementChangeEvent } from '@stripe/stripe-js';

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
          ...inputProps,
          ...InputProps.inputProps,
          component: stripeElement,
          onChange: ({ empty }: StripeElementChangeEvent) => setEmpty(empty),
          onFocus: () => setNotched(true),
          onBlur: () => setNotched(false),
        },
        inputComponent: StripeInput,
      }}
      helperText={error ? labelErrorMessage : helperText}
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
