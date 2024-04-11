'use client';

import React from 'react';
import { CalendarEvent } from '@/types';
import DatePickerForm from './DatePicker';
import { isUnavailableDeliveryDate } from '@/helpers/dog';

export default function DeliveryDatePickerForm({
  initialDate,
  minDate,
  disabled,
  calendarEvents,
  onComplete,
  action,
}: {
  initialDate: Date;
  calendarEvents: CalendarEvent[];
  minDate?: Date;
  disabled?: boolean;
  onComplete?(): void;
  action(data: { date: Date }): Promise<void>;
}) {
  return (
    <DatePickerForm
      initialDate={initialDate}
      disabled={disabled}
      minDate={minDate}
      shouldDisableDate={(day) => isUnavailableDeliveryDate(day, calendarEvents)}
      onComplete={onComplete}
      action={action}
    />
  );
}
