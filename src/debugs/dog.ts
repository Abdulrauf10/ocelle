import { startOfDay } from 'date-fns';

import { ActivityLevel, BodyCondition, FoodAllergies, Pickiness, Recipe } from '@/enums';
import { isRecommendedRecipe } from '@/helpers/dog';
import { getClosestDeliveryDateByDate } from '@/helpers/shipment';
import calendarService from '@/services/calendar';
import { CalendarEvent } from '@/types';

function getRecommendedRecipeData(
  pickiness: Pickiness,
  activityLevel: ActivityLevel,
  bcs: BodyCondition
) {
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

function getDeliveryDateData(events: CalendarEvent[], startDate: Date) {
  return {
    startDate: startOfDay(startDate),
    deliveryDate: getClosestDeliveryDateByDate(events, startDate),
  };
}

export async function printDefaultDeliveryDate() {
  const events = await calendarService.getCalendarEvents();
  const table = [
    getDeliveryDateData(events, new Date('2024-04-17')),
    getDeliveryDateData(events, new Date('2024-04-26')),
    getDeliveryDateData(events, new Date()),
  ];

  console.table(table);
}

export function printIsRecommendedRecipe() {
  const table = [
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Mellow, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Active, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Active, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Active, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.Active, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.Picky, ActivityLevel.VeryActive, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Mellow, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.Active, BodyCondition.Chunky),
    getRecommendedRecipeData(
      Pickiness.GoodEater,
      ActivityLevel.VeryActive,
      BodyCondition.TooSkinny
    ),
    getRecommendedRecipeData(
      Pickiness.GoodEater,
      ActivityLevel.VeryActive,
      BodyCondition.JustRight
    ),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.GoodEater, ActivityLevel.VeryActive, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Mellow, BodyCondition.Chunky),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.TooSkinny),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.JustRight),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.Rounded),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.Active, BodyCondition.Chunky),
    getRecommendedRecipeData(
      Pickiness.EatAnything,
      ActivityLevel.VeryActive,
      BodyCondition.TooSkinny
    ),
    getRecommendedRecipeData(
      Pickiness.EatAnything,
      ActivityLevel.VeryActive,
      BodyCondition.JustRight
    ),
    getRecommendedRecipeData(
      Pickiness.EatAnything,
      ActivityLevel.VeryActive,
      BodyCondition.Rounded
    ),
    getRecommendedRecipeData(Pickiness.EatAnything, ActivityLevel.VeryActive, BodyCondition.Chunky),
  ];

  console.table(table);
}
