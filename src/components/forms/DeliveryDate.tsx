'use client';

import { useForm } from 'react-hook-form';
import DateCalendar from '../controls/DateCalendar';
import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { serialize } from 'object-to-formdata';

interface IDeliveryDateForm {
  deliveryDate: Date;
}

export default function DeliveryDateForm({
  initialDate,
  action,
}: {
  initialDate: Date;
  action(formData: FormData): Promise<void>;
}) {
  const t = useTranslations();
  const ref = React.useRef<HTMLFormElement | null>(null);
  const { control, getValues, setValue, handleSubmit } = useForm<IDeliveryDateForm>({
    defaultValues: {
      deliveryDate: initialDate,
    },
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = React.useCallback(
    ({ deliveryDate }: IDeliveryDateForm) => {
      startTransition(() => {
        action(serialize({ deliveryDate }));
      });
    },
    [action]
  );

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <DateCalendar
        name="deliveryDate"
        control={control}
        minDate={new Date()}
        actions={[
          {
            label: t('cancel'),
            disabled: getValues().deliveryDate.getTime() === initialDate.getTime(),
            onClick: () => setValue('deliveryDate', initialDate),
          },
          {
            label: t('save-changes'),
            disabled: pending,
            onClick: () => ref.current?.requestSubmit(),
          },
        ]}
      />
    </form>
  );
}
