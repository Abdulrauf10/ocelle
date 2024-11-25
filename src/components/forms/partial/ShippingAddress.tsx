'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { type FieldPath, type FieldValues, type PathValue, useFormContext } from 'react-hook-form';

import { getDistricts } from '@/actions';
import alphabeticalFilterOption from '@/alphabeticalFilterOption';
import OcelleAutocomplete from '@/components/controls/OcelleAutocomplete';
import TextField from '@/components/controls/TextField';
import { CountryCode } from '@/gql/graphql';

export type IPartialShippingAddressForm = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  region: string;
  district: string;
  country: CountryCode;
};

interface PartialShippingAddressFormProps {
  prefix?: string;
  disabled?: boolean;
}

export default function PartialShippingAddressForm<T extends FieldValues>({
  prefix,
  disabled,
}: PartialShippingAddressFormProps) {
  const locale = useLocale();
  const t = useTranslations();
  const id = React.useId();
  const { control, watch } = useFormContext<T>();
  const countryMaps: { [key: string]: string } = React.useMemo(() => {
    return {
      HK: t('hong-kong'),
    };
  }, [t]);

  const getPath = React.useCallback(
    (key: string) => {
      return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
    },
    [prefix]
  );

  const region = watch(getPath('region'));

  const {
    data: districts,
    isLoading,
    isError,
  } = useQuery({
    enabled: region !== undefined,
    queryKey: ['districts', region, locale],
    queryFn: async () => await getDistricts(locale, CountryCode.Hk, region),
  });

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2 max-sm:w-full">
        <TextField
          name={getPath('firstName')}
          label={t('first-name')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('first-name').toLowerCase() }),
          }}
          disabled={disabled}
          errorOnEmpty
          fullWidth
        />
      </div>
      <div className="w-1/2 p-2 max-sm:w-full">
        <TextField
          name={getPath('lastName')}
          label={t('last-name')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('last-name').toLowerCase() }),
          }}
          disabled={disabled}
          errorOnEmpty
          fullWidth
        />
      </div>
      <div className="w-full p-2">
        <TextField
          name={getPath('streetAddress1')}
          label={t('address-line-1')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('address').toLowerCase() }),
          }}
          disabled={disabled}
          errorOnEmpty
          fullWidth
        />
      </div>
      <div className="w-full p-2">
        <TextField
          name={getPath('streetAddress2')}
          label={t('address-line-2-optional')}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <OcelleAutocomplete
          label={t('country')}
          defaultValue={CountryCode.Hk as PathValue<T, FieldPath<T>>}
          name={getPath('country')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('country').toLowerCase() }),
          }}
          fullWidth
          disableClearable
          disabled={disabled || isLoading}
          options={['HK'] as PathValue<T, FieldPath<T>>}
          getOptionLabel={(option) => countryMaps[option] ?? ''}
          filterOptions={alphabeticalFilterOption}
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <OcelleAutocomplete
          label={t('region')}
          name={getPath('region')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('region').toLowerCase() }),
          }}
          fullWidth
          disableClearable
          disabled={disabled || isLoading}
          options={['Hong Kong Island', 'Kowloon', 'New Territories'] as PathValue<T, FieldPath<T>>}
          getOptionLabel={(option: string) => t(option.toLowerCase().replace(/\s/g, '-') as any)}
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <OcelleAutocomplete
          label={t('district')}
          name={getPath('district')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('district').toLowerCase() }),
          }}
          fullWidth
          disableClearable
          disabled={disabled || isLoading || isError || !districts || districts.length === 0}
          options={(districts || []).map((district) => district.raw) as PathValue<T, FieldPath<T>>}
          getOptionLabel={(option) =>
            (districts || []).find((district) => district.raw === option)?.verbose || ''
          }
        />
      </div>
    </div>
  );
}
