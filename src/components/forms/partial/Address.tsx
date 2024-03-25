'use client';

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, FieldPath } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';

export type IPartialAddressForm = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  district: string;
  region: string;
  country: string;
};

type DistrictMap = {
  Kowloon: (keyof IntlMessages)[];
  'New Territories': (keyof IntlMessages)[];
  'Hong Kong Island': (keyof IntlMessages)[];
};

const districtMap: DistrictMap = {
  Kowloon: ['kowloon-city', 'kwun-tong', 'sham-shui-po', 'wong-tai-sin', 'yau-tsim-mong'],
  'New Territories': [
    'islands',
    'kwai-tsing',
    'north',
    'sai-kung',
    'sha-tin',
    'tai-po',
    'tsuen-wan',
    'tuen-mun',
    'yuen-long',
  ],
  'Hong Kong Island': ['central-and-western', 'eastern', 'southern', 'wan-chai'],
};

interface PartialAddressFormProps<T extends FieldValues> {
  control: Control<T, any>;
  prefix?: string;
  disabled?: boolean;
}

export default function PartialAddressForm<T extends FieldValues>({
  control,
  prefix,
  disabled,
}: PartialAddressFormProps<T>) {
  const locale = useLocale();
  const t = useTranslations();
  const id = React.useId();
  const [pending, startTransition] = React.useTransition();
  const [districts, setDistricts] = React.useState<{ raw: string; verbose: string }[]>([]);
  const [region, setRegion] = React.useState<string>();

  const getPath = React.useCallback(
    (key: string) => {
      return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
    },
    [prefix]
  );

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
        <Controller
          name={getPath('firstName')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('first-name')}
              fullWidth
              error={!!error}
              disabled={disabled}
              value={value ?? ''}
            />
          )}
        />
      </div>
      <div className="w-1/2 p-2">
        <Controller
          name={getPath('lastName')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('last-name')}
              fullWidth
              error={!!error}
              disabled={disabled}
              value={value ?? ''}
            />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={getPath('streetAddress1')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('address-line-1')}
              fullWidth
              error={!!error}
              disabled={disabled}
              value={value ?? ''}
            />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={getPath('streetAddress2')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('address-line-2')}
              fullWidth
              error={!!error}
              disabled={disabled}
              value={value ?? ''}
            />
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getPath('district')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled || pending}>
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
          name={getPath('region')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, ...field }, fieldState: { error } }) => {
            setRegion(value);
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
                  <MenuItem value="Kowloon">{t('kowloon')}</MenuItem>
                  <MenuItem value="New Territories">{t('new-territories')}</MenuItem>
                  <MenuItem value="Hong Kong Island">{t('hong-kong-island')}</MenuItem>
                </Select>
              </FormControl>
            );
          }}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
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
