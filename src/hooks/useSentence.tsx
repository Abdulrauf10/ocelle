import { format } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';

import { PadSpace, Recipe } from '@/enums';
import RecipeHelper from '@/helpers/recipe';

export default function useSentence() {
  const locale = useLocale();
  const t = useTranslations();

  return {
    array(array: string[]) {
      return array.join(t('comma')) + t('dot');
    },
    recipe(recipe: Recipe) {
      return t('Recipes.fresh-{}-recipe', { value: t(RecipeHelper.getSlug(recipe)) });
    },
    date(date: Date, displayYear?: boolean) {
      const dateTimeFormat = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-HK' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const parts = dateTimeFormat.formatToParts(date);

      if (locale === 'zh') {
        return parts.map((part) => part.value).join('');
      }

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
    },
    datetime(date: Date, displayYear?: boolean) {
      return this.date(date, displayYear) + (locale === 'en' ? ' ' : '') + format(date, 'hh:mmaa');
    },
    padSpace: (space: PadSpace, str?: string) => {
      // str length === 0
      if (!str || str.length === 0 || locale === 'en') {
        return str;
      }
      const regex = /[a-z]/i;
      const stChar = str[0];
      const endChar = str[Math.max(str.length - 1, 0)];

      const padStart = regex.test(stChar) && (space & PadSpace.Left) === PadSpace.Left;
      const padEnd = regex.test(endChar) && (space & PadSpace.Right) === PadSpace.Right;

      return `${padStart ? ' ' : ''}${str}${padEnd ? ' ' : ''}`;
    },
  };
}
