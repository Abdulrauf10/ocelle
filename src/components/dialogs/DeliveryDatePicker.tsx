'use client';

import React from 'react';

import { Dialog, DialogContent, DialogTrigger, useDialogContext } from '../Dialog';
import DeliveryDatePickerForm from '../forms/DeliveryDatePicker';

import { CalendarEvent } from '@/types';

function PickerWrapper({
  initialDate,
  minDate,
  disabled,
  calendarEvents,
  action,
}: {
  initialDate: Date;
  calendarEvents: CalendarEvent[];
  minDate?: Date;
  disabled?: boolean;
  action(data: { date: Date }): Promise<void>;
}) {
  const { setOpen } = useDialogContext();

  return (
    <DeliveryDatePickerForm
      initialDate={initialDate}
      minDate={minDate}
      calendarEvents={calendarEvents}
      action={action}
      disabled={disabled}
      onComplete={() => setOpen(false)}
    />
  );
}

export default function DeliveryDatePickerDialog({
  initialDate,
  minDate,
  disabled,
  calendarEvents,
  action,
  children,
}: React.PropsWithChildren<{
  initialDate: Date;
  calendarEvents: CalendarEvent[];
  minDate?: Date;
  disabled?: boolean;
  action(data: { date: Date }): Promise<void>;
}>) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <PickerWrapper
          initialDate={initialDate}
          minDate={minDate}
          disabled={disabled}
          calendarEvents={calendarEvents}
          action={action}
        />
      </DialogContent>
    </Dialog>
  );
}
