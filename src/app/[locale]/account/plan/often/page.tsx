import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import React from 'react';

import DogSwitch from '../../DogSwitch';
import setFrequencyAction from './action';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import OrderSizeForm from '@/components/forms/Frequency';
import ShippableNote from '@/components/notes/Shippable';
import { DOG_SELECT_COOKIE } from '@/consts';
import { Frequency } from '@/enums';
import { calculateTotalPerDayPrice } from '@/helpers/dog';

export default async function PlanOften() {
  const cookie = cookies();
  const t = await getTranslations();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie();
  const { dogs } = await getLoginedMe();
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === parseInt(currentSelectedDogId)) || dogs[0]
    : dogs[0];

  const oneWeekPrice =
    dogs.reduce((price, dog) => {
      return (
        price +
        calculateTotalPerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
          dog.plan.mealPlan,
          Frequency.OneWeek,
          false,
          false
        )
      );
    }, 0) / dogs.length;

  const twoWeekPrice =
    dogs.reduce((price, dog) => {
      return (
        price +
        calculateTotalPerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipe1: dog.plan.recipe1, recipe2: dog.plan.recipe2 },
          dog.plan.mealPlan,
          Frequency.TwoWeek,
          false,
          false
        )
      );
    }, 0) / dogs.length;

  return (
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
        <h1 className="heading-4 text-center font-bold text-primary">
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
  );
}
