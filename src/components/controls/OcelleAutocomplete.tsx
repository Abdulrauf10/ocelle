import { Autocomplete, AutocompleteProps, TextField as MuiTextField } from '@mui/material';
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type Path,
  type PathValue,
  useFormContext,
} from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface OcelleAutocompleteProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  defaultValue?: PathValue<TFieldValues, TFieldName>;
  label?: string;
}

export default function OcelleAutocomplete<T extends FieldValues>({
  defaultValue,
  name,
  rules,
  label,
  onChange: parentOnChange,
  ...props
}: Omit<
  AutocompleteProps<
    PathValue<T, FieldPath<T>>,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >,
  'renderInput' | 'value'
> &
  OcelleAutocompleteProps<T>) {
  const { control, setValue } = useFormContext<T>();
  return (
    <Controller
      defaultValue={defaultValue}
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
        return (
          <Autocomplete
            {...props}
            value={value}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                {...field}
                label={label}
                error={!!error}
                helperText={error?.message && <span className="body-3">{error.message}</span>}
                sx={(theme) => ({
                  '& .MuiInputBase-root.Mui-disabled.Mui-error': {
                    '& > fieldset': {
                      borderColor: theme.palette.error.main,
                    },
                  },
                })}
              />
            )}
            onChange={(event, selectedValue, reason, details) => {
              if (selectedValue) {
                onChange(selectedValue);
                setValue(name, selectedValue as PathValue<T, Path<T>>, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                if (parentOnChange && typeof parentOnChange === 'function') {
                  parentOnChange(event, selectedValue, reason, details);
                }
              }
            }}
          />
        );
      }}
    />
  );
}
