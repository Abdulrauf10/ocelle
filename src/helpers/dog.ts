import { differenceInMonths, differenceInYears, startOfDay, subMonths, subYears } from 'date-fns';

import {
  ActivityLevel,
  BodyCondition,
  FoodAllergies,
  Frequency,
  MealPlan,
  Pickiness,
  Recipe,
  Size,
} from '@/enums';
import { LifeStage } from '@/types';
import { BreedDto } from '@/types/dto';

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 * Priorities order by cheaply
 */
const recipePriorities = {
  [Recipe.Pork]: 1,
  [Recipe.Chicken]: 2,
  [Recipe.Beef]: 3,
  [Recipe.Lamb]: 4,
  [Recipe.Duck]: 5,
};

export function getTheCheapestRecipe() {
  let cheapest: Recipe = Recipe.Beef;
  for (const _recipe of Object.keys(recipePriorities)) {
    const recipe = Recipe[_recipe as keyof typeof Recipe];
    if (recipePriorities[recipe] < recipePriorities[cheapest]) {
      cheapest = recipe;
    }
  }
  return cheapest;
}

export function getDateOfBirth({ years, months }: { years: number; months: number }) {
  return subMonths(subYears(startOfDay(new Date()), years ?? 0), months ?? 0);
}

export function getRecipeSlug(recipe: Recipe) {
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

function isExactSize(breeds: BreedDto[], sizes: Array<Size>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length === breeds.length;
}

function isContainsSize(breeds: BreedDto[], sizes: Array<Size>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length > -1;
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function getLifeStage(breeds: BreedDto[], dateOfBirth: Date): LifeStage {
  const ageM = differenceInMonths(dateOfBirth, new Date());
  const ageY = differenceInYears(dateOfBirth, new Date());

  // Puppy
  if (isExactSize(breeds, [Size.Small])) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 9) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, [Size.Medium]) || breeds.length === 0) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, [Size.Large])) {
    if (ageM < 16) return 'Puppy';
    else if (ageM >= 16 && ageY < 5) return 'Adult';
    else return 'Senior';
  }

  if (isContainsSize(breeds, [Size.Small]) && isContainsSize(breeds, [Size.Medium, Size.Large])) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isContainsSize(breeds, [Size.Medium]) && isContainsSize(breeds, [Size.Large])) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 5) return 'Adult';
    else return 'Senior';
  }

  console.dir(breeds, { depth: null });
  throw new Error('cannot calculate the life stage');
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 * @deprecated v1.01
 */
export function isYoungPuppy(birth: Date) {
  const age = differenceInMonths(birth, new Date());
  return age < 4;
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function getWeightModifier(condition: BodyCondition) {
  if (condition === BodyCondition.TooSkinny) return 1.15;
  else if (condition === BodyCondition.JustRight) return 1;
  else return 0.85;
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateIdealWeight(currentWeight: number, condition: BodyCondition) {
  return currentWeight * getWeightModifier(condition);
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function getDerMultiplier(
  breeds: BreedDto[],
  dateOfBirth: Date,
  neutered: boolean,
  activityLevel: ActivityLevel
) {
  const stage = getLifeStage(breeds, dateOfBirth);
  if (stage === 'Puppy') {
    return 2;
  }
  if (activityLevel === ActivityLevel.Mellow) {
    return neutered ? 1.1 : 1.2;
  } else if (activityLevel === ActivityLevel.Active) {
    return neutered ? 1.4 : 1.5;
  } else {
    return neutered ? 1.6 : 1.8;
  }
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateDailyCalorieRequirement(
  idealWeight: number,
  derMultiplier: number,
  plan: MealPlan
) {
  return 70 * Math.pow(idealWeight, 0.75) * derMultiplier * (plan === MealPlan.Half ? 0.5 : 1);
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateDailyProtionSize(requiredDailyCalorie: number, recipe: Recipe) {
  switch (recipe) {
    case Recipe.Chicken:
      return (requiredDailyCalorie / 1540) * 1000;
    case Recipe.Beef:
      return (requiredDailyCalorie / 1508) * 1000;
    case Recipe.Pork:
      return (requiredDailyCalorie / 1293) * 1000;
    case Recipe.Lamb:
      return (requiredDailyCalorie / 1865) * 1000;
    case Recipe.Duck:
      return (requiredDailyCalorie / 1355) * 1000;
  }
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateTotalDaysInBox(
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  frequency: Frequency,
  transitionPeriod: boolean
) {
  const { recipeToBeCalcuate, recipeReference } = recipes;
  const totalRecipes = recipeReference ? 2 : 1;
  if (transitionPeriod) {
    return {
      transitionPeriodDays: 6 / totalRecipes,
      normalDays: 8 / totalRecipes,
    };
  }
  if (frequency === Frequency.OneWeek && recipeReference) {
    return {
      transitionPeriodDays: 0,
      normalDays: recipePriorities[recipeToBeCalcuate] > recipePriorities[recipeReference] ? 4 : 3,
    };
  }
  return {
    transitionPeriodDays: 0,
    normalDays: frequency === Frequency.TwoWeek ? 14 : 7,
  };
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateTotalPortionSizeInBox(
  requiredDailyCalorie: number,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  frequency: Frequency,
  transitionPeriod: boolean
) {
  const { recipeToBeCalcuate } = recipes;
  const dailyProtionSize = calculateDailyProtionSize(requiredDailyCalorie, recipeToBeCalcuate);
  const { transitionPeriodDays, normalDays } = calculateTotalDaysInBox(
    recipes,
    frequency,
    transitionPeriod
  );
  if (transitionPeriodDays > 0) {
    return dailyProtionSize * 0.5 * transitionPeriodDays + dailyProtionSize * normalDays;
  }
  return dailyProtionSize * normalDays;
}

export function isAllergies(recipe: Recipe, allergies: FoodAllergies) {
  switch (recipe) {
    case Recipe.Chicken:
      return (allergies & FoodAllergies.Chicken) === FoodAllergies.Chicken;
    case Recipe.Beef:
      return (allergies & FoodAllergies.Beef) === FoodAllergies.Beef;
    case Recipe.Pork:
      return (allergies & FoodAllergies.Pork) === FoodAllergies.Pork;
    case Recipe.Lamb:
      return (
        (allergies & FoodAllergies.Beef) === FoodAllergies.Beef ||
        (allergies & FoodAllergies.Lamb) === FoodAllergies.Lamb
      );
    case Recipe.Duck:
      return (
        (allergies & FoodAllergies.Chicken) === FoodAllergies.Chicken ||
        (allergies & FoodAllergies.Duck) === FoodAllergies.Duck
      );
  }
}

/**
 * Refer to `Excel: customization variables v1.01 > Product Recommendations`
 *
 * TODO: confirmation of recommended recipes, re-checking of the recipes
 */
export function isRecommendedRecipe(
  recipe: Recipe,
  pickiness: Pickiness,
  level: ActivityLevel,
  condition: BodyCondition,
  allergies: FoodAllergies
) {
  if (isAllergies(recipe, allergies)) {
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
        level !== ActivityLevel.Mellow &&
        condition !== BodyCondition.Rounded &&
        condition !== BodyCondition.Chunky
      ) {
        return true;
      }
      return false;
    }
    case Recipe.Beef: {
      if (
        pickiness === Pickiness.Picky &&
        level !== ActivityLevel.Mellow &&
        (condition === BodyCondition.TooSkinny || condition === BodyCondition.JustRight)
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

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 */
export function calculateRecipeTotalProtionsInBox(
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
  const idealWeight = calculateIdealWeight(currentWeight, condition);
  const derMultiplier = getDerMultiplier(breeds, dateOfBirth, neutered, activityLevel);
  const requiredDailyCalorie = calculateDailyCalorieRequirement(idealWeight, derMultiplier, plan);
  const totalOrderPortionSize = calculateTotalPortionSizeInBox(
    requiredDailyCalorie,
    recipes,
    frequency,
    transitionPeriod
  );
  return totalOrderPortionSize;
}
