import { Recipe } from '@/enums';
import {
  ChannelFragment,
  FindProductsDocument,
  FindProductsQueryVariables,
  GetChannelDocument,
  ProductFragment,
  WeightFragment,
  WeightUnitsEnum,
} from '@/gql/graphql';
import { BreedDto } from '@/types/dto';
import { getLifeStage } from './dog';
import { subscriptionProducts } from '@/products';
import { executeGraphQL } from './graphql';
import invariant from 'ts-invariant';

export function weightToGrams(weight: WeightFragment) {
  switch (weight.unit) {
    case WeightUnitsEnum.G:
      return weight.value;
    case WeightUnitsEnum.Kg:
      return weight.value * 1000;
    case WeightUnitsEnum.Lb:
      return weight.value * 453.592;
    case WeightUnitsEnum.Oz:
      return weight.value * 28.3495;
    case WeightUnitsEnum.Tonne:
      return weight.value * 1000000;
    default:
      throw new Error('cannot convert weight to grams, unknown weight unit');
  }
}

export function recipeToVariant(
  products: ProductFragment[],
  breeds: BreedDto[],
  dateOfBirth: Date,
  recipe: Recipe
) {
  const lifeStage = getLifeStage(breeds, dateOfBirth);
  const subscriptionRecipe = subscriptionProducts[recipe];
  const product = products.find((product) => product.slug === subscriptionRecipe.slug);
  if (!product) {
    throw new Error('product not found');
  }
  if (!product.variants) {
    throw new Error('product variants is null or undefined');
  }
  return product.variants.find(
    (variant) => variant.sku === subscriptionRecipe.variants[lifeStage].sku
  );
}

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
