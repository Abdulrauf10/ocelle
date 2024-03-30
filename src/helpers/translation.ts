import { Recipe } from '@/enums';
import { TranslationValues, useTranslations } from 'next-intl';
import { getRecipeSlug } from './dog';

export function freshRecipe(t: ReturnType<typeof useTranslations>, recipe: Recipe) {
  return t('fresh-{}-recipe', { value: t(getRecipeSlug(recipe)) });
}

export function colon(
  t: ReturnType<typeof useTranslations>,
  key: keyof IntlMessages,
  values?: TranslationValues
) {
  return t('{}-colon', { value: t(key, values) });
}
