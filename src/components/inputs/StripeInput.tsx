import { InputBaseComponentProps } from '@mui/material/InputBase';
import { alpha, useTheme } from '@mui/material/styles';
import * as React from 'react';

const StripeInput = React.forwardRef<any, InputBaseComponentProps>(
  function StripeInput(props, ref) {
    const { component: Component, options, ...other } = props;
    const theme = useTheme();
    const [mountNode, setMountNode] = React.useState<any | null>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => mountNode.focus(),
      }),
      [mountNode]
    );

    return (
      <Component
        onReady={setMountNode}
        options={{
          ...options,
          style: {
            ...options.style,
            base: {
              ...options.style.base,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              '::placeholder': {
                color: alpha(theme.palette.text.primary, 0.42),
              },
            },
            invalid: {
              ...options.style.invalid,
              color: theme.palette.text.primary,
            },
          },
        }}
        {...other}
      />
    );
  }
);

export default StripeInput;
