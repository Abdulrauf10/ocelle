/**
 * Find the minimum date
 */
export function minDate(...dates: Date[]) {
  let min: Date = dates[0];
  for (const date of dates) {
    if (date.getTime() < min.getTime()) {
      min = date;
    }
  }
  return minDate;
}
/**
 * Find the maximum date
 */
export function maxDate(...dates: Date[]) {
  let max: Date = dates[0];
  for (const date of dates) {
    if (date.getTime() > max.getTime()) {
      max = date;
    }
  }
  return max;
}
