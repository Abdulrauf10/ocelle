import { DogFood, FoodAllergies, Recipe } from '@/enums';

/**
 * get translation keys as index
 */
function getFoodAllergiesOptions() {
  return ['none', 'chicken', 'beef', 'pork', 'lamb', 'duck'] as const;
}

function foodAllergiesToArray(value?: FoodAllergies) {
  if (value == null) {
    return [];
  }
  return [
    (value & FoodAllergies.None) === FoodAllergies.None,
    (value & FoodAllergies.Chicken) === FoodAllergies.Chicken,
    (value & FoodAllergies.Beef) === FoodAllergies.Beef,
    (value & FoodAllergies.Pork) === FoodAllergies.Pork,
    (value & FoodAllergies.Lamb) === FoodAllergies.Lamb,
    (value & FoodAllergies.Duck) === FoodAllergies.Duck,
  ];
}

function arrayToAllergies(array: Array<boolean | undefined>) {
  let value!: FoodAllergies;
  if (array[0]) {
    value |= FoodAllergies.None;
  }
  if (array[1]) {
    value |= FoodAllergies.Chicken;
  }
  if (array[2]) {
    value |= FoodAllergies.Beef;
  }
  if (array[3]) {
    value |= FoodAllergies.Pork;
  }
  if (array[4]) {
    value |= FoodAllergies.Lamb;
  }
  if (array[5]) {
    value |= FoodAllergies.Duck;
  }
  return value;
}

function getRecipeOptions() {
  return [Recipe.Chicken, Recipe.Pork, Recipe.Duck, Recipe.Beef, Recipe.Lamb] as const;
}

function arrayToRecipe(array: (boolean | undefined)[]): { recipe1?: Recipe; recipe2?: Recipe } {
  const options = getRecipeOptions();

  let r1: Recipe | undefined = undefined;
  let r2: Recipe | undefined = undefined;

  array.forEach((value, idx) => {
    if (value) {
      if (r1 != null && r2 != null) {
        return;
      }
      if (r1 == null) {
        r1 = options[idx];
      } else {
        r2 = options[idx];
      }
    }
  });

  return { recipe1: r1, recipe2: r2 };
}

function recipeToArray(r1?: Recipe, r2?: Recipe) {
  const options = getRecipeOptions();

  const array = Array(options.length).fill(false);

  if (r1 != null) {
    array[options.indexOf(r1)] = true;
  }
  if (r2 != null) {
    array[options.indexOf(r2)] = true;
  }

  return array;
}

function getFoodOptions() {
  return ['dry', 'wet', 'raw', 'dehydrated', 'fresh', 'homemade', 'other'] as const;
}

function foodsToArray(foods?: DogFood[]) {
  if (!foods) {
    return [];
  }
  return [
    foods.indexOf(DogFood.Dry) > -1,
    foods.indexOf(DogFood.Wet) > -1,
    foods.indexOf(DogFood.Raw) > -1,
    foods.indexOf(DogFood.Dehydrated) > -1,
    foods.indexOf(DogFood.Fresh) > -1,
    foods.indexOf(DogFood.Homemade) > -1,
    foods.indexOf(DogFood.Other) > -1,
  ];
}

function arrayToFoods(array: Array<boolean | undefined>) {
  const foods = [];
  if (array[0] === true) foods.push(DogFood.Dry);
  if (array[1] === true) foods.push(DogFood.Wet);
  if (array[2] === true) foods.push(DogFood.Raw);
  if (array[3] === true) foods.push(DogFood.Dehydrated);
  if (array[4] === true) foods.push(DogFood.Fresh);
  if (array[5] === true) foods.push(DogFood.Homemade);
  if (array[6] === true) foods.push(DogFood.Other);
  return foods;
}

export {
  getFoodAllergiesOptions,
  foodAllergiesToArray,
  arrayToAllergies,
  getRecipeOptions,
  arrayToRecipe,
  recipeToArray,
  getFoodOptions,
  foodsToArray,
  arrayToFoods,
};
