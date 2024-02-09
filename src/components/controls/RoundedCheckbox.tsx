import clsx from 'clsx';
import {
  type FieldValues,
  type FieldPath,
  type FieldPathValue,
  useController,
} from 'react-hook-form';
import Tick from '../icons/Tick';
import { InputControllerProps } from '@/types';

interface RoundedCheckboxProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  label: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value?: FieldPathValue<TFieldValues, TFieldName>;
}

export default function RoundedCheckbox<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  label,
  name,
  rules,
  error,
  className,
  value,
  disabled,
}: RoundedCheckboxProps<TFieldValues, TFieldName>) {
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
          checked={disabled ? false : !!field.value}
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 hidden h-full w-full items-center justify-center bg-brown">
          <Tick className="w-[14px]" />
        </div>
      </div>
      <div
        className={clsx('inline-block', disabled && '!text-[#7B8D97] !text-opacity-50', className)}
      >
        {label}
      </div>
    </label>
  );
}
