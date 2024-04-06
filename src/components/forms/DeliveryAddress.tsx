'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import Button from '../buttons/Button';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';
import RoundedCheckbox from '../controls/RoundedCheckbox';
import { useEditAddress } from '@/contexts/editAddress';

interface IDeliveryAddressForm extends IPartialAddressForm {
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
  country?: string;
  isSameAsBillingAddress?: boolean;
  action(data: IDeliveryAddressForm): Promise<void>;
}) {
  const t = useTranslations();
  const { setIsDeliveryUsAsBillingAddress } = useEditAddress();
  const defaultValuesRef = React.useRef<{
    firstName?: string;
    lastName?: string;
    streetAddress1?: string;
    streetAddress2?: string;
    district?: string;
    region?: string;
    country?: string;
    isSameAsBillingAddress?: boolean;
  }>({
    firstName,
    lastName,
    streetAddress1,
    streetAddress2,
    district,
    region,
    country,
    isSameAsBillingAddress,
  });
  const { control, handleSubmit, reset, watch } = useForm<IDeliveryAddressForm>({
    defaultValues: {
      firstName,
      lastName,
      streetAddress1,
      streetAddress2,
      district,
      region,
      country,
      isSameAsBillingAddress,
    },
  });
  const [pending, startTransition] = useTransition();
  const currentIsSameAsBillingAddress = watch('isSameAsBillingAddress');

  const onSubmit = React.useCallback(
    (values: IDeliveryAddressForm) => {
      startTransition(() => {
        action(values);
        defaultValuesRef.current = values;
      });
    },
    [action]
  );

  React.useEffect(() => {
    setIsDeliveryUsAsBillingAddress(currentIsSameAsBillingAddress);
  }, [currentIsSameAsBillingAddress, setIsDeliveryUsAsBillingAddress]);

  const isSameAsDefaultValue =
    watch('firstName') === defaultValuesRef.current.firstName &&
    watch('lastName') === defaultValuesRef.current.lastName &&
    watch('streetAddress1') === defaultValuesRef.current.streetAddress1 &&
    watch('streetAddress2') === defaultValuesRef.current.streetAddress2 &&
    watch('district') === defaultValuesRef.current.district &&
    watch('region') === defaultValuesRef.current.region &&
    watch('country') === defaultValuesRef.current.country &&
    watch('isSameAsBillingAddress') === defaultValuesRef.current.isSameAsBillingAddress;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PartialAddressForm control={control} watch={watch} />
      <div className="mt-4">
        <RoundedCheckbox
          name="isSameAsBillingAddress"
          control={control}
          label={t('use-as-{}', { name: t('billing-address') })}
        />
      </div>
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
