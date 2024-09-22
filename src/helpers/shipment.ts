import { addDays, getDay, startOfDay, subDays, subMinutes } from 'date-fns';

import { CalendarEvent } from '@/types';

export function isOperationDate(date: Date, events: CalendarEvent[]) {
  if (getDay(date) === 0) {
    return false;
  }
  for (const event of events) {
    if (event.start <= date && event.end > date) {
      return false;
    }
  }
  return true;
}

export function isLegalDeliveryDate(date: Date, events: CalendarEvent[]) {
  if (getDay(date) === 1) {
    return false;
  }
  // for (const event of events) {
  //   if (event.start <= date && event.end > date) {
  //     return false;
  //   }
  // }
  return true;
}

/**
 * calculate the delivery date based on any time
 */
export function getClosestDeliveryDateByDate(
  events: CalendarEvent[],
  refDate = new Date(),
  bufferZone?: boolean
) {
  const dates = [
    0, // D = ref date
    1, // D + production
    1, // D + production
    1, // D + pick up
    1, // D + delivery
  ];

  while (!isOperationDate(addDays(refDate, dates[0] + dates[1]), events)) {
    dates[1] += 1;
  }

  while (!isOperationDate(addDays(refDate, dates[0] + dates[1] + dates[2]), events)) {
    dates[2] += 1;
  }

  const totalProductionDates = dates[0] + dates[1] + dates[2];

  // pick up + delivery stick together
  while (
    !isOperationDate(addDays(refDate, totalProductionDates + dates[3]), events) ||
    !isLegalDeliveryDate(addDays(refDate, totalProductionDates + dates[3] + dates[4]), events)
  ) {
    dates[3] += 1;
  }

  console.debug('processing dates debug day usage', dates);

  return addDays(startOfDay(refDate), dates.reduce((sum, a) => sum + a, 0) + (bufferZone ? 2 : 0));
}

export function getRecurringBoxMinDeliveryDate(events: CalendarEvent[]) {
  return getClosestDeliveryDateByDate(events);
}

export function getEditableRecurringBoxDeadline(
  events: CalendarEvent[],
  deliveryDate: Date,
  disableBufferZone?: boolean
) {
  const dates = [
    0, // D = delivery date
    1, // D + pick up
    1, // D + production
    1, // D + production
  ];

  // pick up + delivery stick together
  while (!isLegalDeliveryDate(subDays(deliveryDate, dates[0] + dates[1]), events)) {
    dates[1] += 1;
  }

  const _days = dates[0] + dates[1];

  while (!isOperationDate(subDays(deliveryDate, _days + dates[2]), events)) {
    dates[2] += 1;
  }

  while (!isOperationDate(subDays(deliveryDate, _days + dates[2] + dates[3]), events)) {
    dates[3] += 1;
  }

  console.debug('get editable recurring box deadline', dates);

  return subMinutes(
    subDays(
      startOfDay(deliveryDate),
      dates.reduce((sum, a) => sum + a, 0) + (disableBufferZone ? 0 : 2)
    ),
    1
  );
}

export function getRecurringBoxDefaultDeliveryDate(events: CalendarEvent[], boxStartDate: Date) {
  const dates = [
    0, // D = box start date
    1, // The box should be delivered before one day of the holiday / the next box start date
    1, // D + delivery
  ];

  // pick up + delivery stick together
  while (!isLegalDeliveryDate(subDays(boxStartDate, dates[0] + dates[1] + dates[2]), events)) {
    dates[2] += 1;
  }

  console.debug('get recurring box default delivery date', dates);

  return subDays(
    startOfDay(boxStartDate),
    dates.reduce((sum, a) => sum + a, 0)
  );
}

export function isDeliveredRecurringBox(deliveryDate: Date) {
  return startOfDay(deliveryDate) < startOfDay(new Date());
}
