import Container from '@/components/Container';
import DogSwitch from '../../DogSwitch';
import AppThemeProvider from '@/components/AppThemeProvider';
import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import { getTranslations } from 'next-intl/server';
import RecipeForm from '@/components/forms/Recipe';
import setRecipeAction from './action';
import BackButton from '@/components/buttons/BackButton';
import { cookies } from 'next/headers';
import { DOG_SELECT_COOKIE } from '@/consts';
import { executeQuery } from '@/helpers/queryRunner';
import { RecurringBox } from '@/entities';
import { DogBoxNote } from '@/components/DogBoxNote';

export default async function PlanRecipe() {
  const cookie = cookies();
  const t = await getTranslations();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie();
  const { dogs } = await getLoginedMe();
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
          <p className="mx-auto mt-4 max-w-[620px] text-center text-primary">
            {t('select-up-to-{}-suitable-recipes-below', { value: 2 })}
          </p>
          <div className="mt-5">
            <RecipeForm
              pickiness={dog.pickiness}
              activityLevel={dog.activityLevel}
              bodyCondition={dog.bodyCondition}
              foodAllergies={dog.foodAllergies}
              initialRecipe1={dog.plan.recipe1}
              initialRecipe2={dog.plan.recipe2}
              action={async (data) => {
                'use server';
                return await setRecipeAction({ ...data, id: dog.id });
              }}
            />
          </div>
          <div className="mt-8 text-center">
            <BackButton label={t('go-back')} />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
