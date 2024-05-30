import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import React from 'react';

import updateDogAction from './action';

import { getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import DogForm from '@/components/forms/Dog';

export default async function EditDog({ params }: { params: { id: string } }) {
  const t = await getTranslations();
  const { dogs } = await getLoginedMe();
  const dog = dogs.find((dog) => dog.id === parseInt(params.id));

  if (!dog) {
    return notFound();
  }

  return (
    <AppThemeProvider
      theme={{
        components: {
          MuiAutocomplete: {
            styleOverrides: {
              inputRoot: {
                paddingTop: 3,
                paddingBottom: 3,
              },
            },
          },
        },
      }}
    >
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <h1 className="heading-4 text-center font-bold text-primary">
            {t('edit-{}-information', { name: dog.name })}
          </h1>
          <DogForm
            name={dog.name}
            breeds={dog.breeds.map(({ breed }) => {
              return {
                id: breed.id,
                name: breed.name,
                size: breed.size,
                uid: breed.uid,
              };
            })}
            sex={dog.sex}
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
