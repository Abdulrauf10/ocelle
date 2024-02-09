import { InputControllerProps } from '@/types';
import clsx from 'clsx';
import React from 'react';
import {
  type FieldValues,
  type FieldPath,
  type FieldPathValue,
  useController,
} from 'react-hook-form';

interface RadioProps<T extends FieldValues> extends InputControllerProps<T> {
  label: React.ReactNode;
  value: string | number;
}

function Radio<T extends FieldValues>({
  name,
  label,
  value,
  control,
  children,
  rules,
  error,
}: React.PropsWithChildren<RadioProps<T>>) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value == value;

  return (
    <label className="flex flex-1 flex-col">
      <div className="flex h-full justify-center px-1">{children}</div>
      <div className="relative mt-6 flex items-center justify-center">
        <div className={clsx('absolute h-0.5 w-full', error ? 'bg-error' : 'bg-primary')}></div>
        <div
          className={clsx(
            'relative mx-auto h-4 w-4 rounded-full border-2',
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
      <div className="mt-1 whitespace-nowrap px-1 text-center">{label}</div>
    </label>
  );
}

interface PictureRadioProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  radios: Array<
    React.PropsWithChildren<{
      label: string;
      value: FieldPathValue<TFieldValues, TFieldName>;
    }>
  >;
}

export default function PictureRadio<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, rules, radios, error }: PictureRadioProps<TFieldValues, TFieldName>) {
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
