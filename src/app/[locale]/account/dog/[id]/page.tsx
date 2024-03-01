import React from 'react';
import Container from '@/components/Container';
import { Dog } from '@/entities';
import Headings from '@/components/Headings';
import AppThemeProvider from '@/components/AppThemeProvider';
import { getStoreMe } from '@/storeUserProvider';
import { executeQuery } from '@/helpers/queryRunner';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import DogForm from '@/components/forms/Dog';
import updateDogAction from './action';

async function getData(id: string) {
  const me = await getStoreMe();

  return executeQuery(async (queryRunner) => {
    const dog = await queryRunner.manager.findOne(Dog, {
      where: {
        id: parseInt(id),
        user: { saleorId: me.id },
      },
      relations: {
        plan: true,
        breeds: {
          breed: true,
        },
      },
    });
    return { dog };
  });
}

export default async function EditDog({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const { dog } = await getData(params.id);

  if (!dog) {
    return notFound();
  }

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <Headings tag="h1" styles="h2" className="text-center text-primary">
            {t('edit-{}-information', { name: dog.name })}
          </Headings>
          <DogForm
            name={dog.name}
            breeds={dog.breeds.map((breed) => breed.breed)}
            gender={dog.sex}
            isNeutered={dog.isNeutered}
            dateOfBirthMethod={dog.dateOfBirthMethod}
            dateOfBirth={dog.dateOfBirth}
            weight={dog.weight}
            bodyCondition={dog.bodyCondition}
            activityLevel={dog.activityLevel}
            allergies={dog.foodAllergies}
            eating={dog.currentEating}
            amountOfTreats={dog.amountOfTreats}
            pickiness={dog.pickiness}
            action={async (data) => {
              'use server';
              return await updateDogAction({ ...data, id: dog.id });
            }}
          />
        </Container>
      </main>
    </AppThemeProvider>
  );
}
