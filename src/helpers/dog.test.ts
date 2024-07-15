import { addDays, subMonths, subYears } from 'date-fns';
import { describe, expect, test } from 'vitest';

import { getDerMultiplier, getLifeStage } from './dog';

import { ActivityLevel, Size } from '@/enums';
import { LifeStage } from '@/types';
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
    expect(getLifeStage([breeds[0]], lessThan12Months)).toBe<LifeStage>('Puppy');
  });
  test('isPuppy 2', () => {
    expect(getLifeStage([breeds[1]], lessThan12Months)).toBe<LifeStage>('Puppy');
  });
  test('isPuppy 3', () => {
    expect(getLifeStage([breeds[2]], lessThan16Months)).toBe<LifeStage>('Puppy');
  });
  test('isPuppy 4', () => {
    expect(getLifeStage([breeds[0], breeds[1]], lessThan12Months)).toBe<LifeStage>('Puppy');
  });
  test('isPuppy 5', () => {
    expect(getLifeStage([breeds[0], breeds[2]], lessThan12Months)).toBe<LifeStage>('Puppy');
  });
  test('isPuppy 6', () => {
    expect(getLifeStage([breeds[1], breeds[2]], lessThan16Months)).toBe<LifeStage>('Puppy');
  });

  test('isAdult 1', () => {
    expect(getLifeStage([breeds[0]], exact12Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 2', () => {
    expect(getLifeStage([breeds[0]], lessThan9Years)).toBe<LifeStage>('Adult');
  });
  test('isAdult 3', () => {
    expect(getLifeStage([breeds[1]], exact12Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 4', () => {
    expect(getLifeStage([breeds[1]], lessThan7Years)).toBe<LifeStage>('Adult');
  });
  test('isAdult 5', () => {
    expect(getLifeStage([breeds[2]], exact16Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 6', () => {
    expect(getLifeStage([breeds[2]], lessThan5Years)).toBe<LifeStage>('Adult');
  });
  test('isAdult 7', () => {
    expect(getLifeStage([breeds[0], breeds[1]], exact12Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 8', () => {
    expect(getLifeStage([breeds[0], breeds[1]], lessThan7Years)).toBe<LifeStage>('Adult');
  });
  test('isAdult 9', () => {
    expect(getLifeStage([breeds[0], breeds[2]], exact12Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 10', () => {
    expect(getLifeStage([breeds[0], breeds[2]], lessThan7Years)).toBe<LifeStage>('Adult');
  });
  test('isAdult 11', () => {
    expect(getLifeStage([breeds[1], breeds[2]], exact16Months)).toBe<LifeStage>('Adult');
  });
  test('isAdult 12', () => {
    expect(getLifeStage([breeds[1], breeds[2]], lessThan5Years)).toBe<LifeStage>('Adult');
  });

  test('isSenior 1', () => {
    expect(getLifeStage([breeds[0]], exact9Years)).toBe<LifeStage>('Senior');
  });
  test('isSenior 2', () => {
    expect(getLifeStage([breeds[1]], exact7Years)).toBe<LifeStage>('Senior');
  });
  test('isSenior 3', () => {
    expect(getLifeStage([breeds[2]], exact5Years)).toBe<LifeStage>('Senior');
  });
  test('isSenior 4', () => {
    expect(getLifeStage([breeds[0], breeds[1]], exact7Years)).toBe<LifeStage>('Senior');
  });
  test('isSenior 5', () => {
    expect(getLifeStage([breeds[0], breeds[2]], exact7Years)).toBe<LifeStage>('Senior');
  });
  test('isSenior 6', () => {
    expect(getLifeStage([breeds[1], breeds[2]], exact5Years)).toBe<LifeStage>('Senior');
  });
});

describe('getDerMultiplier', () => {
  test('puppy to be equal 2.0', () => {
    expect(getDerMultiplier([breeds[0]], lessThan12Months, false, ActivityLevel.Mellow)).toBe(2);
  });
  test('equal 1.1', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.Mellow)).toBe(1.1);
  });
  test('equal 1.2', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.Mellow)).toBe(1.2);
  });
  test('equal 1.4', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.Active)).toBe(1.4);
  });
  test('equal 1.5', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.Active)).toBe(1.5);
  });
  test('equal 1.6', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, true, ActivityLevel.VeryActive)).toBe(1.6);
  });
  test('equal 1.8', () => {
    expect(getDerMultiplier([breeds[0]], exact12Months, false, ActivityLevel.VeryActive)).toBe(1.8);
  });
});
