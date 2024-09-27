import roundTo from 'round-to';

import productService from './product';

import {
  ActivityLevel,
  BodyCondition,
  FoodAllergies,
  Frequency,
  LifeStage,
  MealPlan,
  Recipe,
} from '@/enums';
import { ProductFragment } from '@/gql/graphql';
import DogHelper from '@/helpers/dog';
import RecipeHelper from '@/helpers/recipe';
import { recipeToVariant } from '@/helpers/saleor';
import { SubscriptionProduct, subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

export default class PriceService {
  static calculateRecipeBoxPrice(
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
      price: (totalProtionsInBox / 10000) * price.amount,
    };
  }

  private static _calculateBoxPrice(
    products: ProductFragment[],
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
    const { price: recipe1Price } = this.calculateRecipeBoxPrice(
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
      return Math.round(recipe1Price);
    }
    const { price: recipe2Price } = this.calculateRecipeBoxPrice(
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
    return Math.round(recipe1Price + recipe2Price);
  }

  static async calculateBoxPrice(
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
    return this._calculateBoxPrice(
      products,
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
  }

  static async calculatePerDayBoxPrice(
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
    const boxPrice = await this.calculateBoxPrice(
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

    return roundTo(boxPrice / (frequency === Frequency.OneWeek ? 7 : 14), 2);
  }

  static async calculateDiscountedBoxPrice(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    recipes: { recipe1: Recipe; recipe2?: Recipe },
    plan: MealPlan,
    frequency: Frequency,
    transitionPeriod: boolean,
    discount: number
  ) {
    const boxPrice = await this.calculateBoxPrice(
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
    return roundTo(boxPrice * discount, 2);
  }

  static async calculateDiscountedPerDayBoxPrice(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    recipes: { recipe1: Recipe; recipe2?: Recipe },
    plan: MealPlan,
    frequency: Frequency,
    transitionPeriod: boolean,
    discount: number
  ) {
    const boxPrice = await this.calculateDiscountedBoxPrice(
      breeds,
      dateOfBirth,
      neutered,
      currentWeight,
      condition,
      activityLevel,
      recipes,
      plan,
      frequency,
      transitionPeriod,
      discount
    );

    return roundTo(boxPrice / (frequency === Frequency.OneWeek ? 7 : 14), 2);
  }

  // single recipe only
  static async findMinPerDayPrice(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    currentWeight: number,
    condition: BodyCondition,
    activityLevel: ActivityLevel,
    allergies: FoodAllergies,
    plan: MealPlan,
    frequency = Frequency.TwoWeek,
    discount: number
  ) {
    const nonAllergyProducts =
      (allergies & FoodAllergies.None) === FoodAllergies.None
        ? subscriptionProducts
        : Object.keys(subscriptionProducts).reduce(
            (prods, recipe) => {
              if (DogHelper.isAllergies(recipe as Recipe, allergies)) {
                return prods;
              } else {
                prods[recipe as Recipe] = subscriptionProducts[recipe as Recipe];
              }
              return prods;
            },
            {} as {
              [key in Recipe]?: SubscriptionProduct;
            }
          );

    const products = await productService.find({
      where: {
        slug: {
          oneOf: Object.values(nonAllergyProducts).map((product) => product.slug),
        },
      },
    });
    const boxPrices = Object.keys(nonAllergyProducts).map((recipe) => {
      const price = this._calculateBoxPrice(
        products,
        breeds,
        dateOfBirth,
        neutered,
        currentWeight,
        condition,
        activityLevel,
        { recipe1: recipe as Recipe },
        plan,
        frequency,
        true
      );
      const discountPrice = roundTo(price * discount, 2);
      const dailyPrice = roundTo(price / (frequency === Frequency.OneWeek ? 7 : 14), 2);

      return {
        price: dailyPrice,
        discountedPrice: roundTo(discountPrice / (frequency === Frequency.OneWeek ? 7 : 14), 2),
      };
    });

    return boxPrices.reduce((prev, curr) => (prev.price < curr.price ? prev : curr));
  }
}
