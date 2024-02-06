import { InputControllerProps } from '@/types';
import {
  FilledInputProps,
  InputBaseComponentProps,
  InputProps,
  TextField as MuiTextField,
  OutlinedInputProps,
} from '@mui/material';
import { Controller, type FieldValues } from 'react-hook-form';

interface TextFieldProps<T extends FieldValues> extends InputControllerProps<T> {
  type: React.InputHTMLAttributes<unknown>['type'];
  label: string;
  className?: string;
  inputProps?: InputBaseComponentProps;
  InputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps>;
}

export default function TextField<T extends FieldValues>({
  name,
  rules,
  control,
  label,
  type,
  inputProps,
  InputProps,
}: TextFieldProps<T>) {
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
          fullWidth
          error={!!error}
          inputProps={inputProps}
          InputProps={InputProps}
        />
      )}
    />
  );
}
