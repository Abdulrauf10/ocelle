import Decimal from 'decimal.js';
import { roundTo } from 'round-to';

import productService from './product';

import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import { ProductFragment } from '@/gql/graphql';
import RecipeHelper from '@/helpers/recipe';
import { recipeToVariant } from '@/helpers/saleor';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

export default class PriceService {
  static calculateRecipeTotalPriceInBox(
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
    const variant = recipeToVariant(products, breeds, dateOfBirth, recipes.recipeToBeCalcuate);
    const price = variant?.channelListings?.at(0)?.price;
    if (!price) {
      throw new Error('product or varient not found in any channels');
    }
    const totalProtionsInBox = RecipeHelper.calculateRecipeTotalProtionsInBox(
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
    return {
      variant,
      price: Math.round((totalProtionsInBox / 10000) * price.amount),
    };
  }

  static async calculateTotalPriceInBox(
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
    const { price: recipe1Price } = this.calculateRecipeTotalPriceInBox(
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
    const { price: recipe2Price } = this.calculateRecipeTotalPriceInBox(
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
    return recipe1Price + recipe2Price;
  }

  // single recipe only
  static async findMinPerDayPrice(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    plan: MealPlan
  ) {
    const products = await productService.find({
      where: {
        slug: {
          oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
        },
      },
    });
    const boxPrices = Object.keys(subscriptionProducts).map((recipe) => {
      const { price } = this.calculateRecipeTotalPriceInBox(
        products,
        breeds,
        dateOfBirth,
        neutered,
        currentWeight,
        condition,
        activityLevel,
        { recipeToBeCalcuate: recipe as Recipe },
        plan,
        Frequency.TwoWeek,
        true
      );
      const { transitionPeriodDays, normalDays } = RecipeHelper.calculateTotalDaysInBox(
        { recipeToBeCalcuate: recipe as Recipe },
        Frequency.TwoWeek,
        true
      );

      return price / (transitionPeriodDays + normalDays);
    });

    return Math.min(...boxPrices);
  }

  static async calculateTotalPerDayPrice(
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
    const recipe1Days = RecipeHelper.calculateTotalDaysInBox(
      { recipeToBeCalcuate: recipes.recipe1, recipeReference: recipes.recipe2 },
      frequency,
      transitionPeriod
    );
    const { price: recipe1TotalPriceInBox } = this.calculateRecipeTotalPriceInBox(
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
    const recipe1PerDayPrice = roundTo(
      new Decimal(recipe1TotalPriceInBox)
        .div(recipe1Days.transitionPeriodDays + recipe1Days.normalDays)
        .toNumber(),
      2
    );

    if (!recipes.recipe2) {
      return recipe1PerDayPrice;
    }

    const recipe2Days = RecipeHelper.calculateTotalDaysInBox(
      { recipeToBeCalcuate: recipes.recipe2, recipeReference: recipes.recipe1 },
      frequency,
      transitionPeriod
    );
    const { price: recipe2TotalPriceInBox } = this.calculateRecipeTotalPriceInBox(
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
    const recipe2PerDayPrice = roundTo(
      new Decimal(recipe2TotalPriceInBox)
        .div(recipe2Days.transitionPeriodDays + recipe2Days.normalDays)
        .toNumber(),
      2
    );

    return recipe1PerDayPrice + recipe2PerDayPrice;
  }
}
