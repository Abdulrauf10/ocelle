'use client';

import { useForm } from 'react-hook-form';
import DateCalendar from '../controls/DateCalendar';
import { useTranslations } from 'next-intl';
import React from 'react';
import { startOfDay } from 'date-fns';
import useDefaultValues from '@/hooks/defaultValues';

interface IDeliveryDateForm {
  deliveryDate: Date;
}

export default function DeliveryDateForm({
  initialDate,
  action,
  onComplete,
}: {
  initialDate: Date;
  action(data: { deliveryDate: Date }): Promise<void>;
  onComplete?(): void;
}) {
  const t = useTranslations();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const { defaultValues, setDefaultValues } = useDefaultValues({
    deliveryDate: startOfDay(initialDate),
  });
  const { control, watch, reset, handleSubmit } = useForm<IDeliveryDateForm>({ defaultValues });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    ({ deliveryDate }: IDeliveryDateForm) => {
      startTransition(() => {
        const values = { deliveryDate: startOfDay(deliveryDate) };
        action(values);
        setDefaultValues(values);
      });
      if (typeof onComplete === 'function') onComplete();
    },
    [action, setDefaultValues, onComplete]
  );

  const isSameAsDefaultValue =
    startOfDay(watch('deliveryDate')).getTime() ===
    startOfDay(defaultValues.deliveryDate).getTime();

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <DateCalendar
        name="deliveryDate"
        control={control}
        minDate={new Date()}
        actions={[
          {
            label: t('cancel'),
            disabled: isSameAsDefaultValue,
            onClick: () => reset(defaultValues),
          },
          {
            label: t('save-changes'),
            disabled: pending || isSameAsDefaultValue,
            onClick: () => ref.current?.requestSubmit(),
          },
        ]}
      />
    </form>
  );
}
