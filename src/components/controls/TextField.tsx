import { InputControllerProps } from '@/types';
import {
  FilledInputProps,
  InputBaseComponentProps,
  InputLabelProps,
  InputProps,
  TextField as MuiTextField,
  OutlinedInputProps,
  SxProps,
  Theme,
} from '@mui/material';
import MaskedInput, { type Mask } from 'react-text-mask';
import { Controller, type FieldValues } from 'react-hook-form';

interface TextFieldProps<T extends FieldValues> extends InputControllerProps<T> {
  type?: React.InputHTMLAttributes<unknown>['type'];
  label?: string;
  className?: string;
  inputProps?: InputBaseComponentProps;
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>;
  fullWidth?: boolean;
  InputLabelProps?: Partial<InputLabelProps>;
  sx?: SxProps<Theme>;
  mask?: {
    pattern: Mask | ((value: string) => Mask);
    char?: string;
    guide?: boolean;
  };
}

export default function TextField<T extends FieldValues>({
  name,
  rules,
  control,
  label,
  type,
  fullWidth,
  inputProps,
  InputProps,
  InputLabelProps,
  sx,
  mask,
}: TextFieldProps<T>) {
  if (mask?.pattern == null || (Array.isArray(mask.pattern) && mask.pattern.length === 0)) {
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
            sx={sx}
            InputLabelProps={InputLabelProps}
            inputProps={inputProps}
            InputProps={InputProps}
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
          InputProps={{
            ...InputProps,
            inputComponent: MaskInput,
          }}
        />
      )}
    />
  );
}
