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
    <label className="relative flex flex-1 flex-col px-3" onMouseEnter={onHover}>
      <div className="flex h-full justify-center px-1">{children}</div>
      <input
        {...field}
        type="radio"
        className="absolute bottom-0 left-0 right-0 top-0 opacity-0"
        value={value}
      />
      <div className="pt-4"></div>
      <div>
        <div
          className={clsx(
            'flex min-w-[120px] select-none justify-center rounded-full border border-current px-4 py-2',
            error
              ? 'bg-white text-error'
              : isSelected
                ? 'border-primary bg-primary text-white'
                : 'bg-brown bg-opacity-10 text-brown'
          )}
        >
          <div className="body-3 whitespace-nowrap px-1 text-center">{label}</div>
        </div>
      </div>
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
  selectedDescription?: React.ReactNode;
}>;

interface PictureRadioProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputControllerProps<TFieldValues, TFieldName> {
  className?: {
    radioGroup?: string;
  };
  watch: UseFormWatch<TFieldValues>;
  radios: PictureRadioOption<TFieldValues, TFieldName>[];
}

export default function PictureRadio<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  name,
  control,
  watch,
  rules,
  radios,
  error,
}: PictureRadioProps<TFieldValues, TFieldName>) {
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

  const selectedDescription = React.useMemo(() => {
    return selectedRadio && selectedRadio.selectedDescription;
  }, [selectedRadio]);

  return (
    <>
      <div className={clsx(className?.radioGroup)}>
        <div className="-mx-3 flex">
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
      </div>
      {description && <div className="mt-5 flex justify-center">{description}</div>}
      {selectedDescription && <div className="mt-5 flex justify-center">{selectedDescription}</div>}
    </>
  );
}
