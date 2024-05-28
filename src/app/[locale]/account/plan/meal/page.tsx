import { getTranslations } from 'next-intl/server';
import React from 'react';

import DogSwitch from '../../DogSwitch';
import setMealPlanAction from './action';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import FreshPlanForm from '@/components/forms/FreshPlan';
import RecurringBoxNote from '@/components/notes/RecurringBox';
import { MealPlan } from '@/enums';
import { calculateTotalPerDayPrice } from '@/services/api';

export default async function PlanMeal() {
  const t = await getTranslations();
  const { dogs } = await getLoginedMe();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie(dogs[0].id);
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === currentSelectedDogId) || dogs[0]
    : dogs[0];

  const fullPlanPerDayPrice = await calculateTotalPerDayPrice(
    dog.breeds.map(({ breed }) => breed),
    new Date(dog.dateOfBirth),
    dog.isNeutered,
    dog.weight,
    dog.bodyCondition,
    dog.activityLevel,
    { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
    MealPlan.Full,
    dog.plan.frequency,
    false
  );

  const halfPlanPerDayPrice = await calculateTotalPerDayPrice(
    dog.breeds.map(({ breed }) => breed),
    new Date(dog.dateOfBirth),
    dog.isNeutered,
    dog.weight,
    dog.bodyCondition,
    dog.activityLevel,
    { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
    MealPlan.Half,
    dog.plan.frequency,
    false
  );

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch
              selectedDogId={currentSelectedDogId ?? dogs[0].id}
              dogs={dogs.map((dog) => ({ id: dog.id, name: dog.name }))}
            />
          </div>
          <h1 className="heading-4 text-center font-bold text-primary max-lg:mt-6">
            {t('choose-{}-fresh-recipes', { name: dog.name })}
          </h1>
          <div className="mx-auto mt-4 max-w-[620px] text-center">
            <RecurringBoxNote id={dog.id} />
          </div>
          <FreshPlanForm
            initialPlan={dog.plan.mealPlan}
            fullPlanPrice={fullPlanPerDayPrice}
            halfPlanPrice={halfPlanPerDayPrice}
            action={async (data) => {
              'use server';
              return await setMealPlanAction({ ...data, id: dog.id });
            }}
          />
          <div className="mt-8 text-center">
            <UnderlineBackButton label={t('go-back')} />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
