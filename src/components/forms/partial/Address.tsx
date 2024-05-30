'use client';

import { Autocomplete, TextField as MuiTextField } from '@mui/material';
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

import { getDistricts } from '@/actions';
import TextField from '@/components/controls/TextField';

export type IPartialAddressForm = {
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  region: string;
  district: string;
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
    queryFn: async () => await getDistricts(locale, region),
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
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={disabled || isLoading}
                options={['Hong Kong Island', 'Kowloon', 'New Territories']}
                value={value}
                getOptionLabel={(option) => t(option.toLowerCase().replace(/\s/g, '-') as any)}
                renderInput={(params) => (
                  <MuiTextField {...params} {...field} label={t('region')} error={!!error} />
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
      <div className="w-1/3 p-2 max-sm:w-full">
        <Controller
          name={getPath('district')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            const _districts = districts || [];
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={disabled || isLoading || isError || !districts || districts.length === 0}
                options={_districts.map((district) => district.raw)}
                value={value}
                getOptionLabel={(option) =>
                  _districts.find((district) => district.raw === option)?.verbose || ''
                }
                renderInput={(params) => (
                  <MuiTextField {...params} {...field} label={t('district')} error={!!error} />
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
      <div className="w-1/3 p-2 max-sm:w-full">
        <Controller
          defaultValue={'HK' as PathValue<T, FieldPath<T>>}
          name={getPath('country')}
          control={control}
          rules={{ required: !disabled }}
          render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
            return (
              <Autocomplete
                fullWidth
                disableClearable
                disabled={disabled || isLoading}
                options={['HK']}
                value={value}
                getOptionLabel={(option) => countryMaps[option] ?? ''}
                renderInput={(params) => (
                  <MuiTextField {...params} {...field} label={t('country')} error={!!error} />
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
    </div>
  );
}
