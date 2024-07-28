import cloneDeep from 'clone-deep';
import equals from 'deep-equal';
import React from 'react';
import type {
  DeepPartial,
  FieldValues,
  Mode,
  Path,
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form';

type DisplayState<T> = {
  [key in Path<T>]?: boolean;
};

function objectToBooleanValues<T extends FieldValues>(object: Partial<T>) {
  const newObj: DisplayState<T> = cloneDeep(object);
  for (const key of Object.keys(object)) {
    newObj[key as Path<T>] = false;
  }
  return newObj;
}

export default function useFormFieldDisplayState<TFieldValues extends FieldValues = FieldValues>(
  defaultValues: Partial<TFieldValues>,
  watch: UseFormWatch<TFieldValues>,
  getValues: UseFormGetValues<TFieldValues>,
  getFieldState: UseFormGetFieldState<TFieldValues>,
  mode?: Mode
) {
  const keys = React.useMemo(
    () => Object.keys(defaultValues) as Path<TFieldValues>[],
    [defaultValues]
  );
  const [inited, setInited] = React.useState(false);
  const [displayState, setDisplayState] = React.useState<DisplayState<TFieldValues>>(
    objectToBooleanValues(defaultValues)
  );

  const checkFieldDisplayState = React.useCallback(
    (values: DeepPartial<TFieldValues> | TFieldValues, name?: Path<TFieldValues>) => {
      if (name) {
        const fieldState = getFieldState(name);
        if (!equals(values[name], defaultValues[name]) && !fieldState.invalid) {
          setDisplayState((values) => ({ ...values, [name]: true }));
        }
      }
      for (const key of keys) {
        const rawValue = values[key];
        // prevent [undefined] will not match with the []
        const value = Array.isArray(rawValue)
          ? (rawValue as any[]).filter((value) => value !== undefined)
          : rawValue;
        const fieldState = getFieldState(key);
        if (!equals(value, defaultValues[key]) && !fieldState.invalid) {
          setDisplayState((values) => ({ ...values, [key]: true }));
        }
      }
    },
    [defaultValues, keys, getFieldState]
  );

  const handleCheckDisplayState = React.useCallback(() => {
    const values = getValues();
    setTimeout(() => checkFieldDisplayState(values), 10);
  }, [getValues, checkFieldDisplayState]);

  React.useEffect(() => {
    if (mode !== 'onBlur') {
      const { unsubscribe } = watch((values, info) => {
        setTimeout(() => checkFieldDisplayState(values, info.name), 10);
      });
      return () => unsubscribe();
    }
  }, [mode, checkFieldDisplayState, watch]);

  React.useEffect(() => {
    if (!inited) {
      handleCheckDisplayState();
      setInited(true);
    }
  }, [inited, handleCheckDisplayState]);

  return {
    displayState,
    displayButton: Object.values(displayState).every((show) => show === true),
    checkFieldDisplayState: handleCheckDisplayState,
  };
}
