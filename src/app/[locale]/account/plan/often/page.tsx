import { getTranslations } from 'next-intl/server';
import React from 'react';

import setOrderSizeAction from './action';

import { getLoginedMe } from '@/actions';
import Container from '@/components/Container';
import { ShippableNote } from '@/components/ShippableNote';
import BackButton from '@/components/buttons/BackButton';
import OrderSizeForm from '@/components/forms/OrderSize';
import { Shipment } from '@/entities';
import { OrderSize } from '@/enums';
import { calculateTotalPerDayPrice } from '@/helpers/dog';
import { executeQuery } from '@/helpers/queryRunner';

export default async function PlanOften() {
  const t = await getTranslations();
  const { orderSize, dogs, id } = await getLoginedMe();
  const shipments = await executeQuery(async (queryRunner) => {
    return await queryRunner.manager.find(Shipment, {
      where: {
        boxs: {
          dog: {
            user: { id },
          },
        },
      },
      relations: {
        boxs: {
          dog: true,
          order: true,
        },
      },
      order: {
        deliveryDate: -1,
      },
      take: 2,
    });
  });

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
          OrderSize.OneWeek,
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
          initialSize={orderSize}
          oneWeekPrice={oneWeekPrice}
          twoWeekPrice={twoWeekPrice}
          endAdornment={
            <div className="mx-auto max-w-[620px] text-center">
              <ShippableNote shipments={shipments} />
            </div>
          }
          action={setOrderSizeAction}
        />
        <div className="mt-8 text-center">
          <BackButton label={t('go-back')} />
        </div>
      </Container>
    </main>
  );
}
