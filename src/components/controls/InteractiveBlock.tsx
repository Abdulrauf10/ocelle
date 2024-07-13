import clsx from 'clsx';
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  useController,
} from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface InteractiveBlockBase<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  label: React.ReactNode | ((checked: boolean) => React.ReactNode);
  className?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface InteractiveBlockCheckbox<T extends FieldValues> extends InteractiveBlockBase<T> {
  type: 'checkbox';
}

interface InteractiveBlockRadio<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InteractiveBlockBase<TFieldValues, TFieldName> {
  type: 'radio';
  value?: FieldPathValue<TFieldValues, TFieldName>;
}

type InteractiveBlockProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = InteractiveBlockCheckbox<TFieldValues> | InteractiveBlockRadio<TFieldValues, TFieldName>;

export default function InteractiveBlock<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  label,
  name,
  rules,
  error,
  className,
  type,
  disabled,
  onChange: parentOnChange,
  ...props
}: InteractiveBlockProps<TFieldValues, TFieldName>) {
  const {
    field: { onChange, ...field },
  } = useController<TFieldValues>({ name, control, rules, disabled });
  const isSelected =
    type === 'checkbox'
      ? field.value === true
      : String(field.value) === String((props as InteractiveBlockRadio<TFieldValues>).value);

  return (
    <label
      className={clsx(
        'relative flex min-w-[120px] select-none justify-center rounded-full border border-current px-4 py-2',
        error
          ? 'bg-white text-error'
          : isSelected
            ? 'border-primary bg-primary text-white'
            : 'bg-brown bg-opacity-10 text-brown',
        disabled && 'opacity-60',
        className
      )}
    >
      <input
        {...field}
        type={type}
        className="absolute bottom-0 left-0 right-0 top-0 opacity-0"
        onChange={(e) => {
          onChange(e);
          if (parentOnChange && typeof parentOnChange === 'function') {
            parentOnChange(e);
          }
        }}
        value={(props as any).value}
        checked={type === 'checkbox' && !!field.value}
      />
      <span className="body-3 min-w-[55px] text-center">
        {typeof label === 'function' ? label(isSelected) : label}
      </span>
    </label>
  );
}
