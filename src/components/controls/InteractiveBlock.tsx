import { InputControllerProps } from '@/types';
import clsx from 'clsx';
import {
  type FieldValues,
  type FieldPathValue,
  type FieldPath,
  useController,
} from 'react-hook-form';

interface InteractiveBlockBase<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  label: string;
  className?: string;
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
  onChange: parentOnChange,
  ...props
}: InteractiveBlockProps<TFieldValues, TFieldName>) {
  const {
    field: { onChange, ...field },
  } = useController<TFieldValues>({ name, control, rules });
  const isSelected =
    type === 'checkbox'
      ? field.value === true
      : String(field.value) === String((props as InteractiveBlockRadio<TFieldValues>).value);

  return (
    <label
      className={clsx(
        'flex min-w-[140px] select-none items-center rounded-full border border-current px-4 py-1.5',
        error
          ? 'bg-white text-error'
          : isSelected
            ? 'border-primary bg-primary text-white'
            : 'bg-brown bg-opacity-10 text-brown',
        className
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] w-[13px] rounded-full border-2',
          isSelected ? 'border-white bg-secondary' : 'border-brown bg-white'
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
        />
      </div>
      <span>{label}</span>
    </label>
  );
}
