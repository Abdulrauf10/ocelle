'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';

import { useEditAddress } from '@/contexts/editAddress';
import useDefaultValues from '@/hooks/defaultValues';

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
  const { defaultValues, setDefaultValues } = useDefaultValues({
    firstName,
    lastName,
    streetAddress1,
    streetAddress2: streetAddress2 ?? '',
    district,
    region,
    country,
  });
  const { control, handleSubmit, reset, watch } = useForm<IBillingAddressForm>({ defaultValues });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    (values: IBillingAddressForm) => {
      startTransition(async () => {
        await action(values);
        setDefaultValues(values);
      });
    },
    [action, setDefaultValues]
  );

  const isSameAsDefaultValue =
    watch('firstName') === defaultValues.firstName &&
    watch('lastName') === defaultValues.lastName &&
    watch('streetAddress1') === defaultValues.streetAddress1 &&
    watch('streetAddress2') === defaultValues.streetAddress2 &&
    watch('district') === defaultValues.district &&
    watch('region') === defaultValues.region &&
    watch('country') === defaultValues.country;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PartialAddressForm control={control} watch={watch} disabled={disabled} />
      <div className="-mx-2 mt-10 flex">
        <div className="w-1/2 px-2">
          <Button
            fullWidth
            onClick={() => reset(defaultValues)}
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
