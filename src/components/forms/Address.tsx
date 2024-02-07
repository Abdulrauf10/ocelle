import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, type Control, type FieldValues, FieldPath } from 'react-hook-form';
import { useTranslations } from 'next-intl';

export type IAddressForm = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  district: string;
  region: string;
  country: string;
};

interface AddressFormProps<T extends FieldValues> {
  control: Control<T, any>;
  prefix?: string;
}

export default function AddressForm<T extends FieldValues>({
  control,
  prefix,
}: AddressFormProps<T>) {
  const t = useTranslations();
  const id = React.useId();

  const getKey = (key: string) => {
    return (prefix ? `${prefix}.${key}` : key) as FieldPath<T>;
  };

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2">
        <Controller
          name={getKey('firstName')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label={t('first-name')} fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-1/2 p-2">
        <Controller
          name={getKey('lastName')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label={t('last-name')} fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={getKey('address1')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label={t('address-line-1')} fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={getKey('address2')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label={t('address-line-2')} fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getKey('district')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-district-label`}>{t('district')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-district-label`}
                label="District"
                fullWidth
                error={!!error}
              >
                <MenuItem value="11">Testing</MenuItem>
                <MenuItem value="12">Testing</MenuItem>
                <MenuItem value="13">Testing</MenuItem>
                <MenuItem value="14">Testing</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getKey('region')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-region-label`}>{t('region')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-region-label`}
                label="Region"
                fullWidth
                error={!!error}
              >
                <MenuItem value="kl">{t('kowloon')}</MenuItem>
                <MenuItem value="nt">{t('new-territories')}</MenuItem>
                <MenuItem value="hki">{t('hong-kong-island')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={getKey('country')}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-country-label`}>{t('country')}</InputLabel>
              <Select
                {...field}
                labelId={`${id}-country-label`}
                label="Country"
                fullWidth
                error={!!error}
              >
                <MenuItem value="hk">{t('hong-kong')}</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
