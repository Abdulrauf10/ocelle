import { isBefore, startOfDay } from 'date-fns';

import { DogPlan, RecurringBox } from '@/entities';

export function isOrderableDog(plan: DogPlan, prevBox: RecurringBox) {
  const today = startOfDay(new Date());
  if (!plan.isEnabled) {
    return false;
  }
  // prevent too erarly to send the next recurring box
  if (isBefore(startOfDay(prevBox.startDate), today)) {
    return false;
  }
  return true;
}
