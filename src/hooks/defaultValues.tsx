import React from 'react';

export default function useDefaultValues<T>(initial: T) {
  const defaultValuesRef = React.useRef<T>(initial);

  const setDefaultValues = React.useCallback((defaultValues: T) => {
    defaultValuesRef.current = defaultValues;
  }, []);

  return { defaultValues: defaultValuesRef.current, setDefaultValues };
}
