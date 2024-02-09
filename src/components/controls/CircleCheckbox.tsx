import { InputControllerProps } from '@/types';
import clsx from 'clsx';
import { type FieldValues, useController } from 'react-hook-form';

interface CircleCheckboxProps<T extends FieldValues> extends InputControllerProps<T> {
  label: string;
  className?: string;
}

export default function CircleCheckbox<T extends FieldValues>({
  control,
  label,
  name,
  rules,
  error,
  className,
}: CircleCheckboxProps<T>) {
  const { field } = useController({ name, control, rules });

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
          error ? 'border-error' : 'border-brown'
        )}
      >
        <input
          {...field}
          type="checkbox"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 [&:checked+*]:block"
          checked={!!field.value}
        />
        <div className="ml-[1.5px] mt-[1.5px] hidden h-[7px] w-[7px] rounded-full bg-brown"></div>
      </div>
      <span>{label}</span>
    </label>
  );
}
