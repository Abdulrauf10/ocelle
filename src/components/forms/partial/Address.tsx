'use client';

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  Controller,
  type Control,
  type FieldValues,
  type FieldPath,
  type UseFormWatch,
  type PathValue,
} from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
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
  const [pending, startTransition] = React.useTransition();
  const [districts, setDistricts] = React.useState<{ raw: string; verbose: string }[]>([]);

  const getPath = React.useCallback(
    (key: string) => {
      return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
    },
    [prefix]
  );

  const region = watch(getPath('region'));

  React.useEffect(() => {
    if (region !== undefined) {
      startTransition(async () => {
        const districts = await fetch('/api/district', {
          headers: {
            'x-countryArea': region,
            'x-language': locale,
          },
        });
        setDistricts(await districts.json());
      });
    }
  }, [region, locale]);

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2">
        <TextField
          name={getPath('firstName')}
          label={t('first-name')}
          control={control}
          rules={{ required: !disabled }}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/2 p-2">
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
          rules={{ required: !disabled }}
          disabled={disabled}
          fullWidth
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getPath('region')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => {
            return (
              <FormControl fullWidth disabled={disabled || pending}>
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
      <div className="w-1/3 p-2">
        <Controller
          name={getPath('district')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled || pending || districts.length === 0}>
              <InputLabel id={`${id}-district-label`}>{t('district')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-district-label`}
                label={t('district')}
                fullWidth
                error={!!error}
                value={value ?? ''}
              >
                {districts.map((district, idx) => (
                  <MenuItem key={idx} value={district.raw}>
                    {district.verbose}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          defaultValue={'HK' as PathValue<T, FieldPath<T>>}
          name={getPath('country')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled || pending}>
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
