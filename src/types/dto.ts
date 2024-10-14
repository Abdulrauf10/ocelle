import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DateOfBirthMethod,
  DogFood,
  FoodAllergies,
  Frequency,
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

interface DogOrderDto {
  breeds: BreedDto[];
  isNeutered: boolean;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  mealPlan: MealPlan;
  recipe1: Recipe;
  recipe2?: Recipe;
  frequency: Frequency;
  isEnabledTransitionPeriod: boolean;
}

interface DogPlanDto {
  id: number;
  name: string;
  enabled: boolean;
}

interface MinPricesDto {
  halfPlan: {
    price: number;
    discountedPrice: number;
  };
  fullPlan: {
    price: number;
    discountedPrice: number;
  };
}

interface CartReturn {
  lines: CheckoutLineFragment[];
  discountPrice?: MoneyFragment;
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

export type { DogDto, MinPricesDto, CartReturn, BreedDto, DogPlanDto, DogOrderDto };
