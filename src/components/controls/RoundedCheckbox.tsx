import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';
import Tick from '../icons/Tick';

interface RoundedCheckboxProps {
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
  disabled?: boolean;
}

export default function RoundedCheckbox({
  control,
  label,
  name,
  rules,
  value,
  error,
  className,
  disabled,
}: RoundedCheckboxProps) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer select-none items-center',
        error && '!text-error'
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] min-h-[13px] w-[13px] min-w-[13px] rounded-[3px] border',
          disabled
            ? 'border-[#7B8D97] border-opacity-50'
            : error
              ? 'border-error'
              : isSelected
                ? 'border-brown'
                : 'border-black'
        )}
      >
        <input
          {...field}
          type="checkbox"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 [&:checked+*]:flex"
          value={value}
        />
        <div className="bg-brown absolute bottom-0 left-0 right-0 top-0 hidden h-full w-full items-center justify-center">
          <Tick className="w-[14px]" />
        </div>
      </div>
      <span className={clsx(disabled && '!text-[#7B8D97] !text-opacity-50', className)}>
        {label}
      </span>
    </label>
  );
}
