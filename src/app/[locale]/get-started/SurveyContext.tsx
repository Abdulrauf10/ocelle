import cloneDeep from 'clone-deep';
import { useLocale } from 'next-intl';
import React from 'react';

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
} from '@/enums';
import DogHelper from '@/helpers/dog';
import { getSurveySessionStore } from '@/helpers/session';
import { BreedDto, DogDto } from '@/types/dto';

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
  currentDogIdx: number;
  dogs: Dog[];
  owner: Owner;
  getDog(index?: number): Dog;
  setDog(values: Partial<Dog>, index?: number): void;
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

  const getDog = React.useCallback(
    (index?: number) => {
      return dogs[index ?? currentDog] || {};
    },
    [dogs, currentDog]
  );

  const setDog = React.useCallback(
    (values: Partial<Dog>, index?: number) => {
      const nextDogs = cloneDeep(dogs);
      nextDogs[index ?? currentDog] = {
        ...nextDogs[index ?? currentDog],
        ...values,
      };
      setDogs(nextDogs);
      surveySession.set('dogs', nextDogs, true);
    },
    [currentDog, dogs]
  );

  const prevDog = React.useCallback(() => setCurrentDog((current) => Math.max(current - 1, 0)), []);

  const nextDog = React.useCallback(() => setCurrentDog((current) => current + 1), []);

  const setOwner = React.useCallback((owner: Owner) => {
    _setOwner(owner);
    surveySession.set('owner', owner, true);
  }, []);

  const values = React.useMemo(() => {
    return {
      currentDogIdx: currentDog,
      dogs,
      owner,
      getDog,
      setDog,
      prevDog,
      nextDog,
      setOwner,
    };
  }, [currentDog, dogs, owner, getDog, setDog, prevDog, nextDog, setOwner]);

  return <SurveyContext.Provider value={values}>{children}</SurveyContext.Provider>;
}

export function useSurvey() {
  const context = React.useContext(SurveyContext);

  if (context === undefined) {
    throw new Error('useSurvey: context cannot be null');
  }

  return context;
}

export function dogToDogDto({
  name,
  sex,
  weight,
  isUnknownBreed,
  breeds,
  age,
  isNeutered,
  bodyCondition,
  activityLevel,
  foodAllergies,
  amountOfTreats,
  currentEating,
  pickiness,
  mealPlan,
  isEnabledTransitionPeriod,
  recipe1,
  recipe2,
}: Dog): DogDto {
  if (
    name === undefined ||
    sex === undefined ||
    age === undefined ||
    weight === undefined ||
    isNeutered === undefined ||
    bodyCondition === undefined ||
    activityLevel === undefined ||
    foodAllergies === undefined ||
    amountOfTreats === undefined ||
    currentEating === undefined ||
    pickiness === undefined ||
    mealPlan === undefined ||
    isEnabledTransitionPeriod === undefined ||
    recipe1 === undefined
  ) {
    throw new Error('there have some fields not yet completed');
  }
  return {
    name,
    sex,
    isNeutered,
    breeds: isUnknownBreed ? undefined : breeds?.map((breed) => breed.id),
    weight,
    dateOfBirthMethod:
      typeof age === 'string' ? DateOfBirthMethod.Calendar : DateOfBirthMethod.Manually,
    dateOfBirth:
      typeof age === 'string' ? age : DogHelper.getDateOfBirth(age.years, age.months).toISOString(),
    bodyCondition,
    activityLevel,
    foodAllergies,
    amountOfTreats,
    currentEating,
    pickiness,
    mealPlan,
    isEnabledTransitionPeriod,
    recipe1,
    recipe2,
  };
}
