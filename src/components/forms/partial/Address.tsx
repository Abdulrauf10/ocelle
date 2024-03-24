'use client';

import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, FieldPath } from 'react-hook-form';
import { useTranslations } from 'next-intl';

export type IPartialAddressForm = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  district: string;
  region: string;
  country: string;
};

type DistrictMap = {
  kowloon: (keyof IntlMessages)[];
  'new-territories': (keyof IntlMessages)[];
  'hong-kong-island': (keyof IntlMessages)[];
};

const districtMap: DistrictMap = {
  kowloon: ['kowloon-city', 'kwun-tong', 'sham-shui-po', 'wong-tai-sin', 'yau-tsim-mong'],
  'new-territories': [
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
  'hong-kong-island': ['central-and-western', 'eastern', 'southern', 'wan-chai'],
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
  const t = useTranslations();
  const id = React.useId();
  const [region, setRegion] = React.useState<keyof DistrictMap>();

  const getPath = React.useCallback(
    (key: string) => {
      return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
    },
    [prefix]
  );

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2">
        <Controller
          name={getPath('firstName')}
          control={control}
          rules={{ required: true }}
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
          rules={{ required: true }}
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
          name={getPath('address1')}
          control={control}
          rules={{ required: true }}
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
          name={getPath('address2')}
          control={control}
          rules={{ required: true }}
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
          rules={{ required: true }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled}>
              <InputLabel id={`${id}-district-label`}>{t('district')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-district-label`}
                label={t('district')}
                fullWidth
                error={!!error}
                value={value ?? ''}
              >
                {region &&
                  districtMap[region] &&
                  districtMap[region].map((district) => {
                    return (
                      <MenuItem key={district} value={district}>
                        {t(district)}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getPath('region')}
          control={control}
          rules={{ required: true }}
          render={({ field: { value, ...field }, fieldState: { error } }) => {
            setRegion(value);
            return (
              <FormControl fullWidth disabled={disabled}>
                <InputLabel id={`${id}-region-label`}>{t('region')}</InputLabel>
                <Select
                  {...field}
                  labelId={`${id}-region-label`}
                  label={t('region')}
                  fullWidth
                  error={!!error}
                  value={value ?? ''}
                >
                  <MenuItem value="kowloon">{t('kowloon')}</MenuItem>
                  <MenuItem value="new-territories">{t('new-territories')}</MenuItem>
                  <MenuItem value="hong-kong-island">{t('hong-kong-island')}</MenuItem>
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
          rules={{ required: true }}
          render={({ field: { value, ...field }, fieldState: { error } }) => (
            <FormControl fullWidth disabled={disabled}>
              <InputLabel id={`${id}-country-label`}>{t('country')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-country-label`}
                label={t('country')}
                fullWidth
                error={!!error}
                value={value ?? ''}
              >
                <MenuItem value="hong-kong">{t('hong-kong')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
