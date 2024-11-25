'use client';

import { useQuery } from '@tanstack/react-query';
import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { type FieldPath, type FieldValues, type PathValue, useFormContext } from 'react-hook-form';

import { getDistricts } from '@/actions';
import alphabeticalFilterOption from '@/alphabeticalFilterOption';
import OcelleAutocomplete from '@/components/controls/OcelleAutocomplete';
import OcelleTextField from '@/components/controls/OcelleTextField';
import { CountryCode } from '@/gql/graphql';
import countriesZH from '@/i18n-iso-countries/zh.json';

countries.registerLocale(countriesEN);
countries.registerLocale(countriesZH);

export type IPartialBillingAddressForm = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  region: string;
  district: string;
  country: {
    name: string;
    value: CountryCode;
  };
  postalCode: string | undefined;
};

interface PartialBillingAddressFormProps {
  prefix?: string;
  disabled?: boolean;
}

export default function PartialBillingAddressForm<T extends FieldValues>({
  prefix,
  disabled,
}: PartialBillingAddressFormProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { watch, resetField } = useFormContext<T>();
  const countryOptions: PathValue<IPartialBillingAddressForm, 'country'>[] = React.useMemo(() => {
    return Object.values(CountryCode)
      .map((code) => {
        return {
          name: code === CountryCode.Hk ? t('hong-kong') : countries.getName(code, locale) || code,
          value: code,
        };
      })
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
  }, [t, locale]);

  const getPath = React.useCallback(
    (key: string) => {
      return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
    },
    [prefix]
  );

  const defaultCountry = countryOptions.find(
    (option) => option.value === CountryCode.Hk
  ) as PathValue<T, FieldPath<T>>;

  const { value: country } = watch(getPath('country'), defaultCountry);

  const region = watch(getPath('region'));

  const districtsQuery = useQuery({
    enabled: region !== undefined && country === CountryCode.Hk,
    queryKey: ['districts', region, locale],
    queryFn: async () => await getDistricts(locale, CountryCode.Hk, region),
  });

  const isLoading = districtsQuery.isLoading;

  const districts = districtsQuery.data || [];

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2 max-sm:w-full">
        <OcelleTextField
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
        <OcelleTextField
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
        <OcelleTextField
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
        <OcelleTextField
          name={getPath('streetAddress2')}
          label={t('address-line-2-optional')}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <OcelleAutocomplete
          label={t('country')}
          defaultValue={defaultCountry}
          name={getPath('country')}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('country').toLowerCase() }),
          }}
          fullWidth
          disableClearable
          disabled={disabled}
          options={countryOptions as PathValue<T, FieldPath<T>>}
          isOptionEqualToValue={(option, selected) => option.value === selected.value}
          getOptionLabel={(option: any) => option.name}
          onChange={() => {
            resetField(getPath('region'), { defaultValue: '' as PathValue<T, FieldPath<T>> });
            resetField(getPath('district'), { defaultValue: '' as PathValue<T, FieldPath<T>> });
            resetField(getPath('postalCode'), { defaultValue: '' as PathValue<T, FieldPath<T>> });
          }}
          filterOptions={alphabeticalFilterOption}
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        {country === CountryCode.Hk ? (
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
            options={
              ['Hong Kong Island', 'Kowloon', 'New Territories'] as PathValue<T, FieldPath<T>>
            }
            getOptionLabel={(option: string) => t(option.toLowerCase().replace(/\s/g, '-') as any)}
          />
        ) : (
          <OcelleTextField
            name={getPath('region')}
            label={t('city')}
            rules={{
              required: disabled
                ? false
                : t('please-enter-your-{}', { name: t('city').toLowerCase() }),
            }}
            disabled={disabled || isLoading}
            fullWidth
            errorOnEmpty
          />
        )}
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        {country === CountryCode.Hk ? (
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
            disabled={disabled || isLoading || districtsQuery.isError || districts.length === 0}
            options={districts.map((district) => district.raw) as PathValue<T, FieldPath<T>>}
            getOptionLabel={(option) =>
              districts.find((district) => district.raw === option)?.verbose || ''
            }
          />
        ) : (
          <OcelleTextField
            name={getPath('district')}
            label={t('state')}
            rules={{
              required: false,
            }}
            disabled={disabled || isLoading}
            fullWidth
            errorOnEmpty
          />
        )}
      </div>
      {country !== CountryCode.Hk && (
        <div className="w-full p-2">
          <OcelleTextField
            name={getPath('postalCode')}
            label={t('postal-code')}
            rules={{
              required:
                disabled || country === CountryCode.Hk
                  ? false
                  : t('please-enter-your-{}', { name: t('postal-code') }),
            }}
            disabled={disabled || isLoading}
            fullWidth
            errorOnEmpty
          />
        </div>
      )}
    </div>
  );
}
