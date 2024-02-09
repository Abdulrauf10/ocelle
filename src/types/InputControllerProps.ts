import type { Control, FieldValues, FieldPath, RegisterOptions } from 'react-hook-form';

interface InputControllerProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TFieldName;
  rules?: Omit<
    RegisterOptions<TFieldValues>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  error?: boolean;
}

export default InputControllerProps;
