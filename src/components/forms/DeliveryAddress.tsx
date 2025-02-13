'use client';

import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import RoundedCheckbox from '../controls/RoundedCheckbox';
import PartialShippingAddressForm, { IPartialShippingAddressForm } from './partial/ShippingAddress';

import { useEditAddress } from '@/contexts/editAddress';
import { CountryCode } from '@/gql/graphql';
import useDefaultValues from '@/hooks/defaultValues';

interface IDeliveryAddressForm extends IPartialShippingAddressForm {
  isSameAsBillingAddress: boolean;
}

export default function DeliveryAddressForm({
  firstName,
  lastName,
  streetAddress1,
  streetAddress2,
  district,
  region,
  country,
  isSameAsBillingAddress,
  action,
}: {
  firstName?: string;
  lastName?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  district?: string;
  region?: string;
  country?: CountryCode;
  isSameAsBillingAddress?: boolean;
  action(data: IDeliveryAddressForm): Promise<void>;
}) {
  const t = useTranslations();
  const { setIsDeliveryUsAsBillingAddress } = useEditAddress();
  const { defaultValues, setDefaultValues } = useDefaultValues({
    firstName,
    lastName,
    streetAddress1,
    streetAddress2: streetAddress2 ?? '',
    district,
    region,
    country,
    isSameAsBillingAddress,
  });
  const form = useForm<IDeliveryAddressForm>({ defaultValues });
  const { handleSubmit, reset, watch } = form;
  const [pending, startTransition] = useTransition();
  const currentIsSameAsBillingAddress = watch('isSameAsBillingAddress');

  const onSubmit = React.useCallback(
    (values: IDeliveryAddressForm) => {
      startTransition(async () => {
        await action(values);
        setDefaultValues(values);
      });
    },
    [action, setDefaultValues]
  );

  React.useEffect(() => {
    setIsDeliveryUsAsBillingAddress(currentIsSameAsBillingAddress);
  }, [currentIsSameAsBillingAddress, setIsDeliveryUsAsBillingAddress]);

  const isSameAsDefaultValue =
    watch('firstName') === defaultValues.firstName &&
    watch('lastName') === defaultValues.lastName &&
    watch('streetAddress1') === defaultValues.streetAddress1 &&
    watch('streetAddress2') === defaultValues.streetAddress2 &&
    watch('district') === defaultValues.district &&
    watch('region') === defaultValues.region &&
    watch('country') === defaultValues.country &&
    watch('isSameAsBillingAddress') === defaultValues.isSameAsBillingAddress;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PartialShippingAddressForm />
        <div className="mt-4">
          <RoundedCheckbox
            name="isSameAsBillingAddress"
            label={t('use-as-{}', { name: t('billing-address') })}
          />
        </div>
        <div className="-mx-2 mt-10 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => reset(defaultValues)}
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
    </FormProvider>
  );
}
