'use client';

import { IconButton, InputAdornment } from '@mui/material';
import React from 'react';
import { type FieldValues } from 'react-hook-form';

import Visibility from '../icons/Visibility';
import VisibilityOff from '../icons/VisibilityOff';
import TextField from './TextField';

import { InputControllerProps } from '@/types';

interface PasswordFieldProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function PasswordField<T extends FieldValues>({
  name,
  rules,
  control,
  label,
  fullWidth,
  disabled,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      name={name}
      rules={rules}
      control={control}
      label={label}
      fullWidth={fullWidth}
      type={showPassword ? 'text' : 'password'}
      disabled={disabled}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className="-mr-2"
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? (
                <VisibilityOff className="h-6 w-6 text-[#231815]" />
              ) : (
                <Visibility className="h-6 w-6 text-[#231815]" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
