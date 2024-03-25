'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React from 'react';
import Button from '../Button';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';

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
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
  action(data: IBillingAddressForm): Promise<void>;
}) {
  const t = useTranslations();
  const ref = React.useRef<HTMLFormElement | null>(null);
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
      });
    },
    [action]
  );

  const isSameAsDefaultValue =
    watch('firstName') === firstName &&
    watch('lastName') === lastName &&
    watch('streetAddress1') === streetAddress1 &&
    watch('streetAddress2') === streetAddress2 &&
    watch('district') === district &&
    watch('region') === region &&
    watch('country') === country;

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <PartialAddressForm control={control} />
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
            disabled={isSameAsDefaultValue}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className="w-1/2 px-2">
          <Button fullWidth disabled={pending || isSameAsDefaultValue}>
            {t('save-changes')}
          </Button>
        </div>
      </div>
    </form>
  );
}
