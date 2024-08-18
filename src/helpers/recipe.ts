import Decimal from 'decimal.js';
import { roundToDown } from 'round-to';

import DogHelper from './dog';

import {
  ActivityLevel,
  BodyCondition,
  FoodAllergies,
  Frequency,
  MealPlan,
  Pickiness,
  Recipe,
} from '@/enums';
import { BreedDto } from '@/types/dto';

export default class RecipeHelper {
  /**
   * Refer to `Excel: customization variables v1.01 > Price Matrix`
   * Priorities order by cheaply
   */
  static priorities = {
    [Recipe.Pork]: 1,
    [Recipe.Chicken]: 2,
    [Recipe.Beef]: 3,
    [Recipe.Lamb]: 4,
    [Recipe.Duck]: 5,
  };
  static getSlug(recipe: Recipe) {
    switch (recipe) {
      case Recipe.Chicken:
        return 'chicken';
      case Recipe.Beef:
        return 'beef';
      case Recipe.Duck:
        return 'duck';
      case Recipe.Lamb:
        return 'lamb';
      case Recipe.Pork:
        return 'pork';
    }
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static calculateDailyCalorieRequirement(
    idealWeight: number,
    derMultiplier: number,
    plan: MealPlan
  ) {
    return 70 * Math.pow(idealWeight, 0.75) * derMultiplier * (plan === MealPlan.Half ? 0.5 : 1);
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   *
   * Round Down 1DP
   */
  static calculateDailyProtionSize(requiredDailyCalorie: number, recipe: Recipe) {
    switch (recipe) {
      case Recipe.Chicken:
        return roundToDown((requiredDailyCalorie / 1540) * 1000, 1);
      case Recipe.Beef:
        return roundToDown((requiredDailyCalorie / 1508) * 1000, 1);
      case Recipe.Pork:
        return roundToDown((requiredDailyCalorie / 1293) * 1000, 1);
      case Recipe.Lamb:
        return roundToDown((requiredDailyCalorie / 1865) * 1000, 1);
      case Recipe.Duck:
        return roundToDown((requiredDailyCalorie / 1355) * 1000, 1);
    }
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static calculateTotalDaysInBox(
    recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
    frequency: Frequency,
    transitionPeriod: boolean
  ) {
    const { recipeToBeCalcuate, recipeReference } = recipes;
    const totalRecipes = recipeReference ? 2 : 1;
    // transitionPeriod only availabel 14 days box
    if (transitionPeriod) {
      return {
        transitionPeriodDays: 6 / totalRecipes,
        normalDays: 8 / totalRecipes,
      };
    }
    // recipes === 2
    if (recipeReference) {
      if (frequency === Frequency.OneWeek) {
        return {
          transitionPeriodDays: 0,
          normalDays:
            this.priorities[recipeToBeCalcuate] < this.priorities[recipeReference] ? 4 : 3,
        };
      }
      if (frequency === Frequency.TwoWeek) {
        return {
          transitionPeriodDays: 0,
          normalDays: 7,
        };
      }
    }
    // recipe === 1
    return {
      transitionPeriodDays: 0,
      normalDays: frequency === Frequency.TwoWeek ? 14 : 7,
    };
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static calculateTotalPortionSizeInBox(
    requiredDailyCalorie: number,
    recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
    frequency: Frequency,
    transitionPeriod: boolean
  ) {
    const { recipeToBeCalcuate } = recipes;
    const dailyProtionSize = new Decimal(
      this.calculateDailyProtionSize(requiredDailyCalorie, recipeToBeCalcuate)
    );
    const { transitionPeriodDays, normalDays } = this.calculateTotalDaysInBox(
      recipes,
      frequency,
      transitionPeriod
    );
    if (transitionPeriodDays > 0) {
      return dailyProtionSize
        .times(0.5 * transitionPeriodDays)
        .plus(dailyProtionSize.times(normalDays))
        .toNumber();
    }
    return dailyProtionSize.times(normalDays).toNumber();
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Price Matrix`
   */
  static calculateRecipeTotalProtionsInBox(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
    plan: MealPlan,
    frequency: Frequency,
    transitionPeriod: boolean
  ) {
    const idealWeight = DogHelper.calculateIdealWeight(currentWeight, condition);
    const derMultiplier = DogHelper.getDerMultiplier(breeds, dateOfBirth, neutered, activityLevel);
    const requiredDailyCalorie = this.calculateDailyCalorieRequirement(
      idealWeight,
      derMultiplier,
      plan
    );
    const totalOrderPortionSize = this.calculateTotalPortionSizeInBox(
      requiredDailyCalorie,
      recipes,
      frequency,
      transitionPeriod
    );
    return totalOrderPortionSize;
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Product Recommendations`
   *
   * TODO: confirmation of recommended recipes, re-checking of the recipes
   */
  static isRecommended(
    recipe: Recipe,
    pickiness: Pickiness,
    level: ActivityLevel,
    condition: BodyCondition,
    allergies: FoodAllergies
  ) {
    if (DogHelper.isAllergies(recipe, allergies)) {
      return false;
    }
    switch (recipe) {
      case Recipe.Chicken: {
        if (
          (pickiness === Pickiness.Picky || pickiness === Pickiness.GoodEater) &&
          level !== ActivityLevel.Mellow &&
          (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight)
        ) {
          return true;
        }
        if (
          pickiness === Pickiness.GoodEater &&
          level === ActivityLevel.Mellow &&
          condition === BodyCondition.TooSkinny
        ) {
          return true;
        }
        if (
          pickiness === Pickiness.EatAnything &&
          !(
            level === ActivityLevel.Mellow &&
            (condition === BodyCondition.Rounded || condition === BodyCondition.Chunky)
          )
        ) {
          return true;
        }
        return false;
      }
      case Recipe.Beef: {
        if (
          pickiness === Pickiness.Picky &&
          !(
            level === ActivityLevel.Mellow &&
            (condition === BodyCondition.Rounded || condition === BodyCondition.Chunky)
          )
        ) {
          return true;
        }
        if (pickiness === Pickiness.GoodEater) {
          return true;
        }
        if (
          pickiness === Pickiness.EatAnything &&
          level !== ActivityLevel.Mellow &&
          (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight)
        ) {
          return true;
        }
        return false;
      }
      case Recipe.Pork: {
        if (condition === BodyCondition.Rounded || condition === BodyCondition.Chunky) {
          return true;
        }
        if (
          (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight) &&
          level === ActivityLevel.Mellow
        ) {
          return true;
        }
        if (
          pickiness === Pickiness.GoodEater &&
          level === ActivityLevel.Active &&
          condition === BodyCondition.JustRight
        ) {
          return true;
        }
        return false;
      }
      case Recipe.Lamb: {
        if (
          level === ActivityLevel.VeryActive &&
          (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight)
        ) {
          return true;
        }
        if (
          pickiness !== Pickiness.EatAnything &&
          level === ActivityLevel.Active &&
          condition === BodyCondition.TooSkinny
        ) {
          return true;
        }
        if (
          pickiness === Pickiness.Picky &&
          level === ActivityLevel.Active &&
          condition === BodyCondition.JustRight
        ) {
          return true;
        }
        return false;
      }
      case Recipe.Duck: {
        if (condition === BodyCondition.Rounded || condition === BodyCondition.Chunky) {
          return true;
        }
        if (
          pickiness === Pickiness.Picky &&
          level === ActivityLevel.Mellow &&
          (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight)
        ) {
          return true;
        }
        if (
          pickiness === Pickiness.GoodEater &&
          level === ActivityLevel.Mellow &&
          condition === BodyCondition.JustRight
        ) {
          return true;
        }
        if (pickiness === Pickiness.EatAnything && level !== ActivityLevel.VeryActive) {
          return true;
        }
        return false;
      }
    }
  }
}
