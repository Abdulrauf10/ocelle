import { addDays, subMonths, subYears } from 'date-fns';
import { roundTo } from 'round-to';
import { describe, expect, test } from 'vitest';

import DogHelper from './dog';

import { ActivityLevel, BodyCondition, FoodAllergies, Recipe, Size } from '@/enums';
import { LifeStage } from '@/enums';
import { BreedDto } from '@/types/dto';

const breeds: BreedDto[] = [
  {
    id: 1,
    name: 'small size',
    size: Size.Small,
    uid: '1',
  },
  {
    id: 2,
    name: 'medium size',
    size: Size.Medium,
    uid: '2',
  },
  {
    id: 3,
    name: 'large size',
    size: Size.Large,
    uid: '3',
  },
];

const lessThan12Months = addDays(subMonths(new Date(), 12), 1);
const lessThan16Months = addDays(subMonths(new Date(), 16), 1);
const exact12Months = subMonths(new Date(), 12);
const exact16Months = subMonths(new Date(), 16);
const lessThan5Years = addDays(subYears(new Date(), 5), 1);
const lessThan7Years = addDays(subYears(new Date(), 7), 1);
const lessThan9Years = addDays(subYears(new Date(), 9), 1);
const exact5Years = subYears(new Date(), 5);
const exact7Years = subYears(new Date(), 7);
const exact9Years = subYears(new Date(), 9);

describe('getLifeStage', () => {
  test('isPuppy 1', () => {
    expect(DogHelper.getLifeStage([breeds[0]], lessThan12Months)).toBe(LifeStage.Puppy);
  });
  test('isPuppy 2', () => {
    expect(DogHelper.getLifeStage([breeds[1]], lessThan12Months)).toBe(LifeStage.Puppy);
  });
  test('isPuppy 3', () => {
    expect(DogHelper.getLifeStage([breeds[2]], lessThan16Months)).toBe(LifeStage.Puppy);
  });
  test('isPuppy 4', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[1]], lessThan12Months)).toBe(LifeStage.Puppy);
  });
  test('isPuppy 5', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[2]], lessThan12Months)).toBe(LifeStage.Puppy);
  });
  test('isPuppy 6', () => {
    expect(DogHelper.getLifeStage([breeds[1], breeds[2]], lessThan16Months)).toBe(LifeStage.Puppy);
  });

  test('isAdult 1', () => {
    expect(DogHelper.getLifeStage([breeds[0]], exact12Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 2', () => {
    expect(DogHelper.getLifeStage([breeds[0]], lessThan9Years)).toBe(LifeStage.Adult);
  });
  test('isAdult 3', () => {
    expect(DogHelper.getLifeStage([breeds[1]], exact12Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 4', () => {
    expect(DogHelper.getLifeStage([breeds[1]], lessThan7Years)).toBe(LifeStage.Adult);
  });
  test('isAdult 5', () => {
    expect(DogHelper.getLifeStage([breeds[2]], exact16Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 6', () => {
    expect(DogHelper.getLifeStage([breeds[2]], lessThan5Years)).toBe(LifeStage.Adult);
  });
  test('isAdult 7', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[1]], exact12Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 8', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[1]], lessThan7Years)).toBe(LifeStage.Adult);
  });
  test('isAdult 9', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[2]], exact12Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 10', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[2]], lessThan7Years)).toBe(LifeStage.Adult);
  });
  test('isAdult 11', () => {
    expect(DogHelper.getLifeStage([breeds[1], breeds[2]], exact16Months)).toBe(LifeStage.Adult);
  });
  test('isAdult 12', () => {
    expect(DogHelper.getLifeStage([breeds[1], breeds[2]], lessThan5Years)).toBe(LifeStage.Adult);
  });

  test('isSenior 1', () => {
    expect(DogHelper.getLifeStage([breeds[0]], exact9Years)).toBe(LifeStage.Senior);
  });
  test('isSenior 2', () => {
    expect(DogHelper.getLifeStage([breeds[1]], exact7Years)).toBe(LifeStage.Senior);
  });
  test('isSenior 3', () => {
    expect(DogHelper.getLifeStage([breeds[2]], exact5Years)).toBe(LifeStage.Senior);
  });
  test('isSenior 4', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[1]], exact7Years)).toBe(LifeStage.Senior);
  });
  test('isSenior 5', () => {
    expect(DogHelper.getLifeStage([breeds[0], breeds[2]], exact7Years)).toBe(LifeStage.Senior);
  });
  test('isSenior 6', () => {
    expect(DogHelper.getLifeStage([breeds[1], breeds[2]], exact5Years)).toBe(LifeStage.Senior);
  });
});

describe('getDerMultiplier', () => {
  test('puppy to be equal 2.0', () => {
    expect(
      DogHelper.getDerMultiplier([breeds[0]], lessThan12Months, false, ActivityLevel.Mellow)
    ).toBe(2);
  });
  test('equal 1.1', () => {
    expect(DogHelper.getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.Mellow)).toBe(
      1.1
    );
  });
  test('equal 1.2', () => {
    expect(
      DogHelper.getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.Mellow)
    ).toBe(1.2);
  });
  test('equal 1.4', () => {
    expect(DogHelper.getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.Active)).toBe(
      1.4
    );
  });
  test('equal 1.5', () => {
    expect(
      DogHelper.getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.Active)
    ).toBe(1.5);
  });
  test('equal 1.6', () => {
    expect(
      DogHelper.getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.VeryActive)
    ).toBe(1.6);
  });
  test('equal 1.8', () => {
    expect(
      DogHelper.getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.VeryActive)
    ).toBe(1.8);
  });
});

describe('calculateIdealWeight', () => {
  test('case 1', () => {
    expect(roundTo(DogHelper.calculateIdealWeight(0.5, BodyCondition.TooSkinny), 2)).toBe(0.58);
  });
  test('case 2', () => {
    expect(roundTo(DogHelper.calculateIdealWeight(0.6847, BodyCondition.JustRight), 2)).toBe(0.68);
  });
  test('case 3', () => {
    expect(roundTo(DogHelper.calculateIdealWeight(0.8694, BodyCondition.Rounded), 2)).toBe(0.74);
  });
  test('case 4', () => {
    expect(roundTo(DogHelper.calculateIdealWeight(1.0541, BodyCondition.Chunky), 2)).toBe(0.9);
  });
});

describe('isAllergies', () => {
  test('chicken', () => {
    expect(DogHelper.isAllergies(Recipe.Chicken, FoodAllergies.Chicken)).toBe(true);
  });
  test('beef', () => {
    expect(DogHelper.isAllergies(Recipe.Beef, FoodAllergies.Beef)).toBe(true);
  });
  test('pork', () => {
    expect(DogHelper.isAllergies(Recipe.Pork, FoodAllergies.Pork)).toBe(true);
  });
  test('lamb', () => {
    expect(DogHelper.isAllergies(Recipe.Lamb, FoodAllergies.Beef)).toBe(true);
    expect(DogHelper.isAllergies(Recipe.Lamb, FoodAllergies.Lamb)).toBe(true);
  });
  test('duck', () => {
    expect(DogHelper.isAllergies(Recipe.Duck, FoodAllergies.Chicken)).toBe(true);
    expect(DogHelper.isAllergies(Recipe.Duck, FoodAllergies.Duck)).toBe(true);
  });
});
