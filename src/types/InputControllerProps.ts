import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';

interface InputControllerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: Omit<RegisterOptions<T>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  error?: boolean;
}

export default InputControllerProps;
