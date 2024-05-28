import { getTranslations } from 'next-intl/server';
import React from 'react';

import DogSwitch from '../../DogSwitch';
import setFrequencyAction from './action';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import OrderSizeForm from '@/components/forms/Frequency';
import ShippableNote from '@/components/notes/Shippable';
import { Frequency } from '@/enums';
import { calculateTotalPerDayPrice } from '@/services/api';

export default async function PlanOften() {
  const t = await getTranslations();
  const { dogs } = await getLoginedMe();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie(dogs[0].id);
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === currentSelectedDogId) || dogs[0]
    : dogs[0];

  const oneWeekPrice =
    (await dogs.reduce(async (price, dog) => {
      return (
        (await price) +
        (await calculateTotalPerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
          dog.plan.mealPlan,
          Frequency.OneWeek,
          false
        ))
      );
    }, Promise.resolve(0))) / dogs.length;

  const twoWeekPrice =
    (await dogs.reduce(async (price, dog) => {
      return (
        (await price) +
        (await calculateTotalPerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
          dog.plan.mealPlan,
          Frequency.TwoWeek,
          false
        ))
      );
    }, Promise.resolve(0))) / dogs.length;

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
            {t('how-often-would-you-like-to-receive-deliveries')}
          </h1>
          <OrderSizeForm
            initialFrequency={dog.plan.frequency}
            oneWeekPrice={oneWeekPrice}
            twoWeekPrice={twoWeekPrice}
            endAdornment={
              <div className="mx-auto max-w-[620px] text-center">
                <ShippableNote />
              </div>
            }
            action={async (data) => {
              'use server';
              return await setFrequencyAction({ ...data, id: dog.id });
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
