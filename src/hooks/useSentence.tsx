'use client';

import { useTranslations } from 'next-intl';

import { Recipe } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';

export default function useSentence() {
  const t = useTranslations();

  return {
    array(array: string[]) {
      return array.join(t('comma')) + t('dot');
    },
    recipe(recipe: Recipe) {
      return t('Recipes.fresh-{}-recipe', { value: t(getRecipeSlug(recipe)) });
    },
    date(date: Date, displayYear?: boolean) {
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
    },
  };
}
