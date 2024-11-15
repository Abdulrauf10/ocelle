'use client';

import { DateView } from '@mui/x-date-pickers';
import { startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'react-toastify';

import DateCalendar from '../inputs/DateCalendar';

import useDefaultValues from '@/hooks/defaultValues';

type T = {
  initialDate: Date;
  minDate?: Date;
  disabled?: boolean;
  view?: readonly DateView[];
  showCompletedMessage?: boolean;
  shouldDisableDate?(date: Date): boolean;
  onComplete?(data: { date: Date }): void;
  action(data: { date: Date }): Promise<void>;
};

export default React.forwardRef<HTMLDivElement, T>(function DatePickerForm(
  {
    initialDate,
    minDate,
    view,
    disabled,
    showCompletedMessage,
    shouldDisableDate,
    onComplete,
    action,
  }: T,
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
    const values = { date: startOfDay(date) };
    startTransition(async () => {
      await action(values);
      setDefaultValues(values);
      if (showCompletedMessage) {
        toast(t('the-delivery-date-has-been-successfully-updated'));
      }
    });
    if (typeof onComplete === 'function') onComplete(values);
  }, [action, setDefaultValues, onComplete, date, t, showCompletedMessage]);

  const isSameAsDefaultValue =
    startOfDay(date).getTime() === startOfDay(defaultValues.date).getTime();

  return (
    <DateCalendar
      ref={ref}
      value={date}
      disabled={disabled}
      disableHighlightToday
      minDate={minDate}
      view={view}
      shouldDisableDate={shouldDisableDate}
      actions={[
        {
          label: t('cancel'),
          disabled: isSameAsDefaultValue || pending,
          onClick: () => setDate(defaultValues.date),
        },
        {
          label: t('save'),
          disabled: isSameAsDefaultValue || pending,
          onClick: onSubmit,
        },
      ]}
      onChange={setDate}
    />
  );
});
