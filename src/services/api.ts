import invariant from 'ts-invariant';

import {
  calculateRecipeTotalProtionsInBox,
  calculateTotalDaysInBox,
  getLifeStage,
} from '../helpers/dog';
import { executeGraphQL } from '../helpers/graphql';

import { ActivityLevel, BodyCondition, Frequency, MealPlan, Recipe } from '@/enums';
import {
  FindProductsDocument,
  FindProductsQueryVariables,
  GetChannelDocument,
  ProductFragment,
} from '@/gql/graphql';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

export async function getThrowableChannel() {
  invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

  const { channel } = await executeGraphQL(GetChannelDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: {
      slug: process.env.SALEOR_CHANNEL_SLUG,
    },
  });

  if (!channel) {
    throw new Error('channel not found');
  }

  return channel;
}

export async function findProducts(variables?: FindProductsQueryVariables) {
  const { products } = await executeGraphQL(FindProductsDocument, {
    withAuth: false,
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
    },
    variables: variables ?? {},
  });
  return products?.edges.map((edge) => edge.node) || [];
}

function calculateRecipeTotalPriceInBox(
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
  console.log(products.find((product) => product.slug === meta.slug));
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

export async function calculateTotalPriceInBox(
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
  const products = await findProducts({
    where: {
      slug: {
        oneOf: Object.values(subscriptionProducts).map((product) => product.slug),
      },
    },
  });
  const recipe1Price = calculateRecipeTotalPriceInBox(
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
    calculateRecipeTotalPriceInBox(
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

export async function calculateTotalPerDayPrice(
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
  const products = await findProducts({
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
  const recipe1TotalPriceInBox = calculateRecipeTotalPriceInBox(
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
  const recipe2TotalPriceInBox = calculateRecipeTotalPriceInBox(
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
