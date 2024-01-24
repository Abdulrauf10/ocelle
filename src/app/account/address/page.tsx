'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { ThemeProvider } from '@mui/material';
import Button from '@/components/Button';
import theme from '@/app/mui-theme';
import AddressForm from '@/components/forms/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';

interface AddressBlockProps {
  isDeliveryAddress?: boolean;
  onSubmit(values: unknown): void;
}

function AddressBlock({ isDeliveryAddress, onSubmit }: AddressBlockProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AddressForm control={control} />
      {isDeliveryAddress && (
        <div className="mt-4">
          <RoundedCheckbox
            name="isSameBillingAddress"
            value={1}
            control={control}
            label="Use as Billing Address"
          />
        </div>
      )}
      <div className="-mx-2 mt-10 flex">
        <div className="w-1/2 px-2">
          <Button fullWidth onClick={reset} reverse>
            Cancel
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth>Save Changes</Button>
        </div>
      </div>
    </form>
  );
}

export default function Addresses() {
  const router = useRouter();

  const onDeliverySubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  const onBillingSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[520px]">
            <H2 inline className="text-center text-primary">
              Delivery Address
            </H2>
            <p className="mt-4 text-center">
              Delivery address changes will be in effect, starting with your [next] order, scheduled
              for the <strong>[29th of December 2023]</strong>.
            </p>
            <div className="py-4"></div>
            <AddressBlock isDeliveryAddress onSubmit={onDeliverySubmit} />
            <div className="py-12"></div>
            <H2 inline className="text-center text-primary">
              Billing Address
            </H2>
            <div className="py-4"></div>
            <AddressBlock onSubmit={onBillingSubmit} />
            <div className="mt-12 text-center">
              <UnderlineButton onClick={() => router.back()} label="Go Back" />
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
