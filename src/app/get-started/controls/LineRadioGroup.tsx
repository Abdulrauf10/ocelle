import clsx from 'clsx';
import React, { lazy } from 'react';
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useController,
} from 'react-hook-form';

interface CommonProps {
  name: string;
  control: Control<FieldValues, any>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

interface LineRadioProps extends CommonProps {
  label: React.ReactNode;
  value: string | number;
}

function LineRadio({
  name,
  label,
  value,
  control,
  children,
  rules,
}: React.PropsWithChildren<LineRadioProps>) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value == value;

  return (
    <label className="flex flex-1 flex-col">
      <div className="flex h-full justify-center px-1">{children}</div>
      <div className="relative mt-[30px] flex items-center justify-center">
        <div className="absolute h-[2px] w-full bg-primary"></div>
        <div
          className={clsx(
            'relative mx-auto h-[18px] w-[18px] rounded-full border-[2px] border-primary',
            isSelected ? 'bg-secondary' : 'bg-white'
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
      <div className="mt-[5px] whitespace-nowrap px-1">{label}</div>
    </label>
  );
}

interface LineRadioGroupProps extends CommonProps {
  radios: Array<
    React.PropsWithChildren<{
      label: string;
      value: string | number;
    }>
  >;
}

export default function LineRadioGroup({ name, control, rules, radios }: LineRadioGroupProps) {
  return (
    <div className="flex">
      {radios.map((radio, idx) => (
        <LineRadio
          key={idx}
          name={name}
          control={control}
          rules={rules}
          value={radio.value}
          label={radio.label}
        >
          {radio.children}
        </LineRadio>
      ))}
    </div>
  );
}
