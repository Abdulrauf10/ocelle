import { ActivityLevel, BodyCondition, FoodAllergies, Pickiness, Recipe } from '@/enums';
import { isRecommendedRecipe } from '@/helpers/dog';

function generateTableRow(pickiness: Pickiness, activityLevel: ActivityLevel, bcs: BodyCondition) {
  return {
    Pickiness: pickiness,
    'Activity Level': activityLevel,
    BCS: bcs,
    Chicken: isRecommendedRecipe(Recipe.Chicken, pickiness, activityLevel, bcs, FoodAllergies.None)
      ? '✓'
      : undefined,
    Beef: isRecommendedRecipe(Recipe.Beef, pickiness, activityLevel, bcs, FoodAllergies.None)
      ? '✓'
      : undefined,
    Pork: isRecommendedRecipe(Recipe.Pork, pickiness, activityLevel, bcs, FoodAllergies.None)
      ? '✓'
      : undefined,
    Lamb: isRecommendedRecipe(Recipe.Lamb, pickiness, activityLevel, bcs, FoodAllergies.None)
      ? '✓'
      : undefined,
    Duck: isRecommendedRecipe(Recipe.Duck, pickiness, activityLevel, bcs, FoodAllergies.None)
      ? '✓'
      : undefined,
  };
}

export function printIsRecommendedRecipe() {
  const table = [
    generateTableRow(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.JustRight),
    generateTableRow(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Rounded),
    generateTableRow(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Chunky),
    generateTableRow(Pickiness.Picky, ActivityLevel.Active, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.Picky, ActivityLevel.Active, BodyCondition.JustRight),
    generateTableRow(Pickiness.Picky, ActivityLevel.Active, BodyCondition.Rounded),
    generateTableRow(Pickiness.Picky, ActivityLevel.Active, BodyCondition.Chunky),
    generateTableRow(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.JustRight),
    generateTableRow(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.Rounded),
    generateTableRow(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.Chunky),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.JustRight),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.Rounded),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.Chunky),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.JustRight),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.Rounded),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.Chunky),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.JustRight),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.Rounded),
    generateTableRow(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.Chunky),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.JustRight),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.Rounded),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.Chunky),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.JustRight),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.Rounded),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.Chunky),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.VeryActive, BodyCondition.TooSkinny),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.VeryActive, BodyCondition.JustRight),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.VeryActive, BodyCondition.Rounded),
    generateTableRow(Pickiness.EatAnything, ActivityLevel.VeryActive, BodyCondition.Chunky),
  ];

  console.table(table);
}
