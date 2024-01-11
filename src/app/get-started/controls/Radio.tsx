import clsx from 'clsx';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface RadioControl {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  value: string | number;
  isBlock?: boolean;
}

export default function RadioControl({
  control,
  label,
  name,
  rules,
  value,
  isBlock,
}: RadioControl) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value == value;

  return (
    <label
      className={clsx(
        'flex items-center',
        isBlock && 'min-w-[140px] rounded-full border px-[15px] py-[5px]',
        isBlock
          ? isSelected
            ? 'border-primary bg-primary text-white'
            : 'border-[#A98D72] bg-[#F6F4F1] text-[#A98D72]'
          : 'text-[#A98D72]'
      )}
    >
      <div
        className={clsx(
          'relative mr-2 h-[13px] w-[13px] rounded-full border-[1.5px]',
          isBlock
            ? isSelected
              ? 'border-white bg-secondary'
              : 'border-[#A98D72] bg-white'
            : 'border-[#A98D72]'
        )}
      >
        <input
          {...field}
          type="radio"
          className="absolute bottom-0 left-0 right-0 top-0 opacity-0 [&:checked+*]:block"
          value={value}
        />
        {!isBlock && (
          <div className="ml-[1.5px] mt-[1.5px] hidden h-[7px] w-[7px] rounded-full bg-[#A98D72]"></div>
        )}
      </div>
      <span>{label}</span>
    </label>
  );
}
