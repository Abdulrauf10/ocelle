'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormWatch,
} from 'react-hook-form';

import TextField from '@/components/controls/TextField';

export type IPartialAddressForm = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
};

interface PartialAddressFormProps<T extends FieldValues> {
  control: Control<T, any>;
  prefix?: string;
  disabled?: boolean;
  watch: UseFormWatch<T>;
}

export default function PartialAddressForm<T extends FieldValues>({
  control,
  prefix,
  disabled,
  watch,
}: PartialAddressFormProps<T>) {
  const locale = useLocale();
  const t = useTranslations();
  const id = React.useId();

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
    queryFn: async () => {
      const districts = await fetch('/api/district', {
        headers: {
          'x-countryArea': region,
          'x-language': locale,
        },
      });
      return (await districts.json()) as { raw: string; verbose: string }[];
    },
  });

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2 max-sm:w-full">
        <TextField
          name={getPath('firstName')}
          label={t('first-name')}
          control={control}
          rules={{ required: !disabled }}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/2 p-2 max-sm:w-full">
        <TextField
          name={getPath('lastName')}
          label={t('last-name')}
          control={control}
          rules={{ required: !disabled }}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-full p-2">
        <TextField
          name={getPath('streetAddress1')}
          label={t('address-line-1')}
          control={control}
          rules={{ required: !disabled }}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-full p-2">
        <TextField
          name={getPath('streetAddress2')}
          label={t('address-line-2')}
          control={control}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/3 p-2 max-sm:w-full">
        <Controller
          name={getPath('region')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => {
            return (
              <FormControl fullWidth disabled={disabled || isLoading}>
                <InputLabel id={`${id}-region-label`}>{t('region')}</InputLabel>
                <Select
                  {...field}
                  labelId={`${id}-region-label`}
                  label={t('region')}
                  fullWidth
                  error={!!error}
                  value={value ?? ''}
                >
                  <MenuItem value="Hong Kong Island">{t('hong-kong-island')}</MenuItem>
                  <MenuItem value="Kowloon">{t('kowloon')}</MenuItem>
                  <MenuItem value="New Territories">{t('new-territories')}</MenuItem>
                </Select>
              </FormControl>
            );
          }}
        />
      </div>
      <div className="w-1/3 p-2 max-sm:w-full">
        <Controller
          name={getPath('district')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl
              fullWidth
              disabled={disabled || isLoading || isError || !districts || districts.length === 0}
            >
              <InputLabel id={`${id}-district-label`}>{t('district')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-district-label`}
                label={t('district')}
                fullWidth
                error={!!error}
                value={value ?? ''}
              >
                {(districts || []).map((district, idx) => (
                  <MenuItem key={idx} value={district.raw}>
                    {district.verbose}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2 max-sm:w-full">
        <Controller
          defaultValue={'HK' as PathValue<T, FieldPath<T>>}
          name={getPath('country')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled || isLoading}>
              <InputLabel id={`${id}-country-label`}>{t('country')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-country-label`}
                label={t('country')}
                fullWidth
                error={!!error}
                value={value ?? ''}
              >
                <MenuItem value="HK">{t('hong-kong')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
