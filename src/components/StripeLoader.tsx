'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

export default function StripeLoader({
  clientSecret,
  publishableKey,
  children,
}: React.PropsWithChildren<{ clientSecret: string; publishableKey: string }>) {
  const stripePromise = React.useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      {children}
    </Elements>
  );
}
