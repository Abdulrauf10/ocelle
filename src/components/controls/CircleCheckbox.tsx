import clsx from 'clsx';
import { type FieldValues, useController, useFormContext } from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface CircleCheckboxProps<T extends FieldValues> extends InputControllerProps<T> {
  label: React.ReactNode;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function CircleCheckbox<T extends FieldValues>({
  label,
  name,
  rules,
  error,
  className,
  onChange,
}: CircleCheckboxProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { onChange: _onChange, ...field },
  } = useController({ name, control, rules });

  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'flex cursor-pointer select-none items-start',
        error ? 'text-error' : 'text-brown',
        className
      )}
    >
      <div
        className={clsx(
          'relative mr-2 mt-[5px] h-[13px] min-h-[13px] w-[13px] min-w-[13px] rounded-full border-[1.5px]',
          error ? 'border-error' : 'border-brown',
          isSelected && 'bg-brown'
        )}
      >
        <input
          {...field}
          type="checkbox"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0"
          checked={!!field.value}
          onChange={(e) => {
            _onChange(e);
            if (typeof onChange === 'function') onChange(e);
          }}
        />
      </div>
      <span>{label}</span>
    </label>
  );
}
