import { WeightFragment, WeightUnitsEnum } from '@/gql/graphql';

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
