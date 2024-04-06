'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React from 'react';
import Button from '../buttons/Button';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';
import { useEditAddress } from '@/contexts/editAddress';

interface IBillingAddressForm extends IPartialAddressForm {}

export default function BillingAddressForm({
  firstName,
  lastName,
  streetAddress1,
  streetAddress2,
  district,
  region,
  country,
  action,
}: {
  firstName?: string;
  lastName?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  district?: string;
  region?: string;
  country?: string;
  action(data: IBillingAddressForm): Promise<void>;
}) {
  const t = useTranslations();
  const { isDeliveryUsAsBillingAddress: disabled } = useEditAddress();
  const defaultValuesRef = React.useRef<{
    firstName?: string;
    lastName?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    district?: string;
    region?: string;
    country?: string;
  }>({
    firstName,
    lastName,
    streetAddress1,
    streetAddress2,
    district,
    region,
    country,
  });
  const { control, handleSubmit, reset, watch } = useForm<IBillingAddressForm>({
    defaultValues: {
      firstName,
      lastName,
      streetAddress1,
      streetAddress2,
      district,
      region,
      country,
    },
  });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    (values: IBillingAddressForm) => {
      startTransition(() => {
        action(values);
        defaultValuesRef.current = values;
      });
    },
    [action]
  );

  const isSameAsDefaultValue =
    watch('firstName') === defaultValuesRef.current.firstName &&
    watch('lastName') === defaultValuesRef.current.lastName &&
    watch('streetAddress1') === defaultValuesRef.current.streetAddress1 &&
    watch('streetAddress2') === defaultValuesRef.current.streetAddress2 &&
    watch('district') === defaultValuesRef.current.district &&
    watch('region') === defaultValuesRef.current.region &&
    watch('country') === defaultValuesRef.current.country;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PartialAddressForm control={control} watch={watch} disabled={disabled} />
      <div className="-mx-2 mt-10 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            onClick={() =>
              reset({
                firstName,
                lastName,
                streetAddress1,
                streetAddress2,
                district,
                region,
                country,
              })
            }
            reverse
            disabled={isSameAsDefaultValue || disabled}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={pending || isSameAsDefaultValue || disabled}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
