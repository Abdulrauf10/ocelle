import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface CheckboxControl {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  value: string | number;
}

export default function CheckboxControl({ control, label, name, rules, value }: CheckboxControl) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'flex min-w-[140px] items-center rounded-full border px-4 py-1.5',
        isSelected
          ? 'border-primary bg-primary text-white'
          : 'border-[#A98D72] bg-[#F6F4F1] text-[#A98D72]'
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] w-[13px] rounded-full border-[1.5px]',
          isSelected ? 'border-white bg-secondary' : 'border-[#A98D72] bg-white'
        )}
      >
        <input
          {...field}
          type="checkbox"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0"
          value={value}
        />
      </div>
      <span>{label}</span>
    </label>
  );
}
