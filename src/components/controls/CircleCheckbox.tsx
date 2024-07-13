import clsx from 'clsx';
import { type FieldValues, useController } from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface CircleCheckboxProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function CircleCheckbox<T extends FieldValues>({
  control,
  label,
  name,
  rules,
  error,
  className,
  onChange,
}: CircleCheckboxProps<T>) {
  const {
    field: { onChange: _onChange, ...field },
  } = useController({ name, control, rules });

  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'flex cursor-pointer select-none items-center',
        error ? 'text-error' : 'text-brown',
        className
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] w-[13px] rounded-full border-[1.5px]',
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
