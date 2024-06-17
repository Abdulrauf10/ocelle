import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DateOfBirthMethod,
  DogFood,
  FoodAllergies,
  MealPlan,
  Pickiness,
  Recipe,
  Sex,
  Size,
} from '@/enums';
import { CheckoutLineFragment, MoneyFragment } from '@/gql/graphql';

interface DogDto {
  name: string;
  breeds?: number[];
  sex: Sex;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: string;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  foodAllergies: FoodAllergies;
  currentEating: DogFood[];
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
  mealPlan: MealPlan;
  recipe1: Recipe;
  recipe2?: Recipe;
  isEnabledTransitionPeriod: boolean;
}

interface DogPlanDto {
  id: number;
  name: string;
  enabled: boolean;
}

interface MinPricesDto {
  halfPlan: number;
  fullPlan: number;
}

interface CartReturn {
  lines: CheckoutLineFragment[];
  shippingPrice: MoneyFragment;
  subtotalPrice: MoneyFragment;
  totalPrice: MoneyFragment;
}

interface BreedDto {
  id: number;
  name: string;
  size: Size;
  uid: string;
}

export type { DogDto, MinPricesDto, CartReturn, BreedDto, DogPlanDto };
