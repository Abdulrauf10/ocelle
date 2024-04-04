import { Breed } from '@/entities';
import { FoodAllergies, MealPlan, OrderSize, Recipe } from '@/enums';
import {
  ActivityLevel,
  BodyCondition,
  BreedSize,
  CalendarEvent,
  LifeStage,
  Pickiness,
} from '@/types';
import {
  addDays,
  differenceInMonths,
  differenceInYears,
  getDay,
  startOfDay,
  subMonths,
  subYears,
} from 'date-fns';

/**
 * used in saleor product variant unit price
 */
export const subscriptionProductUnitPrice = 0.1;

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 * price = saleor variant price
 */
export const recipeSubscriptionMap = {
  [Recipe.Chicken]: {
    name: 'Subscription: Fresh Chicken Recipe',
    slug: 'fresh-chicken-subscription',
    variants: {
      Puppy: {
        sku: 'ocelle-sub-c-p',
        pricePerUnit: 0.17976,
      },
      Adult: {
        sku: 'ocelle-sub-c-a',
        pricePerUnit: 0.16976,
      },
      Senior: {
        sku: 'ocelle-sub-c-s',
        pricePerUnit: 0.16476,
      },
    },
  },
  [Recipe.Beef]: {
    name: 'Subscription: Fresh Beef Recipe',
    slug: 'fresh-beef-subscription',
    variants: {
      Puppy: {
        sku: 'ocelle-sub-b-p',
        pricePerUnit: 0.18922,
      },
      Adult: {
        sku: 'ocelle-sub-b-a',
        pricePerUnit: 0.17922,
      },
      Senior: {
        sku: 'ocelle-sub-b-s',
        pricePerUnit: 0.17422,
      },
    },
  },
  [Recipe.Duck]: {
    name: 'Subscription: Fresh Duck Recipe',
    slug: 'fresh-duck-subscription',
    variants: {
      Puppy: {
        sku: 'ocelle-sub-d-p',
        pricePerUnit: 0.36791,
      },
      Adult: {
        sku: 'ocelle-sub-d-a',
        pricePerUnit: 0.35791,
      },
      Senior: {
        sku: 'ocelle-sub-d-s',
        pricePerUnit: 0.35291,
      },
    },
  },
  [Recipe.Lamb]: {
    name: 'Subscription: Fresh Lamb Recipe',
    slug: 'fresh-lamb-subscription',
    variants: {
      Puppy: {
        sku: 'ocelle-sub-l-p',
        pricePerUnit: 0.29342,
      },
      Adult: {
        sku: 'ocelle-sub-l-a',
        pricePerUnit: 0.28342,
      },
      Senior: {
        sku: 'ocelle-sub-l-s',
        pricePerUnit: 0.27842,
      },
    },
  },
  [Recipe.Pork]: {
    name: 'Subscription: Fresh Pork Recipe',
    slug: 'fresh-pork-subscription',
    variants: {
      Puppy: {
        sku: 'ocelle-sub-p-p',
        pricePerUnit: 0.15093,
      },
      Adult: {
        sku: 'ocelle-sub-p-a',
        pricePerUnit: 0.14093,
      },
      Senior: {
        sku: 'ocelle-sub-p-s',
        pricePerUnit: 0.13593,
      },
    },
  },
};

/**
 * only apply to individual case
 */
export const recipeBundle = {
  name: 'Test Bundle',
  slug: 'bundle-pack',
  variant: {
    sku: 'ocelle-guest-bundle',
    weightKGs: 0.5,
    price: 150,
  },
};

export const recipeIndividualMap = {
  [Recipe.Chicken]: {
    name: 'Fresh Chicken Recipe',
    slug: 'chicken-pack',
    variant: {
      sku: 'ocelle-guest-c',
      weightKGs: 0.2,
      price: 50,
    },
  },
  [Recipe.Beef]: {
    name: 'Fresh Beef Recipe',
    slug: 'beef-pack',
    variant: {
      sku: 'ocelle-guest-b',
      weightKGs: 0.2,
      price: 55,
    },
  },
  [Recipe.Duck]: {
    name: 'Fresh Duck Recipe',
    slug: 'duck-pack',
    variant: {
      sku: 'ocelle-guest-d',
      weightKGs: 0.2,
      price: 80,
    },
  },
  [Recipe.Lamb]: {
    name: 'Fresh Lamb Recipe',
    slug: 'lamb-pack',
    variant: {
      sku: 'ocelle-guest-l',
      weightKGs: 0.2,
      price: 65,
    },
  },
  [Recipe.Pork]: {
    name: 'Fresh Pork Recipe',
    slug: 'pork-pack',
    variant: {
      sku: 'ocelle-guest-p',
      weightKGs: 0.2,
      price: 45,
    },
  },
};

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

export function getSubscriptionProductActuallyQuanlityInSaleor(recipeTotalPriceInBox: number) {
  return Math.ceil(recipeTotalPriceInBox / subscriptionProductUnitPrice);
}

export function getTheCheapestRecipe() {
  let cheapest: Recipe = Recipe.Beef;
  for (const _recipe of Object.keys(recipePriorities)) {
    const recipe = Number(_recipe) as Recipe;
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

export function isNotProductionDate(date: Date, events: CalendarEvent[]) {
  if (getDay(date) === 0) {
    return true;
  }
  for (const event of events) {
    if (event.start <= date && event.end > date) {
      return true;
    }
  }
  return false;
}

export function isUnavailableDeliveryDate(date: Date, events: CalendarEvent[]) {
  if (getDay(date) === 1) {
    return true;
  }
  for (const event of events) {
    if (event.start <= date && event.end > date) {
      return true;
    }
  }
  return false;
}

/**
 * calculate the delivery date based on any time
 */
export function getClosestDeliveryDateByDate(currentDate = new Date(), events: CalendarEvent[]) {
  const dates = [
    1, // D + production
    1, // D + production
    1, // D + pick up
    1, // D + delivery
  ];

  // production as a block
  while (isNotProductionDate(addDays(currentDate, dates[0]), events)) {
    dates[0] += 1;
  }

  // production as a block
  while (isNotProductionDate(addDays(currentDate, dates[0] + dates[1]), events)) {
    dates[1] += 1;
  }

  const totalProductionDates = dates[0] + dates[1];

  // pick up + delivery stick together
  while (
    isUnavailableDeliveryDate(
      addDays(currentDate, totalProductionDates + dates[2] + dates[3]),
      events
    )
  ) {
    dates[2] += 1;
  }

  console.debug('processing dates debug day usage', dates);

  return addDays(
    startOfDay(currentDate),
    dates.reduce((sum, a) => sum + a, 0)
  );
}

/**
 * calculate the delivery date after order placement
 */
export function getClosestOrderDeliveryDate(events: CalendarEvent[]) {
  return getClosestDeliveryDateByDate(addDays(new Date(), 1), events);
}

export function getEditableDeliveryDateDeadline(orderDate: Date) {
  //
}

export function calculateDeliveryDates(currentDate = new Date()) {
  //
}

function isExactSize(breeds: Breed[], sizes: Array<BreedSize>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length === breeds.length;
}

function isContainsSize(breeds: Breed[], sizes: Array<BreedSize>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length > -1;
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function getLifeStage(breeds: Breed[], dateOfBirth: Date): LifeStage {
  const ageM = differenceInMonths(dateOfBirth, new Date());
  const ageY = differenceInYears(dateOfBirth, new Date());

  // Puppy
  if (isExactSize(breeds, ['Small'])) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 9) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Medium']) || breeds.length === 0) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isExactSize(breeds, ['Large'])) {
    if (ageM < 16) return 'Puppy';
    else if (ageM >= 16 && ageY < 5) return 'Adult';
    else return 'Senior';
  }

  if (isContainsSize(breeds, ['Small']) && isContainsSize(breeds, ['Medium', 'Large'])) {
    if (ageM < 12) return 'Puppy';
    else if (ageM >= 12 && ageY < 7) return 'Adult';
    else return 'Senior';
  }

  if (isContainsSize(breeds, ['Medium']) && isContainsSize(breeds, ['Large'])) {
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
  if (condition === 'TooSkinny') return 1.15;
  else if (condition === 'JustRight') return 1;
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
  breeds: Breed[],
  dateOfBirth: Date,
  neutered: boolean,
  activityLevel: ActivityLevel
) {
  const stage = getLifeStage(breeds, dateOfBirth);
  if (stage === 'Puppy') {
    return 2;
  }
  if (activityLevel === 'Mellow') {
    return neutered ? 1.1 : 1.2;
  } else if (activityLevel === 'Active') {
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
  orderSize: OrderSize,
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
  if (orderSize === OrderSize.OneWeek && recipeReference) {
    return {
      transitionPeriodDays: 0,
      normalDays: recipePriorities[recipeToBeCalcuate] > recipePriorities[recipeReference] ? 4 : 3,
    };
  }
  return {
    transitionPeriodDays: 0,
    normalDays: orderSize === OrderSize.TwoWeek ? 14 : 7,
  };
}

/**
 * Refer to `Excel: customization variables v1.01 > Customization Variables`
 */
export function calculateTotalPortionSizeInBox(
  requiredDailyCalorie: number,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  orderSize: OrderSize,
  transitionPeriod: boolean
) {
  const { recipeToBeCalcuate } = recipes;
  const dailyProtionSize = calculateDailyProtionSize(requiredDailyCalorie, recipeToBeCalcuate);
  const { transitionPeriodDays, normalDays } = calculateTotalDaysInBox(
    recipes,
    orderSize,
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
      if (pickiness === 'Picky' && level === 'Active' && condition === 'JustRight') {
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

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 */
export function calculateRecipeTotalProtionsInBox(
  breeds: Breed[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  plan: MealPlan,
  orderSize: OrderSize,
  transitionPeriod: boolean
) {
  const idealWeight = calculateIdealWeight(currentWeight, condition);
  const derMultiplier = getDerMultiplier(breeds, dateOfBirth, neutered, activityLevel);
  const requiredDailyCalorie = calculateDailyCalorieRequirement(idealWeight, derMultiplier, plan);
  const totalOrderPortionSize = calculateTotalPortionSizeInBox(
    requiredDailyCalorie,
    recipes,
    orderSize,
    transitionPeriod
  );
  return totalOrderPortionSize;
}

export function calculateRecipeTotalPriceInBox(
  breeds: Breed[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  plan: MealPlan,
  orderSize: OrderSize,
  transitionPeriod: boolean
) {
  const lifeStage = getLifeStage(breeds, dateOfBirth);
  const totalProtionsInBox = calculateRecipeTotalProtionsInBox(
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    recipes,
    plan,
    orderSize,
    transitionPeriod
  );

  console.log(transitionPeriod, totalProtionsInBox);

  return (
    totalProtionsInBox *
    recipeSubscriptionMap[recipes.recipeToBeCalcuate].variants[lifeStage].pricePerUnit
  );
}

/**
 * Refer to `Excel: customization variables v1.01 > Price Matrix`
 */
export function calculateRecipePerDayPrice(
  breeds: Breed[],
  dateOfBirth: Date,
  neutered: boolean,
  currentWeight: number,
  condition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipeToBeCalcuate: Recipe; recipeReference?: Recipe },
  plan: MealPlan,
  orderSize: OrderSize,
  transitionPeriod: boolean
) {
  const { transitionPeriodDays, normalDays } = calculateTotalDaysInBox(
    recipes,
    orderSize,
    transitionPeriod
  );
  const recipeTotalPriceInBox = calculateRecipeTotalPriceInBox(
    breeds,
    dateOfBirth,
    neutered,
    currentWeight,
    condition,
    activityLevel,
    recipes,
    plan,
    orderSize,
    transitionPeriod
  );
  console.log('recipeTotalPriceInBox', recipeTotalPriceInBox);
  return recipeTotalPriceInBox / (transitionPeriodDays + normalDays);
}
