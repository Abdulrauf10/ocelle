'use client';

import React from 'react';
import Sub from '../icons/Sub';
import Plus from '../icons/Plus';
import clsx from 'clsx';

export default function NumberInput({
  className,
  min,
  max,
  value,
  disabled,
  onChange,
}: {
  className?: {
    root?: string;
    input?: string;
    button?: string;
    icon?: string;
  };
  min?: number;
  max?: number;
  value: number;
  disabled?: boolean;
  onChange(value: number): void;
}) {
  const [temp, setTemp] = React.useState<number>();

  const minMax = React.useCallback(
    (value: number) => {
      const _min = min ? Math.max(min, value) : value;
      const _max = max ? Math.min(max, _min) : _min;
      return _max;
    },
    [min, max]
  );

  const handleChange = React.useCallback(
    (value: number) => {
      const _value = minMax(value);
      onChange(_value);
    },
    [minMax, onChange]
  );

  return (
    <div
      className={clsx(
        'relative inline-flex w-16 items-center justify-center rounded-lg border bg-white',
        className?.root
      )}
    >
      <button
        type="button"
        className={clsx('absolute left-0 px-1.5 py-1', className?.button)}
        onClick={() => handleChange(value - 1)}
        disabled={disabled}
      >
        <Sub className={clsx('w-2', className?.icon)} />
      </button>
      <input
        className={clsx('w-[62px] rounded-lg px-[18px] py-1 text-center', className?.input)}
        value={temp ? (isNaN(temp) ? 1 : temp) : minMax(value)}
        onFocus={() => {
          setTemp(value);
        }}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setTemp(value);
        }}
        onBlur={() => {
          if (temp && !isNaN(temp) && temp !== value) {
            handleChange(temp);
          }
          setTemp(undefined);
        }}
      />
      <button
        type="button"
        className={clsx('absolute right-0 px-1.5 py-1', className?.button)}
        onClick={() => handleChange(value + 1)}
        disabled={disabled}
      >
        <Plus className={clsx('w-2', className?.icon)} />
      </button>
    </div>
  );
}
