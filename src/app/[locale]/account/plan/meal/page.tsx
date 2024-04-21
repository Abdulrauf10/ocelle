import React from 'react';
import Container from '@/components/Container';
import DogSwitch from '../../DogSwitch';
import AppThemeProvider from '@/components/AppThemeProvider';
import { getTranslations } from 'next-intl/server';
import FreshPlanForm from '@/components/forms/FreshPlan';
import setMealPlanAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import { calculateTotalPerDayPrice } from '@/helpers/dog';
import { MealPlan } from '@/enums';
import { cookies } from 'next/headers';
import { DOG_SELECT_COOKIE } from '@/consts';
import { DogBoxNote } from '@/components/DogBoxNote';
import { executeQuery } from '@/helpers/queryRunner';
import { RecurringBox } from '@/entities';

export default async function PlanMeal() {
  const cookie = cookies();
  const t = await getTranslations();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie();
  const { dogs, orderSize } = await getLoginedMe();
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === parseInt(currentSelectedDogId)) || dogs[0]
    : dogs[0];
  const boxs = await executeQuery(async (queryRunner) => {
    return queryRunner.manager.find(RecurringBox, {
      where: {
        dog: { id: dog.id },
      },
      relations: {
        shipment: true,
      },
    });
  });

  const fullPlanPerDayPrice = calculateTotalPerDayPrice(
    dog.breeds.map(({ breed }) => breed),
    new Date(dog.dateOfBirth),
    dog.isNeutered,
    dog.weight,
    dog.bodyCondition,
    dog.activityLevel,
    { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
    MealPlan.Full,
    orderSize,
    false
  );

  const halfPlanPerDayPrice = calculateTotalPerDayPrice(
    dog.breeds.map(({ breed }) => breed),
    new Date(dog.dateOfBirth),
    dog.isNeutered,
    dog.weight,
    dog.bodyCondition,
    dog.activityLevel,
    { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
    MealPlan.Half,
    orderSize,
    false
  );

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch
              selectedDogId={
                cookie.has(DOG_SELECT_COOKIE)
                  ? parseInt(cookie.get(DOG_SELECT_COOKIE)!.value)
                  : dogs[0].id
              }
              dogs={dogs.map((dog) => ({ id: dog.id, name: dog.name }))}
            />
          </div>
          <h1 className="heading-4 text-center font-bold text-primary max-lg:mt-6">
            {t('choose-{}-fresh-recipes', { name: dog.name })}
          </h1>
          <div className="mx-auto mt-4 max-w-[620px] text-center">
            <DogBoxNote name={dog.name} boxs={boxs} />
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
            <BackButton label={t('go-back')} />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
