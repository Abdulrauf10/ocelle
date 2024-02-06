import { InputControllerProps } from '@/types';
import clsx from 'clsx';
import { type FieldValues, useController } from 'react-hook-form';

interface InteractiveBlockProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
  value: string | number;
  className?: string;
  type: 'checkbox' | 'radio';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function InteractiveBlock<T extends FieldValues>({
  control,
  label,
  name,
  rules,
  value,
  error,
  className,
  type,
  onChange: parentOnChange,
}: InteractiveBlockProps<T>) {
  const {
    field: { onChange, ...field },
  } = useController<T>({ name, control, rules });
  const isSelected =
    type === 'checkbox' ? field.value === true : String(field.value) === String(value);

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
          value={value}
        />
      </div>
      <span>{label}</span>
    </label>
  );
}
