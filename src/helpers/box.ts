import { addDays } from 'date-fns';

import { getClosestDeliveryDateByDate, getEditableRecurringBoxDeadline } from './shipment';

import { Frequency } from '@/enums';
import { CalendarEvent } from '@/types';

export function getNextRecurringBoxPreiod(prevBoxEndDate: Date, frequency: Frequency) {
  const startDate = addDays(prevBoxEndDate, 1);
  const endDate = addDays(startDate, frequency === Frequency.OneWeek ? 7 : 14);

  return { startDate, endDate };
}

export function getInterruptibleNextRecurringBoxPreiod(
  prevBoxEndDate: Date,
  frequency: Frequency,
  events: CalendarEvent[]
) {
  const { startDate, endDate } = getNextRecurringBoxPreiod(prevBoxEndDate, frequency);
  const editableDeadline = getEditableRecurringBoxDeadline(events, startDate);
  if (editableDeadline > new Date()) {
    // they still run it as a normal recurring flow
    return { startDate, endDate };
  }
  const closestDeliveryDate = getClosestDeliveryDateByDate(events, new Date(), true);
  return getNextRecurringBoxPreiod(closestDeliveryDate, frequency);
}
