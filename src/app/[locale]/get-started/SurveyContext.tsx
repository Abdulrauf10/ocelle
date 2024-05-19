import cloneDeep from 'clone-deep';
import React from 'react';

import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DogFood,
  FoodAllergies,
  MealPlan,
  Pickiness,
  Recipe,
  Sex,
} from '@/enums';
import { getSurveySessionStore } from '@/helpers/session';
import { BreedDto } from '@/types/dto';

export interface Dog {
  name?: string;
  isUnknownBreed?: boolean;
  breeds?: BreedDto[];
  sex?: Sex;
  isNeutered?: boolean;
  age?: { years: number; months: number } | string;
  weight?: number;
  bodyCondition?: BodyCondition;
  activityLevel?: ActivityLevel;
  foodAllergies?: FoodAllergies;
  currentEating?: DogFood[];
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
  setOwner(owner: Owner): void;
}

const SurveyContext = React.createContext<SurveyContextProps | undefined>(undefined);

const surveySession = getSurveySessionStore();

export function SurveyContextProvider({ children }: React.PropsWithChildren) {
  const [dogs, setDogs] = React.useState<Dog[]>(surveySession.get('dogs') ?? []);
  const [owner, _setOwner] = React.useState<Owner>(surveySession.get('owner') ?? {});
  const [currentDog, setCurrentDog] = React.useState(0);

  const getDog = React.useCallback(() => {
    return dogs[currentDog] || {};
  }, [dogs, currentDog]);

  const setDog = React.useCallback(
    (values: Partial<Dog>) => {
      const nextDogs = cloneDeep(dogs);
      nextDogs[currentDog] = {
        ...nextDogs[currentDog],
        ...values,
      };
      setDogs(nextDogs);
      surveySession.set('dogs', nextDogs, true);
    },
    [currentDog, dogs]
  );

  const prevDog = React.useCallback(() => setCurrentDog((current) => current - 1 || 0), []);

  const nextDog = React.useCallback(() => setCurrentDog((current) => current + 1), []);

  const setOwner = React.useCallback((owner: Owner) => {
    _setOwner(owner);
    surveySession.set('owner', owner, true);
  }, []);

  const values = React.useMemo(() => {
    return {
      dogs,
      owner,
      getDog,
      setDog,
      prevDog,
      nextDog,
      setOwner,
    };
  }, [dogs, owner, getDog, setDog, prevDog, nextDog, setOwner]);

  return <SurveyContext.Provider value={values}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const context = React.useContext(SurveyContext);

  if (context === undefined) {
    throw new Error('useSurvey: context cannot be null');
  }

  return context;
}
