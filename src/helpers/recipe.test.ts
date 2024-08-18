import { describe, expect, test } from 'vitest';

import DogHelper from './dog';
import RecipeHelper from './recipe';

import {
  ActivityLevel,
  BodyCondition,
  FoodAllergies,
  Frequency,
  MealPlan,
  Pickiness,
  Recipe,
} from '@/enums';

const dailyProtionSizeCase1 = RecipeHelper.calculateDailyCalorieRequirement(
  DogHelper.calculateIdealWeight(0.5, BodyCondition.TooSkinny),
  2,
  MealPlan.Full
);
const dailyProtionSizeCase2 = RecipeHelper.calculateDailyCalorieRequirement(
  DogHelper.calculateIdealWeight(0.68, BodyCondition.JustRight),
  2,
  MealPlan.Half
);

describe('calculateDailyCalorieRequirement', () => {
  test('case 1', () => {
    const idealWeight = DogHelper.calculateIdealWeight(0.5, BodyCondition.TooSkinny);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))
    ).toBe(92);
  });
  test('case 2', () => {
    const idealWeight = DogHelper.calculateIdealWeight(0.6847, BodyCondition.JustRight);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Half))
    ).toBe(53);
  });
  test('case 3', () => {
    const idealWeight = DogHelper.calculateIdealWeight(0.8694, BodyCondition.Rounded);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))
    ).toBe(112);
  });
  test('case 4', () => {
    const idealWeight = DogHelper.calculateIdealWeight(1.0541, BodyCondition.Chunky);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 2, MealPlan.Full))
    ).toBe(129);
  });
  test('case 5', () => {
    const idealWeight = DogHelper.calculateIdealWeight(3.4552, BodyCondition.TooSkinny);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 1.4, MealPlan.Full))
    ).toBe(276);
  });
  test('case 6', () => {
    const idealWeight = DogHelper.calculateIdealWeight(3.6399, BodyCondition.JustRight);
    expect(
      Math.round(RecipeHelper.calculateDailyCalorieRequirement(idealWeight, 1.5, MealPlan.Half))
    ).toBe(138);
  });
});

describe('calculateDailyProtionSize', () => {
  test('chicken 1', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Chicken)).toBe(60);
  });
  test('chicken 2', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Chicken)).toBe(34);
  });
  test('beef 1', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Beef)).toBe(61.3);
  });
  test('beef 2', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Beef)).toBe(34.7);
  });
  test('pork 1', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Pork)).toBe(71.4);
  });
  test('pork 2', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Pork)).toBe(40.5);
  });
  test('lamb 1', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Lamb)).toBe(49.5);
  });
  test('lamb 2', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Lamb)).toBe(28.1);
  });
  test('duck 1', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase1, Recipe.Duck)).toBe(68.2);
  });
  test('duck 2', () => {
    expect(RecipeHelper.calculateDailyProtionSize(dailyProtionSizeCase2, Recipe.Duck)).toBe(38.6);
  });
});

describe('calculateTotalPortionSizeInBox', () => {
  describe('normal box, order size = 7', () => {
    test('chicken', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox).toBe(420);
    });
    test('beef', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox).toBe(429.1);
    });
    test('pork', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox).toBe(499.8);
    });
    test('lamb', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox).toBe(346.5);
    });
    test('duck', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox).toBe(477.4);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(240);
      expect(totalProtionsInBox2).toBe(183.9);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(245.2);
      expect(totalProtionsInBox2).toBe(148.5);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(285.6);
      expect(totalProtionsInBox2).toBe(204.6);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.OneWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.OneWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(198);
      expect(totalProtionsInBox2).toBe(204.6);
    });
  });
  describe('normal box, order size = 14', () => {
    test('chicken', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox).toBe(840);
    });
    test('beef', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox).toBe(858.2);
    });
    test('pork', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox).toBe(999.6);
    });
    test('lamb', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox).toBe(693);
    });
    test('duck', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox).toBe(954.8);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(420);
      expect(totalProtionsInBox2).toBe(429.1);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(429.1);
      expect(totalProtionsInBox2).toBe(346.5);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(499.8);
      expect(totalProtionsInBox2).toBe(477.4);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        false
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        false
      );
      expect(totalProtionsInBox1).toBe(346.5);
      expect(totalProtionsInBox2).toBe(477.4);
    });
  });
  describe('transition box, order size = 14', () => {
    test('chicken', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox).toBe(660);
    });
    test('beef', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox).toBe(674.3);
    });
    test('pork', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox).toBe(785.4);
    });
    test('lamb', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox).toBe(544.5);
    });
    test('duck', () => {
      const totalProtionsInBox = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox).toBe(750.2);
    });
    test('chicken + beef', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Chicken, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Chicken },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox1).toBe(330);
      expect(totalProtionsInBox2).toBe(337.15);
    });
    test('beef + lamb', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Beef, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Beef },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox1).toBe(337.15);
      expect(totalProtionsInBox2).toBe(272.25);
    });
    test('pork + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Pork, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Pork },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox1).toBe(392.7);
      expect(totalProtionsInBox2).toBe(375.1);
    });
    test('lamb + duck', () => {
      const totalProtionsInBox1 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Lamb, recipeReference: Recipe.Duck },
        Frequency.TwoWeek,
        true
      );
      const totalProtionsInBox2 = RecipeHelper.calculateTotalPortionSizeInBox(
        dailyProtionSizeCase1,
        { recipeToBeCalcuate: Recipe.Duck, recipeReference: Recipe.Lamb },
        Frequency.TwoWeek,
        true
      );
      expect(totalProtionsInBox1).toBe(272.25);
      expect(totalProtionsInBox2).toBe(375.1);
    });
  });
});

const isRecommendedCases = describe.each([
  [
    Pickiness.Picky,
    ActivityLevel.Mellow,
    BodyCondition.TooSkinny,
    [false, true, true, false, true],
  ],
  [
    Pickiness.Picky,
    ActivityLevel.Mellow,
    BodyCondition.JustRight,
    [false, true, true, false, true],
  ],
  [Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Rounded, [false, false, true, false, true]],
  [Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Chunky, [false, false, true, false, true]],
  [
    Pickiness.Picky,
    ActivityLevel.Active,
    BodyCondition.TooSkinny,
    [true, true, false, true, false],
  ],
  [
    Pickiness.Picky,
    ActivityLevel.Active,
    BodyCondition.JustRight,
    [true, true, false, true, false],
  ],
  [Pickiness.Picky, ActivityLevel.Active, BodyCondition.Rounded, [false, true, true, false, true]],
  [Pickiness.Picky, ActivityLevel.Active, BodyCondition.Chunky, [false, true, true, false, true]],
  [
    Pickiness.Picky,
    ActivityLevel.VeryActive,
    BodyCondition.TooSkinny,
    [true, true, false, true, false],
  ],
  [
    Pickiness.Picky,
    ActivityLevel.VeryActive,
    BodyCondition.JustRight,
    [true, true, false, true, false],
  ],
  [
    Pickiness.Picky,
    ActivityLevel.VeryActive,
    BodyCondition.Rounded,
    [false, true, true, false, true],
  ],
  [
    Pickiness.Picky,
    ActivityLevel.VeryActive,
    BodyCondition.Chunky,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Mellow,
    BodyCondition.TooSkinny,
    [true, true, true, false, false],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Mellow,
    BodyCondition.JustRight,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Mellow,
    BodyCondition.Rounded,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Mellow,
    BodyCondition.Chunky,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Active,
    BodyCondition.TooSkinny,
    [true, true, false, true, false],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Active,
    BodyCondition.JustRight,
    [true, true, true, false, false],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Active,
    BodyCondition.Rounded,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.Active,
    BodyCondition.Chunky,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.VeryActive,
    BodyCondition.TooSkinny,
    [true, true, false, true, false],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.VeryActive,
    BodyCondition.JustRight,
    [true, true, false, true, false],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.VeryActive,
    BodyCondition.Rounded,
    [false, true, true, false, true],
  ],
  [
    Pickiness.GoodEater,
    ActivityLevel.VeryActive,
    BodyCondition.Chunky,
    [false, true, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Mellow,
    BodyCondition.TooSkinny,
    [true, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Mellow,
    BodyCondition.JustRight,
    [true, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Mellow,
    BodyCondition.Rounded,
    [false, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Mellow,
    BodyCondition.Chunky,
    [false, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Active,
    BodyCondition.TooSkinny,
    [true, true, false, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Active,
    BodyCondition.JustRight,
    [true, true, false, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Active,
    BodyCondition.Rounded,
    [true, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.Active,
    BodyCondition.Chunky,
    [true, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.VeryActive,
    BodyCondition.TooSkinny,
    [true, true, false, true, false],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.VeryActive,
    BodyCondition.JustRight,
    [true, true, false, true, false],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.VeryActive,
    BodyCondition.Rounded,
    [true, false, true, false, true],
  ],
  [
    Pickiness.EatAnything,
    ActivityLevel.VeryActive,
    BodyCondition.Chunky,
    [true, false, true, false, true],
  ],
]);

describe('isRecommended', () => {
  isRecommendedCases(
    'pickness: %s, activityLevel: %s, bodyCondition: %s',
    (pickness, activityLevel, bodyCondition, [chicken, beef, pork, lamb, duck]) => {
      test('chicken', () => {
        expect(
          RecipeHelper.isRecommended(
            Recipe.Chicken,
            pickness,
            activityLevel,
            bodyCondition,
            FoodAllergies.None
          )
        ).toBe(chicken);
      });
      test('beef', () => {
        expect(
          RecipeHelper.isRecommended(
            Recipe.Beef,
            pickness,
            activityLevel,
            bodyCondition,
            FoodAllergies.None
          )
        ).toBe(beef);
      });
      test('pork', () => {
        expect(
          RecipeHelper.isRecommended(
            Recipe.Pork,
            pickness,
            activityLevel,
            bodyCondition,
            FoodAllergies.None
          )
        ).toBe(pork);
      });
      test('lamb', () => {
        expect(
          RecipeHelper.isRecommended(
            Recipe.Lamb,
            pickness,
            activityLevel,
            bodyCondition,
            FoodAllergies.None
          )
        ).toBe(lamb);
      });
      test('duck', () => {
        expect(
          RecipeHelper.isRecommended(
            Recipe.Duck,
            pickness,
            activityLevel,
            bodyCondition,
            FoodAllergies.None
          )
        ).toBe(duck);
      });
    }
  );
});
