'use client';

import { useForm } from 'react-hook-form';
import DateCalendar from '../controls/DateCalendar';
import { useTranslations } from 'next-intl';
import React from 'react';
import { startOfDay } from 'date-fns';

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
  const { control, watch, reset, handleSubmit } = useForm<IDeliveryDateForm>({
    defaultValues: {
      deliveryDate: startOfDay(initialDate),
    },
  });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    ({ deliveryDate }: IDeliveryDateForm) => {
      startTransition(() => {
        action({ deliveryDate: startOfDay(deliveryDate) });
      });
      if (typeof onComplete === 'function') onComplete();
    },
    [action, onComplete]
  );

  const isSameAsDefaultValue =
    startOfDay(watch('deliveryDate')).getTime() === startOfDay(initialDate).getTime();

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
            onClick: () => reset({ deliveryDate: startOfDay(initialDate) }),
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
