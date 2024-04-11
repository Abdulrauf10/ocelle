import { FoodAllergies, Recipe } from '@/enums';
import { TranslationValues, useTranslations } from 'next-intl';
import { getRecipeSlug } from './dog';
import { Dog } from '@/entities';
import { differenceInMonths, differenceInYears, subYears } from 'date-fns';
import { UserAddressFragment } from '@/gql/graphql';

type useTranslationsReturn = ReturnType<typeof useTranslations>;

export function freshRecipe(t: useTranslationsReturn, recipe: Recipe) {
  return t('fresh-{}-recipe', { value: t(getRecipeSlug(recipe)) });
}

export function colon(
  t: useTranslationsReturn,
  key: keyof IntlMessages,
  values?: TranslationValues
) {
  return t('{}-colon', { value: t(key, values) });
}

export function arrayToSentence(t: useTranslationsReturn, array: string[]) {
  return array.join(t('comma')) + t('dot');
}

export function dogToSentence(t: useTranslationsReturn, dog: Dog) {
  const strings = [];
  // render age
  const diffInYears = differenceInYears(new Date(), dog.dateOfBirth);
  const diffInMonths = differenceInMonths(subYears(new Date(), diffInYears), dog.dateOfBirth);
  if (diffInYears > 0) {
    strings.push(t('{}-years-and-{}-months-old', { years: diffInYears, months: diffInMonths }));
  } else {
    strings.push(t('{}-months-old', { months: diffInMonths }));
  }

  // render kg
  strings.push(t('{}-kg', { value: dog.weight }));

  // render activity level
  switch (dog.activityLevel) {
    case 'Mellow':
      strings.push(t('mellow').toLowerCase());
      break;
    case 'Active':
      strings.push(t('active').toLowerCase());
      break;
    case 'VeryActive':
      strings.push(t('very-active').toLowerCase());
      break;
  }

  // render spayed / not spayed
  if (dog.sex === 'M') {
    strings.push(
      t('is-{}', { value: dog.isNeutered ? t('neutered') : t('not-neutered') }).toLowerCase()
    );
  } else {
    strings.push(
      t('is-{}', { value: dog.isNeutered ? t('spayed') : t('not-spayed') }).toLowerCase()
    );
  }

  if ((dog.foodAllergies & FoodAllergies.None) === FoodAllergies.None) {
    strings.push(t('has-no-allergies-food-sensitivities'));
  } else {
    strings.push(t('has-allergies-food-sensitivities'));
  }

  return new Intl.ListFormat('en-US').format(strings) + t('dot');
}

export function addressToSentence(t: useTranslationsReturn, address: UserAddressFragment) {
  return [
    address.streetAddress1,
    address.streetAddress2,
    address.city,
    address.countryArea,
    address.country.country,
  ].join(t('comma'));
}
