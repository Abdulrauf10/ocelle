'use client';

import { Autocomplete, TextField as MuiTextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormResetField,
  type UseFormWatch,
} from 'react-hook-form';

import { getDistricts } from '@/actions';
import alphabeticalFilterOption from '@/alphabeticalFilterOption';
import TextField from '@/components/controls/TextField';
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

interface PartialBillingAddressFormProps<T extends FieldValues> {
  control: Control<T, any>;
  prefix?: string;
  disabled?: boolean;
  watch: UseFormWatch<T>;
  resetField: UseFormResetField<T>;
}

export default function PartialBillingAddressForm<T extends FieldValues>({
  control,
  prefix,
  disabled,
  watch,
  resetField,
}: PartialBillingAddressFormProps<T>) {
  const locale = useLocale();
  const t = useTranslations();
  const countryOptions: Array<{ name: string; value: string }> = React.useMemo(() => {
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

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2 max-sm:w-full">
        <TextField
          name={getPath('firstName')}
          label={t('first-name')}
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <Controller
          defaultValue={defaultCountry}
          name={getPath('country')}
          control={control}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', { name: t('country').toLowerCase() }),
          }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={disabled}
                options={countryOptions}
                value={value}
                isOptionEqualToValue={(option, selected) => option.value === selected.value}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    {...field}
                    label={t('country')}
                    error={!!error}
                    helperText={error?.message && <span className="body-3">{error.message}</span>}
                  />
                )}
                onChange={(event, selectedValue) => {
                  selectedValue &&
                    onChange(Array.isArray(selectedValue) ? selectedValue[0] : selectedValue);
                  resetField(getPath('region'));
                  resetField(getPath('district'));
                  resetField(getPath('postalCode'));
                }}
                filterOptions={alphabeticalFilterOption}
              />
            );
          }}
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <Controller
          name={getPath('region')}
          control={control}
          rules={{
            required: disabled
              ? false
              : t('please-enter-your-{}', {
                  name:
                    country === CountryCode.Hk
                      ? t('region').toLowerCase()
                      : t('city').toLowerCase(),
                }),
          }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            if (country !== CountryCode.Hk) {
              return (
                <MuiTextField
                  {...field}
                  label={t('city')}
                  error={!!error}
                  helperText={error?.message && <span className="body-3">{error.message}</span>}
                  onChange={onChange}
                  value={value || ''}
                  disabled={disabled || isLoading}
                  fullWidth
                />
              );
            }
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={disabled || isLoading}
                options={['Hong Kong Island', 'Kowloon', 'New Territories']}
                value={value}
                getOptionLabel={(option) => t(option.toLowerCase().replace(/\s/g, '-') as any)}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    {...field}
                    label={t('region')}
                    error={!!error}
                    helperText={error?.message && <span className="body-3">{error.message}</span>}
                  />
                )}
                onChange={(event, selectedValue) =>
                  selectedValue &&
                  onChange(Array.isArray(selectedValue) ? selectedValue[0] : selectedValue)
                }
              />
            );
          }}
        />
      </div>
      <div className="w-1/3 p-2 max-lg:w-full">
        <Controller
          name={getPath('district')}
          control={control}
          rules={{
            required:
              disabled || country !== CountryCode.Hk
                ? false
                : t('please-enter-your-{}', {
                    name: t('district').toLowerCase(),
                  }),
          }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            if (country !== CountryCode.Hk) {
              return (
                <MuiTextField
                  {...field}
                  label={t('state')}
                  error={!!error}
                  helperText={error?.message && <span className="body-3">{error.message}</span>}
                  onChange={onChange}
                  value={value || ''}
                  disabled={disabled || isLoading}
                  fullWidth
                />
              );
            }
            const _districts = districtsQuery.data || [];
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={
                  disabled || isLoading || districtsQuery.isError || _districts.length === 0
                }
                options={_districts.map((district) => district.raw)}
                value={value}
                getOptionLabel={(option) =>
                  _districts.find((district) => district.raw === option)?.verbose || ''
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    {...field}
                    label={t('district')}
                    error={!!error}
                    helperText={error?.message && <span className="body-3">{error.message}</span>}
                    sx={theme => ({
                      "& .MuiInputBase-root.Mui-disabled": {
                        "& > fieldset": {
                          borderColor: theme.palette.error.main,
                        }
                      }
                    })}
                  />
                )}
                onChange={(event, selectedValue) =>
                  selectedValue &&
                  onChange(Array.isArray(selectedValue) ? selectedValue[0] : selectedValue)
                }
              />
            );
          }}
        />
      </div>
      {country !== CountryCode.Hk && (
        <div className="w-full p-2">
          <Controller
            name={getPath('postalCode')}
            control={control}
            rules={{
              required:
                disabled || country === CountryCode.Hk
                  ? false
                  : t('please-enter-your-{}', { name: t('postal-code') }),
            }}
            render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
              return (
                <MuiTextField
                  {...field}
                  label={t('postal-code')}
                  error={!!error}
                  helperText={error?.message && <span className="body-3">{error.message}</span>}
                  onChange={onChange}
                  value={value || ''}
                  disabled={disabled || isLoading}
                  fullWidth
                />
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
