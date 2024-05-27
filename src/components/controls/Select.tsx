'use client';

import { FormControl, InputLabel, Select as MuiSelect } from '@mui/material';
import React from 'react';
import { Controller, type FieldValues } from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface SelectProps<T extends FieldValues> extends InputControllerProps<T> {
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'standard' | 'outlined' | 'filled';
  disableUnderline?: boolean;
}

export default function Select<T extends FieldValues>({
  name,
  label,
  rules,
  control,
  disabled,
  fullWidth,
  variant,
  disableUnderline,
  children,
}: SelectProps<T>) {
  const id = React.useId();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      disabled={disabled}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <FormControl fullWidth={fullWidth} disabled={disabled}>
          {label && <InputLabel id={`${id}-select`}>{label}</InputLabel>}
          <MuiSelect
            {...field}
            labelId={`${id}-select`}
            label={label}
            value={value ?? ''}
            fullWidth={fullWidth}
            error={!!error && value && (value as string).length !== 0}
            variant={variant}
            disableUnderline={disableUnderline}
          >
            {children}
          </MuiSelect>
        </FormControl>
      )}
    />
  );
}
