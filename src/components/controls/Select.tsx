'use client';

import {
  FormControl,
  InputBaseComponentProps,
  InputLabel,
  Select as MuiSelect,
  SxProps,
  Theme,
} from '@mui/material';
import React from 'react';
import { Controller, type FieldValues, useFormContext } from 'react-hook-form';

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
  sx?: SxProps<Theme>;
  disableOverlap?: boolean;
}

export default function Select<T extends FieldValues>({
  name,
  label,
  rules,
  disabled,
  fullWidth,
  variant,
  disableUnderline,
  children,
  inputProps,
  IconComponent,
  className,
  onChange: parentOnChange,
  sx,
  disableOverlap,
}: SelectProps<T>) {
  const { control } = useFormContext<T>();
  const id = React.useId();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

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
            sx={sx}
            onChange={(e) => {
              onChange(e);
              if (parentOnChange && typeof parentOnChange === 'function') {
                parentOnChange();
              }
            }}
            MenuProps={disableOverlap ? MenuProps : undefined}
          >
            {children}
          </MuiSelect>
        </FormControl>
      )}
    />
  );
}
