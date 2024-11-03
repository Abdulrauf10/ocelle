'use client';

import React from 'react';

import DatePickerForm from './DatePicker';

import { isLegalDeliveryDate } from '@/helpers/shipment';
import { CalendarEvent } from '@/types';

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
      view={['day']}
      shouldDisableDate={(day) => !isLegalDeliveryDate(day, calendarEvents)}
      onComplete={onComplete}
      action={action}
      showCompletedMessage
    />
  );
}
