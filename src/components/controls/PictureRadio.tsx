import clsx from 'clsx';
import React from 'react';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface CommonProps {
  name: string;
  control: Control<FieldValues>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  error?: boolean;
}

interface RadioProps extends CommonProps {
  label: React.ReactNode;
  value: string | number;
}

function Radio({
  name,
  label,
  value,
  control,
  children,
  rules,
  error,
}: React.PropsWithChildren<RadioProps>) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value == value;

  return (
    <label className="flex flex-1 flex-col">
      <div className="flex h-full justify-center px-1">{children}</div>
      <div className="relative mt-6 flex items-center justify-center">
        <div className={clsx('absolute h-0.5 w-full', error ? 'bg-error' : 'bg-primary')}></div>
        <div
          className={clsx(
            'relative mx-auto h-4 w-4 rounded-full border ',
            isSelected ? 'bg-secondary' : 'bg-white',
            error ? 'border-error' : 'border-primary'
          )}
        >
          <input
            {...field}
            type="radio"
            className="absolute bottom-0 left-0 right-0 top-0 opacity-0"
            value={value}
          />
        </div>
      </div>
      <div className="mt-1 whitespace-nowrap px-1">{label}</div>
    </label>
  );
}

interface PictureRadioProps extends CommonProps {
  radios: Array<
    React.PropsWithChildren<{
      label: string;
      value: string | number;
    }>
  >;
}

export default function PictureRadio({ name, control, rules, radios, error }: PictureRadioProps) {
  return (
    <div className="flex">
      {radios.map((radio, idx) => (
        <Radio
          key={idx}
          name={name}
          control={control}
          rules={rules}
          value={radio.value}
          label={radio.label}
          error={error}
        >
          {radio.children}
        </Radio>
      ))}
    </div>
  );
}
