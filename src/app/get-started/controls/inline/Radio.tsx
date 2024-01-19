import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface InlineRadioProps {
  control: Control<FieldValues>;
  label: string;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  value: string | number;
  error?: boolean;
  className?: string;
}

export default function InlineRadio({
  control,
  label,
  name,
  rules,
  value,
  error,
  className,
}: InlineRadioProps) {
  const { field } = useController({ name, control, rules });

  return (
    <label
      className={clsx(
        'flex cursor-pointer items-center',
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
          type="radio"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 [&:checked+*]:block"
          value={value}
        />
        <div className="bg-brown ml-[1.5px] mt-[1.5px] hidden h-[7px] w-[7px] rounded-full"></div>
      </div>
      <span>{label}</span>
    </label>
  );
}
