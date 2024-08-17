import DogHelper from './dog';

import { Recipe } from '@/enums';
import { ChoiceValue, ProductFragment, WeightFragment, WeightUnitsEnum } from '@/gql/graphql';
import { subscriptionProducts } from '@/products';
import { BreedDto } from '@/types/dto';

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
  const lifeStage = DogHelper.getLifeStage(breeds, dateOfBirth);
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

export function choiceToOptions(choices: ChoiceValue[], locale: string) {
  const options = [];
  for (const choice of choices) {
    if (choice.raw && choice.verbose) {
      if (locale === 'en') {
        if (/^[a-zA-Z\s]+$/.test(choice.verbose)) {
          options.push({
            raw: choice.raw,
            verbose: choice.verbose,
          });
        }
      }
      if (locale === 'zh') {
        if (/^[\p{Script=Han}]+$/u.test(choice.verbose)) {
          options.push({
            raw: choice.raw,
            verbose: choice.verbose,
          });
        }
      } else {
        options.push({
          raw: choice.raw,
          verbose: choice.verbose,
        });
      }
    }
  }

  return options.sort((a, b) => {
    if (a.verbose < b.verbose) {
      return -1;
    }
    if (a.verbose > b.verbose) {
      return 1;
    }
    return 0;
  });
}
