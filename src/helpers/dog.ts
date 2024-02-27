import { Breed } from '@/entities';
import { FoodAllergies, MealPlan, OrderSize, Recipe } from '@/enums';
import { ActivityLevel, BodyCondition, BreedSize, LifeStage, Pickiness } from '@/types';
import { differenceInMonths, differenceInYears } from 'date-fns';

function isExactSize(breeds: Breed[], sizes: Array<BreedSize>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length === breeds.length;
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function getLifeStage(breeds: Breed[], birth: Date): LifeStage | undefined {
  const ageM = differenceInMonths(birth, new Date());
  const ageY = differenceInYears(birth, new Date());

  // Puppy
  if (isExactSize(breeds, ['Small'])) {
    if (ageM < 13) return 'Puppy';
    else if (ageM >= 13 && ageY < 9) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Medium'])) {
    if (ageM < 13) return 'Puppy';
    else if (ageM >= 13 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Large'])) {
    if (ageM < 17) return 'Puppy';
    else if (ageM >= 17 && ageY < 5) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Small']) && isExactSize(breeds, ['Medium', 'Large'])) {
    if (ageM < 13) return 'Puppy';
    else if (ageM >= 13 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Medium']) && isExactSize(breeds, ['Large'])) {
    if (ageM < 17) return 'Puppy';
    else if (ageM >= 17 && ageY < 5) return 'Adult';
    else return 'Senior';
  }
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function isYoungPuppy(birth: Date) {
  const age = differenceInMonths(birth, new Date());
  return age < 4;
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function getWeightModifier(condition: BodyCondition) {
  if (condition === 'TooSkinny') return 1.15;
  else if (condition === 'JustRight') return 1;
  else return 0.85;
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function calculateIdealWeight(currentWeight: number, condition: BodyCondition) {
  return currentWeight * getWeightModifier(condition);
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function getDerMultiplier(
  breeds: Breed[],
  birth: Date,
  isNeutered: boolean,
  activityLevel: ActivityLevel
) {
  const stage = getLifeStage(breeds, birth);
  if (stage === 'Puppy') {
    return isYoungPuppy(birth) ? 3 : 2;
  }
  if (activityLevel === 'Mellow') {
    return isNeutered ? 1.1 : 1.2;
  } else if (activityLevel === 'Active') {
    return isNeutered ? 1.4 : 1.5;
  } else {
    return isNeutered ? 1.6 : 1.8;
  }
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function calcuateDailyCalorieRequirement(
  idealWeight: number,
  derMultiplier: number,
  plan: MealPlan
) {
  return 70 * Math.pow(idealWeight, 0.75) * derMultiplier * (plan === MealPlan.Half ? 0.5 : 1);
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 */
export function calculateDailyProtionSize(calorie: number, recipe: Recipe) {
  switch (recipe) {
    case Recipe.Chicken:
      return (calorie / 1540) * 1000;
    case Recipe.Beef:
      return (calorie / 1508) * 1000;
    case Recipe.Pork:
      return (calorie / 1293) * 1000;
    case Recipe.Lamb:
      return (calorie / 1865) * 1000;
    case Recipe.Duck:
      return (calorie / 1355) * 1000;
  }
}

/**
 * Refer to `Excel: customization variables v0.12 > Customization Variables`
 *
 * TODO: what means is cheaper / expensive recipe ????? custonization variables
 */
export function calcuateTotalOrderPortionSize(
  calorie: number,
  recipe: Recipe,
  totalRecipes: number,
  orderSize: OrderSize,
  transitionPeriod: boolean
) {
  const dailyProtionSize = calculateDailyProtionSize(calorie, recipe);
  if (transitionPeriod) {
    return dailyProtionSize * 0.5 * (6 / totalRecipes) + dailyProtionSize * (8 / totalRecipes);
  } else {
    // TODO: here for above todo action
    if (orderSize === OrderSize.OneWeek && totalRecipes > 1) {
      return true ? 4 : 3;
    }
    return dailyProtionSize * (orderSize === OrderSize.TwoWeek ? 14 : 7 / totalRecipes);
  }
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
 * Refer to `Excel: customization variables v0.12 > Product Recommendations`
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
        (pickiness === 'Picky' || pickiness === 'GoodEater') &&
        level !== 'Mellow' &&
        (condition === 'TooSkinny' || condition === 'JustRight')
      ) {
        return true;
      }
      if (pickiness === 'GoodEater' && level === 'Mellow' && condition === 'TooSkinny') {
        return true;
      }
      if (
        pickiness === 'EatAnything' &&
        level !== 'Mellow' &&
        condition !== 'Rounded' &&
        condition !== 'Chunky'
      ) {
        return true;
      }
      return false;
    }
    case Recipe.Beef: {
      if (
        pickiness === 'Picky' &&
        level !== 'Mellow' &&
        (condition === 'TooSkinny' || condition === 'JustRight')
      ) {
        return true;
      }
      if (pickiness === 'GoodEater') {
        return true;
      }
      if (
        pickiness === 'EatAnything' &&
        level !== 'Mellow' &&
        (condition === 'TooSkinny' || condition === 'JustRight')
      ) {
        return true;
      }
      return false;
    }
    case Recipe.Pork: {
      if (condition === 'Rounded' || condition === 'Chunky') {
        return true;
      }
      if ((condition === 'TooSkinny' || condition === 'JustRight') && level === 'Mellow') {
        return true;
      }
      if (pickiness === 'GoodEater' && level === 'Active' && condition === 'JustRight') {
        return true;
      }
      return false;
    }
    case Recipe.Lamb: {
      if (level === 'VeryActive' && (condition === 'TooSkinny' || condition === 'JustRight')) {
        return true;
      }
      if (pickiness !== 'EatAnything' && level === 'Active' && condition === 'TooSkinny') {
        return true;
      }
      return false;
    }
    case Recipe.Duck: {
      if (condition === 'Rounded' || condition === 'Chunky') {
        return true;
      }
      if (
        pickiness === 'Picky' &&
        level === 'Mellow' &&
        (condition === 'TooSkinny' || condition === 'JustRight')
      ) {
        return true;
      }
      if (pickiness === 'GoodEater' && level === 'Mellow' && condition === 'JustRight') {
        return true;
      }
      if (pickiness === 'EatAnything' && level !== 'VeryActive') {
        return true;
      }
      return false;
    }
  }
}
