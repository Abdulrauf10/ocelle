import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface BlockCheckboxProps {
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
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function BlockCheckbox({
  control,
  label,
  name,
  rules,
  value,
  error,
  className,
  onChange: parentOnChange,
}: BlockCheckboxProps) {
  const {
    field: { onChange, ...field },
  } = useController({ name, control, rules });
  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'flex min-w-[140px] select-none items-center rounded-full border border-current px-4 py-1.5',
        error
          ? 'text-error bg-white'
          : isSelected
            ? 'border-primary bg-primary text-white'
            : 'text-brown bg-brown bg-opacity-10',
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
          type="checkbox"
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
