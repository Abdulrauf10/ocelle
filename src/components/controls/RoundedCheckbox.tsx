import clsx from 'clsx';
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  useController,
  useFormContext,
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
  readonly?: boolean;
  value?: FieldPathValue<TFieldValues, TFieldName>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function RoundedCheckbox<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  rules,
  error,
  className,
  value,
  disabled,
  readonly,
  onChange: parentOnChange,
}: RoundedCheckboxProps<TFieldValues, TFieldName>) {
  const { control } = useFormContext<TFieldValues>();
  const {
    field: { onChange, ...field },
  } = useController({ name, control, rules });
  const isSelected = field.value === true;

  return (
    <label
      className={clsx(
        'inline-flex cursor-pointer select-none items-start',
        error && '!text-error',
        readonly && 'pointer-events-none'
      )}
    >
      <div
        className={clsx(
          'relative mr-2 mt-px h-[13px] min-h-[13px] w-[13px] min-w-[13px] rounded-[3px] border',
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
          onChange={(e) => {
            onChange(e);
            if (parentOnChange && typeof parentOnChange === 'function') {
              parentOnChange(e);
            }
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 top-0 hidden h-full w-full items-center justify-center bg-brown">
          <Tick className="w-[14px]" />
        </div>
      </div>
      <div
        className={clsx(
          'body-3 inline-block',
          error && '!text-error',
          disabled && '!text-[#7B8D97] !text-opacity-50',
          className
        )}
      >
        {label}
      </div>
    </label>
  );
}
