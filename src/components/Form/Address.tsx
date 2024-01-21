import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';

interface AddressFormProps {
  control: Control<FieldValues>;
  prefix?: string;
}

export default function AddressForm({ control, prefix }: AddressFormProps) {
  const id = React.useId();

  return (
    <div className="-m-2 flex flex-wrap">
      <div className="w-1/2 p-2">
        <Controller
          name={prefix ? `${prefix}.firstname` : 'firstname'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="First Name" fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-1/2 p-2">
        <Controller
          name={prefix ? `${prefix}.lastname` : 'lastname'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Last Name" fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={prefix ? `${prefix}.address1` : 'address1'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Address Line 1" fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-full p-2">
        <Controller
          name={prefix ? `${prefix}.address2` : 'address2'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Address Line 2" fullWidth error={!!error} />
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={prefix ? `${prefix}.district` : 'district'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-district-label`}>District</InputLabel>
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
          name={prefix ? `${prefix}.region` : 'region'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-region-label`}>Region</InputLabel>
              <Select
                {...field}
                labelId={`${id}-region-label`}
                label="Region"
                fullWidth
                error={!!error}
              >
                <MenuItem value="kl">Kowloon</MenuItem>
                <MenuItem value="nt">New Territories</MenuItem>
                <MenuItem value="hki">Hong Kong Island</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
      <div className="w-1/3 p-2">
        <Controller
          name={prefix ? `${prefix}.country` : 'country'}
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id={`${id}-country-label`}>Country</InputLabel>
              <Select
                {...field}
                labelId={`${id}-country-label`}
                label="Country"
                fullWidth
                error={!!error}
              >
                <MenuItem value="hk">Hong Kong</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
