'use client';

import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import PartialBillingAddressForm, { IPartialBillingAddressForm } from './partial/BillingAddress';

import { useEditAddress } from '@/contexts/editAddress';
import { CountryCode } from '@/gql/graphql';
import useDefaultValues from '@/hooks/defaultValues';
import countriesZH from '@/i18n-iso-countries/zh.json';

countries.registerLocale(countriesEN);
countries.registerLocale(countriesZH);

interface IBillingAddressForm extends IPartialBillingAddressForm {}

type IGuestCheckoutFormAction = Omit<IBillingAddressForm, 'country'> & { country: CountryCode };

export default function BillingAddressForm({
  firstName,
  lastName,
  streetAddress1,
  streetAddress2,
  district,
  region,
  country,
  postalCode,
  action,
}: {
  firstName?: string;
  lastName?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  district?: string;
  region?: string;
  country?: CountryCode;
  postalCode?: string;
  action(data: IGuestCheckoutFormAction): Promise<void>;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const { isDeliveryUsAsBillingAddress: disabled } = useEditAddress();
  const { defaultValues, setDefaultValues } = useDefaultValues({
    firstName,
    lastName,
    streetAddress1,
    streetAddress2: streetAddress2 ?? '',
    district,
    region,
    country: country
      ? {
          name: country === CountryCode.Hk ? t('hong-kong') : countries.getName(country, locale),
          value: country,
        }
      : undefined,
    postalCode,
  });
  const form = useForm<IBillingAddressForm>({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = form;
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    (values: IBillingAddressForm) => {
      startTransition(async () => {
        await action({
          ...values,
          country: values.country.value,
        });
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
    watch('country').value === defaultValues.country?.value &&
    watch('postalCode') === defaultValues.postalCode;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PartialBillingAddressForm disabled={disabled} />
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
    </FormProvider>
  );
}
