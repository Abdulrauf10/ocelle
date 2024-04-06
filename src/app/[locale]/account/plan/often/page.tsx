import Container from '@/components/Container';
import React from 'react';
import { Dog, User } from '@/entities';
import { getTranslations } from 'next-intl/server';
import { getLoginedMe } from '@/actions';
import { executeQuery } from '@/helpers/queryRunner';
import setOrderSizeAction from './action';
import OrderSizeForm from '@/components/forms/OrderSize';
import BackButton from '@/components/buttons/BackButton';
import { calculateRecipePerDayPrice } from '@/helpers/dog';
import { OrderSize } from '@/enums';

async function fetchData() {
  const me = await getLoginedMe();

  return executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(User, {
      where: {
        id: me.id,
      },
    });
    if (!user) {
      throw new Error('failed to handle request');
    }
    const dogs = await queryRunner.manager.find(Dog, {
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        plan: true,
        breeds: {
          breed: true,
        },
      },
    });
    return { user, dogs };
  });
}

export default async function PlanOften() {
  const t = await getTranslations();
  const { user, dogs } = await fetchData();

  const oneWeekPrice =
    dogs.reduce((price, dog) => {
      return (
        price +
        calculateRecipePerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipeToBeCalcuate: dog.plan.recipe1, recipeReference: dog.plan.recipe2 },
          dog.plan.mealPlan,
          OrderSize.OneWeek,
          false
        )
      );
    }, 0) / dogs.length;

  const twoWeekPrice =
    dogs.reduce((price, dog) => {
      return (
        price +
        calculateRecipePerDayPrice(
          dog.breeds.map(({ breed }) => breed),
          new Date(dog.dateOfBirth),
          dog.isNeutered,
          dog.weight,
          dog.bodyCondition,
          dog.activityLevel,
          { recipeToBeCalcuate: dog.plan.recipe1, recipeReference: dog.plan.recipe2 },
          dog.plan.mealPlan,
          OrderSize.TwoWeek,
          false
        )
      );
    }, 0) / dogs.length;

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('how-often-would-you-like-to-receive-deliveries')}
        </h1>
        <OrderSizeForm
          initialSize={user.orderSize}
          oneWeekPrice={oneWeekPrice}
          twoWeekPrice={twoWeekPrice}
          action={setOrderSizeAction}
        />
        <div className="mt-8 text-center">
          <BackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
