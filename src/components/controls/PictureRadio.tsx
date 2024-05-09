import clsx from 'clsx';
import React from 'react';
import {
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  UseFormWatch,
  useController,
} from 'react-hook-form';

import { InputControllerProps } from '@/types';

interface RadioProps<T extends FieldValues> extends InputControllerProps<T> {
  label: React.ReactNode;
  value: string | number;
  onHover(): void;
}

function Radio<T extends FieldValues>({
  name,
  label,
  value,
  control,
  children,
  rules,
  error,
  onHover,
}: React.PropsWithChildren<RadioProps<T>>) {
  const { field } = useController({ name, control, rules });
  const isSelected = field.value == value;

  return (
    <label className="flex flex-1 flex-col" onMouseEnter={onHover}>
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
      <div className="mt-1"></div>
      <div className="body-3 whitespace-nowrap px-1 text-center">{label}</div>
    </label>
  );
}

type PictureRadioOption<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = React.PropsWithChildren<{
  label: string;
  value: FieldPathValue<TFieldValues, TFieldName>;
  descripton?: React.ReactNode;
}>;

interface PictureRadioProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  watch: UseFormWatch<TFieldValues>;
  radios: PictureRadioOption<TFieldValues, TFieldName>[];
}

export default function PictureRadio<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, watch, rules, radios, error }: PictureRadioProps<TFieldValues, TFieldName>) {
  const currentValue = watch(name);
  const selectedRadio = React.useMemo(() => {
    if (!currentValue) {
      return undefined;
    }
    return radios.find((radio) => radio.value === currentValue);
  }, [radios, currentValue]);
  const [hoverValue, setHoverValue] = React.useState<FieldPathValue<TFieldValues, TFieldName>>();

  const handleOnHover = React.useCallback((value: FieldPathValue<TFieldValues, TFieldName>) => {
    return () => {
      setHoverValue(value);
    };
  }, []);

  const description = React.useMemo(() => {
    return selectedRadio
      ? selectedRadio.descripton
      : hoverValue && radios.find((radio) => radio.value === hoverValue)?.descripton;
  }, [radios, selectedRadio, hoverValue]);

  return (
    <>
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
            onHover={handleOnHover(radio.value)}
          >
            {radio.children}
          </Radio>
        ))}
      </div>
      {description && <div className="mt-5">{description}</div>}
    </>
  );
}
