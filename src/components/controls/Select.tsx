'use client';

import {
  FormControl,
  InputBaseComponentProps,
  InputLabel,
  Select as MuiSelect,
} from '@mui/material';
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
  inputProps?: InputBaseComponentProps;
  IconComponent?: React.ElementType;
  className?: string;
  onChange?: () => void;
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
  inputProps,
  IconComponent,
  className,
  onChange: parentOnChange,
}: SelectProps<T>) {
  const id = React.useId();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      disabled={disabled}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <FormControl
          fullWidth={fullWidth}
          error={!!error && value && (value as string).length !== 0}
          disabled={disabled}
          variant={variant}
        >
          {label && <InputLabel id={`${id}-select`}>{label}</InputLabel>}
          <MuiSelect
            {...field}
            labelId={`${id}-select`}
            label={label}
            value={value ?? ''}
            fullWidth={fullWidth}
            disableUnderline={disableUnderline}
            inputProps={inputProps}
            IconComponent={IconComponent}
            className={className}
            onChange={(e) => {
              onChange(e);
              if (parentOnChange && typeof parentOnChange === 'function') {
                parentOnChange();
              }
            }}
          >
            {children}
          </MuiSelect>
        </FormControl>
      )}
    />
  );
}
