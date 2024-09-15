import { differenceInMonths, differenceInYears, format, subYears } from 'date-fns';
import { getLocale, getTranslations } from 'next-intl/server';

import { Dog } from '@/entities';
import { ActivityLevel, FoodAllergies } from '@/enums';
import { UserAddressFragment } from '@/gql/graphql';

export default async function getSentence() {
  const t = await getTranslations();
  const locale = await getLocale();

  return {
    dog(dog: Dog) {
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
      strings.push(t('weight-{}-kg', { value: dog.weight }));

      // render activity level
      switch (dog.activityLevel) {
        case ActivityLevel.Mellow:
          strings.push(t('mellow').toLowerCase());
          break;
        case ActivityLevel.Active:
          strings.push(t('active').toLowerCase());
          break;
        case ActivityLevel.VeryActive:
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

      strings.push(
        t('has-{}-allergies-food-sensitivities', {
          allergy: (dog.foodAllergies & FoodAllergies.None) === FoodAllergies.None ? 'no' : 'yes',
        })
      );

      return strings.join(t('comma')) + t('dot');
    },
    array(array: string[]) {
      return array.join(t('comma')) + t('dot');
    },
    address(address: UserAddressFragment) {
      return new Intl.ListFormat('en-US').format(
        address.streetAddress2.length === 0
          ? [address.streetAddress1, address.city, address.countryArea, address.country.country]
          : [
              address.streetAddress1,
              address.streetAddress2,
              address.city,
              address.countryArea,
              address.country.country,
            ]
      );
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
  };
}
