import { FoodAllergies, Recipe } from '@/enums';

/**
 * get translation keys as index
 */
function getFoodAllergiesOptions() {
  return ['none', 'chicken', 'beef', 'pork', 'lamb', 'duck'];
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
  return [Recipe.Chicken, Recipe.Pork, Recipe.Duck, Recipe.Beef, Recipe.Lamb];
}

function arrayToRecipe(array: boolean[]) {
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

export {
  getFoodAllergiesOptions,
  foodAllergiesToArray,
  arrayToAllergies,
  getRecipeOptions,
  arrayToRecipe,
  recipeToArray,
};
