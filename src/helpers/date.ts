import { useTranslations } from 'next-intl';

export function formatDate(
  t: ReturnType<typeof useTranslations>,
  date: Date,
  displayYear?: boolean
) {
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parts = dateTimeFormat.formatToParts(date);

  const segments = [
    t('{}-of-{}', {
      date: t('{}-ordinal', { value: parts.find((part) => part.type === 'day')!.value }),
      month: parts.find((part) => part.type === 'month')!.value,
    }),
  ];

  if (displayYear) {
    segments.push(parts.find((part) => part.type === 'year')!.value);
  }

  return segments.join(' ');
}
