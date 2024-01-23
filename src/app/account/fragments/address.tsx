import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import { Route } from '../types';
import { useForm } from 'react-hook-form';
import React from 'react';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';
import AddressForm from '@/components/Form/Address';
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

export default function AddressFragment({ navigate }: FragmentProps<Route>) {
  const onDeliverySubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  const onBillingSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <div className="py-10">
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
            <UnderlineButton onClick={() => navigate(-1)} label="Go Back" />
          </div>
        </div>
      </Container>
    </div>
  );
}
