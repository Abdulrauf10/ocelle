import React from 'react';
import Container from '@/components/Container';
import DogSwitch from '../../DogSwitch';
import AppThemeProvider from '@/components/AppThemeProvider';
import { executeQuery } from '@/helpers/queryRunner';
import { Dog } from '@/entities';
import { getTranslations } from 'next-intl/server';
import FreshPlanForm from '@/components/forms/FreshPlan';
import setMealPlanAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { getLoginedMe } from '@/actions';

async function getData() {
  const me = await getLoginedMe();

  return executeQuery(async (queryRunner) => {
    const dogs = await queryRunner.manager.find(Dog, {
      where: {
        user: { id: me.id },
      },
      relations: {
        plan: true,
      },
    });
    return { dogs };
  });
}

export default async function PlanMeal({ searchParams }: { searchParams: { current?: string } }) {
  const { dogs } = await getData();
  const t = await getTranslations();
  const dog = searchParams.current
    ? dogs.find((dog) => dog.id === parseInt(searchParams.current!)) || dogs[0]
    : dogs[0];

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch dogs={dogs.map((dog) => ({ id: dog.id, name: dog.name }))} />
          </div>
          <h1 className="heading-4 text-center font-bold text-primary max-lg:mt-6">
            {t('choose-{}-fresh-recipes', { name: dog.name })}
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
              name: dog.name,
              date: '15th of December 2023',
              strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
            })}
          </p>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            {t.rich('you-can-make-changes-until-the-{}', {
              date: '15th of December 2023',
              strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
            })}
          </p>
          <FreshPlanForm
            initialPlan={dog.plan.mealPlan}
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
