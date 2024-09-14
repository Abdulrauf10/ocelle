import { addDays } from 'date-fns';

import { Frequency } from '@/enums';

export function getNextRecurringBoxPreiod(prevBoxEndDate: Date, frequency: Frequency) {
  // TODO: reactive plan have interrupted start date
  const startDate = addDays(prevBoxEndDate, 1);
  const endDate = addDays(startDate, frequency === Frequency.OneWeek ? 7 : 14);

  return { startDate, endDate };
}
