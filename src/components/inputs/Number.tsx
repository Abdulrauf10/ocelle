'use client';

import clsx from 'clsx';
import React from 'react';

import Plus from '../icons/Plus';
import Sub from '../icons/Sub';

export default function NumberInput({
  className,
  min,
  max,
  value,
  buttonDelayMs,
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
  buttonDelayMs?: number;
  disabled?: boolean;
  onChange(value: number): Promise<void>;
}) {
  const [waiting, setWaiting] = React.useState(false);
  const [tempInputValue, setTempInputValue] = React.useState<number>();
  const [tempButtonValue, setTempButtonValue] = React.useState<number>();

  const minMax = React.useCallback(
    (value: number) => {
      const _min = min === undefined || min === null ? value : Math.max(min, value);
      const _max = max === undefined || max === null ? _min : Math.min(max, _min);
      return _max;
    },
    [min, max]
  );

  const handleButtonClick = React.useCallback(
    async (value: number) => {
      const _value = minMax(value);
      if (buttonDelayMs) {
        setTempButtonValue(_value);
      } else {
        setWaiting(true);
        try {
          await onChange(_value);
        } finally {
          setWaiting(false);
        }
      }
    },
    [buttonDelayMs, minMax, onChange]
  );

  const handleInputChange = React.useCallback(
    async (value: number) => {
      const _value = minMax(value);
      setWaiting(true);
      try {
        await onChange(_value);
      } finally {
        setTempInputValue(undefined);
        setWaiting(false);
      }
    },
    [minMax, onChange]
  );

  React.useEffect(() => {
    if (tempButtonValue !== undefined) {
      const timeout = setTimeout(async () => {
        setWaiting(true);
        try {
          await onChange(tempButtonValue);
        } finally {
          setTempButtonValue(undefined);
          setWaiting(false);
        }
      }, buttonDelayMs);
      return () => clearTimeout(timeout);
    }
  }, [tempButtonValue, buttonDelayMs, onChange]);

  const buttonValue = buttonDelayMs ? tempButtonValue ?? value : value;

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
        onClick={() => handleButtonClick(buttonValue - 1)}
        disabled={waiting || disabled}
      >
        <Sub className={clsx('w-2', className?.icon)} />
      </button>
      <input
        className={clsx('w-[62px] rounded-lg px-[18px] py-1 text-center', className?.input)}
        value={
          tempButtonValue !== undefined
            ? tempButtonValue
            : tempInputValue
              ? isNaN(tempInputValue)
                ? 1
                : tempInputValue
              : minMax(value)
        }
        onFocus={() => {
          setTempInputValue(value);
        }}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setTempInputValue(value);
        }}
        onBlur={() => {
          if (tempInputValue && !isNaN(tempInputValue) && tempInputValue !== value) {
            handleInputChange(tempInputValue);
          } else {
            setTempInputValue(undefined);
          }
        }}
        disabled={waiting || !!tempButtonValue}
      />
      <button
        type="button"
        className={clsx('absolute right-0 px-1.5 py-1', className?.button)}
        onClick={() => handleButtonClick(buttonValue + 1)}
        disabled={waiting || disabled}
      >
        <Plus className={clsx('w-2', className?.icon)} />
      </button>
    </div>
  );
}
