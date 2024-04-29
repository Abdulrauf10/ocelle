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

//TODO
export function colon(
  t: useTranslationsReturn,
  key: keyof IntlMessages | any,
  values?: TranslationValues
) {
  const g = useTranslations();
  return g('{}-colon', { value: t(key, values) });
}

export function arrayToSentence(t: useTranslationsReturn, array: string[]) {
  const g = useTranslations();
  return array.join(g('comma')) + g('dot');
}

export function dogToSentence(t: useTranslationsReturn, dog: Dog) {
  const strings = [];
  const g = useTranslations();
  // render age
  const diffInYears = differenceInYears(new Date(), dog.dateOfBirth);
  const diffInMonths = differenceInMonths(subYears(new Date(), diffInYears), dog.dateOfBirth);
  if (diffInYears > 0) {
    strings.push(g('{}-years-and-{}-months-old', { years: diffInYears, months: diffInMonths }));
  } else {
    strings.push(g('{}-months-old', { months: diffInMonths }));
  }

  // render kg
  strings.push(g('{}-kg', { value: dog.weight }));

  // render activity level
  switch (dog.activityLevel) {
    case 'Mellow':
      strings.push(g('mellow').toLowerCase());
      break;
    case 'Active':
      strings.push(g('active').toLowerCase());
      break;
    case 'VeryActive':
      strings.push(g('very-active').toLowerCase());
      break;
  }

  // render spayed / not spayed
  if (dog.sex === 'M') {
    strings.push(
      g('is-{}', { value: dog.isNeutered ? g('neutered') : g('not-neutered') }).toLowerCase()
    );
  } else {
    strings.push(
      g('is-{}', { value: dog.isNeutered ? g('spayed') : g('not-spayed') }).toLowerCase()
    );
  }

  if ((dog.foodAllergies & FoodAllergies.None) === FoodAllergies.None) {
    strings.push(t('has-no-allergies-food-sensitivities'));
  } else {
    strings.push(t('has-allergies-food-sensitivities'));
  }

  return new Intl.ListFormat('en-US').format(strings) + g('dot');
}

export function addressToSentence(t: useTranslationsReturn, address: UserAddressFragment) {
  const g = useTranslations();
  return [
    address.streetAddress1,
    address.streetAddress2,
    address.city,
    address.countryArea,
    address.country.country,
  ].join(g('comma'));
}
