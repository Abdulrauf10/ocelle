import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface InlineRadioProps {
  control: Control<FieldValues, any>;
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
        error ? 'text-[#f00]' : 'text-[#A98D72]',
        className
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] w-[13px] rounded-full border-[1.5px]',
          error ? 'border-[#f00]' : 'border-[#A98D72]'
        )}
      >
        <input
          {...field}
          type="radio"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 [&:checked+*]:block"
          value={value}
        />
        <div className="ml-[1.5px] mt-[1.5px] hidden h-[7px] w-[7px] rounded-full bg-[#A98D72]"></div>
      </div>
      <span>{label}</span>
    </label>
  );
}
