import { addDays, subMonths, subYears } from 'date-fns';
import { roundTo } from 'round-to';
import { describe, expect, test } from 'vitest';

import {
  calculateDailyCalorieRequirement,
  calculateDailyProtionSize,
  calculateIdealWeight,
  calculateTotalPortionSizeInBox,
  getDerMultiplier,
  getLifeStage,
  isAllergies,
} from './dog';

import {
  ActivityLevel,
  BodyCondition,
  FoodAllergies,
  Frequency,
  MealPlan,
  Recipe,
  Size,
} from '@/enums';
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

const dailyProtionSizeCase1 = calculateDailyCalorieRequirement(
  calculateIdealWeight(0.5, BodyCondition.TooSkinny),
  2,
  MealPlan.Full
);
const dailyProtionSizeCase2 = calculateDailyCalorieRequirement(
  calculateIdealWeight(0.6847, BodyCondition.JustRight),
  2,
  MealPlan.Half
);

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

describe('calculateIdealWeight', () => {
  test('case 1', () => {
    expect(roundTo(calculateIdealWeight(0.5, BodyCondition.TooSkinny), 2)).toBe(0.58);
  });
  test('case 2', () => {
    expect(roundTo(calculateIdealWeight(0.6847, BodyCondition.JustRight), 2)).toBe(0.68);
  });
  test('case 3', () => {
    expect(roundTo(calculateIdealWeight(0.8694, BodyCondition.Rounded), 2)).toBe(0.74);
  });
  test('case 4', () => {
    expect(roundTo(calculateIdealWeight(1.0541, BodyCondition.Chunky), 2)).toBe(0.9);
  });
});

describe('calculateDailyCalorieRequirement', () => {
  test('case 1', () => {
    const idealWeight = calculateIdealWeight(0.5, BodyCondition.TooSkinny);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))).toBe(92);
  });
  test('case 2', () => {
    const idealWeight = calculateIdealWeight(0.6847, BodyCondition.JustRight);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Half))).toBe(53);
  });
  test('case 3', () => {
    const idealWeight = calculateIdealWeight(0.8694, BodyCondition.Rounded);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))).toBe(112);
  });
  test('case 4', () => {
    const idealWeight = calculateIdealWeight(1.0541, BodyCondition.Chunky);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))).toBe(129);
  });
  test('case 5', () => {
    const idealWeight = calculateIdealWeight(3.4552, BodyCondition.TooSkinny);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 1.4, MealPlan.Full))).toBe(276);
  });
  test('case 6', () => {
    const idealWeight = calculateIdealWeight(3.6399, BodyCondition.JustRight);
    expect(Math.round(calculateDailyCalorieRequirement(idealWeight, 1.5, MealPlan.Half))).toBe(138);
  });
});

describe('calculateDailyProtionSize', () => {
  const case1 = calculateDailyCalorieRequirement(
    calculateIdealWeight(0.5, BodyCondition.TooSkinny),
    2,
    MealPlan.Full
  );
  const case2 = calculateDailyCalorieRequirement(
    calculateIdealWeight(0.6847, BodyCondition.JustRight),
    2,
    MealPlan.Half
  );
  test('chicken 1', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Chicken))).toBe(60);
  });
  test('chicken 2', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Chicken))).toBe(34);
  });
  test('beef 1', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Beef))).toBe(61);
  });
  test('beef 2', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Beef))).toBe(35);
  });
  test('pork 1', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Pork))).toBe(71);
  });
  test('pork 2', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Pork))).toBe(41);
  });
  test('lamb 1', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Lamb))).toBe(50);
  });
  test('lamb 2', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Lamb))).toBe(28);
  });
  test('duck 1', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Duck))).toBe(68);
  });
  test('duck 2', () => {
    expect(Math.round(calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Duck))).toBe(39);
  });
});

describe('calculateTotalPortionSizeInBox', () => {
  describe('normal box, order size = 7', () => {
    test('chicken', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(420);
    });
    test('beef', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(429);
    });
    test('pork', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(500);
    });
    test('lamb', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(347);
    });
    test('duck', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(478);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(240);
      expect(Math.round(totalProtionsInBox2)).toBe(184);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(245);
      expect(Math.round(totalProtionsInBox2)).toBe(149);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(286);
      expect(Math.round(totalProtionsInBox2)).toBe(205);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(198);
      expect(Math.round(totalProtionsInBox2)).toBe(205);
    });
  });
  describe('normal box, order size = 14', () => {
    test('chicken', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(840);
    });
    test('beef', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(858);
    });
    test('pork', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(1001);
    });
    test('lamb', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(694);
    });
    test('duck', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox)).toBe(955);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(420);
      expect(Math.round(totalProtionsInBox2)).toBe(429);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(429);
      expect(Math.round(totalProtionsInBox2)).toBe(347);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(500);
      expect(Math.round(totalProtionsInBox2)).toBe(478);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      expect(Math.round(totalProtionsInBox1)).toBe(347);
      expect(Math.round(totalProtionsInBox2)).toBe(478);
    });
  });
  describe('transition box, order size = 14', () => {
    test('chicken', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox)).toBe(660);
    });
    test('beef', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox)).toBe(674);
    });
    test('pork', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox)).toBe(786);
    });
    test('lamb', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox)).toBe(545);
    });
    test('duck', () => {
      const totalProtionsInBox = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox)).toBe(750);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox1)).toBe(330);
      expect(Math.round(totalProtionsInBox2)).toBe(337);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox1)).toBe(337);
      expect(Math.round(totalProtionsInBox2)).toBe(273);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox1)).toBe(393);
      expect(Math.round(totalProtionsInBox2)).toBe(375);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      expect(Math.round(totalProtionsInBox1)).toBe(273);
      expect(Math.round(totalProtionsInBox2)).toBe(375);
    });
  });
});

describe('isAllergies', () => {
  test('chicken', () => {
    expect(isAllergies(Recipe.Chicken, FoodAllergies.Chicken)).toBe(true);
  });
  test('beef', () => {
    expect(isAllergies(Recipe.Beef, FoodAllergies.Beef)).toBe(true);
  });
  test('pork', () => {
    expect(isAllergies(Recipe.Pork, FoodAllergies.Pork)).toBe(true);
  });
  test('lamb', () => {
    expect(isAllergies(Recipe.Lamb, FoodAllergies.Beef)).toBe(true);
    expect(isAllergies(Recipe.Lamb, FoodAllergies.Lamb)).toBe(true);
  });
  test('duck', () => {
    expect(isAllergies(Recipe.Duck, FoodAllergies.Chicken)).toBe(true);
    expect(isAllergies(Recipe.Duck, FoodAllergies.Duck)).toBe(true);
  });
});
