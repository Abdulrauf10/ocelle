import {
  FilledInputProps,
  FormHelperTextProps,
  InputBaseComponentProps,
  InputLabelProps,
  InputProps,
  TextField as MuiTextField,
  OutlinedInputProps,
  SxProps,
  Theme,
} from '@mui/material';
import { Controller, type FieldValues } from 'react-hook-form';
import MaskedInput, { type Mask } from 'react-text-mask';

import { InputControllerProps } from '@/types';

interface TextFieldProps<T extends FieldValues> extends InputControllerProps<T> {
  id?: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  label?: string;
  className?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  inputProps?: InputBaseComponentProps;
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>;
  fullWidth?: boolean;
  InputLabelProps?: Partial<InputLabelProps>;
  sx?: SxProps<Theme>;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  disabled?: boolean;
  mask?: {
    pattern: Mask | ((value: string) => Mask);
    char?: string;
    guide?: boolean;
  };
}

export default function TextField<T extends FieldValues>({
  id,
  name,
  placeholder,
  helperText,
  className,
  rules,
  control,
  label,
  type,
  disabled,
  fullWidth,
  inputProps,
  InputProps,
  InputLabelProps,
  FormHelperTextProps,
  sx,
  mask,
}: TextFieldProps<T>) {
  if (mask?.pattern == null || (Array.isArray(mask.pattern) && mask.pattern.length === 0)) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        disabled={disabled}
        render={({ field: { value, ...field }, fieldState: { error } }) => (
          <MuiTextField
            {...field}
            id={id}
            placeholder={placeholder}
            type={type}
            value={value ?? ''}
            label={label}
            fullWidth={fullWidth}
            error={!!error && value && (value as string).length !== 0}
            sx={sx}
            FormHelperTextProps={FormHelperTextProps}
            InputLabelProps={InputLabelProps}
            inputProps={inputProps}
            InputProps={InputProps}
            className={className}
            helperText={error?.message || helperText}
          />
        )}
      />
    );
  }

  function MaskInput(props: any) {
    return (
      <MaskedInput
        {...props}
        mask={mask!.pattern}
        guide={mask!.guide}
        placeholderChar={mask!.char}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          type={type}
          label={label}
          fullWidth={fullWidth}
          error={!!error}
          inputProps={inputProps}
          helperText={helperText}
          InputProps={{
            ...InputProps,
            inputComponent: MaskInput,
          }}
        />
      )}
    />
  );
}
