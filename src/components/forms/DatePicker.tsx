'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import useDefaultValues from '@/hooks/defaultValues';
import DateCalendar from '../inputs/DateCalendar';
import { startOfDay } from 'date-fns';

type T = {
  initialDate: Date;
  minDate?: Date;
  disabled?: boolean;
  shouldDisableDate?(date: Date): boolean;
  onComplete?(): void;
  action(data: { date: Date }): Promise<void>;
};

export default React.forwardRef<HTMLDivElement, T>(function DatePickerForm(
  { initialDate, minDate, disabled, shouldDisableDate, onComplete, action }: T,
  ref
) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({ date: startOfDay(initialDate) });
  const [pending, startTransition] = React.useTransition();
  const [date, setDate] = React.useState<Date>(defaultValues.date);

  React.useEffect(() => {
    const _date = startOfDay(initialDate);
    setDate(_date);
    setDefaultValues({ date: _date });
  }, [initialDate, setDefaultValues]);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      const values = { date: startOfDay(date) };
      await action(values);
      setDefaultValues(values);
    });
    if (typeof onComplete === 'function') onComplete();
  }, [action, setDefaultValues, onComplete, date]);

  const isSameAsDefaultValue =
    startOfDay(date).getTime() === startOfDay(defaultValues.date).getTime();

  return (
    <DateCalendar
      ref={ref}
      value={date}
      disabled={disabled}
      disableHighlightToday
      minDate={minDate}
      shouldDisableDate={shouldDisableDate}
      actions={[
        {
          label: t('cancel'),
          disabled: isSameAsDefaultValue || pending,
          onClick: () => setDate(defaultValues.date),
        },
        {
          label: t('save-changes'),
          disabled: isSameAsDefaultValue || pending,
          onClick: onSubmit,
        },
      ]}
      onChange={setDate}
    />
  );
});
