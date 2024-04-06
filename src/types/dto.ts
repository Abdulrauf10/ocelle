import { FoodAllergies, MealPlan, Recipe } from '@/enums';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  CurrentlyEating,
  Gender,
  Pickiness,
} from '.';
import { DateOfBirthMethod } from './dog';
import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';

interface DogDto {
  name: string;
  breeds?: number[];
  gender: Gender;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: string;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  foodAllergies: FoodAllergies;
  currentlyEating: CurrentlyEating;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
  mealPlan: MealPlan;
  recipe1: Recipe;
  recipe2?: Recipe;
  isEnabledTransitionPeriod: boolean;
}

interface MinPricesDto {
  halfPlan: number;
  fullPlan: number;
}

interface CartReturn {
  lines: CheckoutLineFragment[];
  totalPrice: MoneyFragment;
}

interface BreedDto {
  id: number;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  uid: string;
}

export type { DogDto, MinPricesDto, CartReturn, BreedDto };
