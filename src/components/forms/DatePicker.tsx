'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import useDefaultValues from '@/hooks/defaultValues';
import DateCalendar from '../inputs/DateCalendar';

export default function DatePickerForm({
  initialDate,
  minDate,
  disabled,
  shouldDisableDate,
  onCancel,
  action,
}: {
  initialDate: Date;
  minDate?: Date;
  disabled?: boolean;
  shouldDisableDate?(date: Date): boolean;
  onCancel?(): void;
  action(data: { date: Date }): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({ date: initialDate });
  const [pending, startTransition] = React.useTransition();
  const [date, setDate] = React.useState<Date>(defaultValues.date);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      await action({ date });
      setDefaultValues({ date });
    });
  }, [action, setDefaultValues, date]);

  const isSameAsDefaultValue = date === defaultValues.date;

  return (
    <DateCalendar
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
}
