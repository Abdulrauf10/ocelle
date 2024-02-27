import React from 'react';
import { FoodAllergies, MealPlan, Recipe } from '@/enums';
import { Breed } from '@/entities';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  CurrentlyEating,
  Gender,
  Pickiness,
} from '@/types';

interface Dog {
  name?: string;
  isUnknownBreed?: boolean;
  breeds?: Breed[];
  gender?: Gender;
  isNeutered?: boolean;
  age?: { years: number; months: number } | Date;
  weight?: number;
  bodyCondition?: BodyCondition;
  activityLevel?: ActivityLevel;
  foodAllergies?: FoodAllergies;
  currentlyEating?: CurrentlyEating;
  amountOfTreats?: AmountOfTreats;
  pickiness?: Pickiness;
  mealPlan?: MealPlan;
  recipe1?: Recipe;
  recipe2?: Recipe;
  isEnabledTransitionPeriod?: boolean;
}

interface Owner {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface SurveyContextProps {
  dogs: Dog[];
  owner: Owner;
  getDog(): Dog;
  setDog(values: Partial<Dog>): void;
  prevDog(): void;
  nextDog(): void;
}

const SurveyContext = React.createContext<SurveyContextProps | undefined>(undefined);

export function SurveyContextProvider({ children }: React.PropsWithChildren) {
  const [dogs, setDogs] = React.useState<Dog[]>([]);
  const [owner, setOwner] = React.useState<Owner>({});
  const [currentDog, setCurrentDog] = React.useState(0);

  const getDog = React.useCallback(() => {
    return dogs[currentDog] || {};
  }, [dogs, currentDog]);

  const setDog = React.useCallback(
    (values: Partial<Dog>) => {
      setDogs((dogs) => {
        dogs[currentDog] = {
          ...dogs[currentDog],
          ...values,
        };
        return dogs;
      });
    },
    [currentDog]
  );

  const prevDog = React.useCallback(() => setCurrentDog((current) => current - 1 || 0), []);

  const nextDog = React.useCallback(() => setCurrentDog((current) => current + 1), []);

  const values = React.useMemo(() => {
    return {
      dogs,
      owner,
      getDog,
      setDog,
      prevDog,
      nextDog,
    };
  }, [dogs, owner, getDog, setDog, prevDog, nextDog]);

  return <SurveyContext.Provider value={values}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const context = React.useContext(SurveyContext);

  if (context === undefined) {
    throw new Error('useSurvey: context cannot be null');
  }

  return context;
}
