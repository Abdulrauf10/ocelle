'use server';

import {
  calculateRecipeTotalProtionsInBox,
  calculateTotalDaysInBox,
  getLifeStage,
} from '../helpers/dog';
import productService from './product';

import { recipePriorities } from '@/consts';
import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import { ProductFragment } from '@/gql/graphql';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

class PriceService {
  cheapestRecipe() {
    let cheapest: Recipe = Recipe.Beef;
    for (const _recipe of Object.keys(recipePriorities)) {
      const recipe = Recipe[_recipe as keyof typeof Recipe];
      if (recipePriorities[recipe] < recipePriorities[cheapest]) {
        cheapest = recipe;
      }
    }
    return cheapest;
  }

  calculateRecipeTotalPriceInBox(
    products: ProductFragment[],
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
    const lifeStage = getLifeStage(breeds, dateOfBirth);
    const meta = subscriptionProducts[recipes.recipeToBeCalcuate];
    const channelPrice = products
      .find((product) => product.slug === meta.slug)
      ?.variants?.find((varient) => varient.sku === meta.variants[lifeStage].sku)
      ?.channelListings?.at(0);
    if (!channelPrice) {
      throw new Error('product or varient not found in any channels');
    }
    const totalProtionsInBox = calculateRecipeTotalProtionsInBox(
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      recipes,
      plan,
      frequency,
      transitionPeriod
    );
    return totalProtionsInBox * channelPrice.price!.amount;
  }

  async calculateTotalPriceInBox(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    recipes: { recipe1: Recipe; recipe2?: Recipe },
    plan: MealPlan,
    frequency: Frequency,
    transitionPeriod: boolean
  ) {
    const products = await productService.find({
      where: {
        slug: {
          oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
        },
      },
    });
    const recipe1Price = this.calculateRecipeTotalPriceInBox(
      products,
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
      plan,
      frequency,
      transitionPeriod
    );
    if (!recipes.recipe2) {
      return recipe1Price;
    }
    return (
      recipe1Price +
      this.calculateRecipeTotalPriceInBox(
        products,
        breeds,
        dateOfBirth,
        neutered,
        currentWeight,
        condition,
        activityLevel,
        { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
        plan,
        frequency,
        transitionPeriod
      )
    );
  }

  async calculateTotalPerDayPrice(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    recipes: { recipe1: Recipe; recipe2?: Recipe },
    plan: MealPlan,
    frequency: Frequency,
    transitionPeriod: boolean
  ) {
    const products = await productService.find({
      where: {
        slug: {
          oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
        },
      },
    });
    const recipe1Days = calculateTotalDaysInBox(
      { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
      frequency,
      transitionPeriod
    );
    const recipe1TotalPriceInBox = this.calculateRecipeTotalPriceInBox(
      products,
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
      plan,
      frequency,
      transitionPeriod
    );
    const recipe1PerDayPrice =
      recipe1TotalPriceInBox / (recipe1Days.transitionPeriodDays + recipe1Days.normalDays);

    if (!recipes.recipe2) {
      return recipe1PerDayPrice;
    }

    const recipe2Days = calculateTotalDaysInBox(
      { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
      frequency,
      transitionPeriod
    );
    const recipe2TotalPriceInBox = this.calculateRecipeTotalPriceInBox(
      products,
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
      plan,
      frequency,
      transitionPeriod
    );
    const recipe2PerDayPrice =
      recipe2TotalPriceInBox / (recipe2Days.transitionPeriodDays + recipe2Days.normalDays);

    return recipe1PerDayPrice + recipe2PerDayPrice;
  }
}

const priceService = new PriceService();

export default priceService;
