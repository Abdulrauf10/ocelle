import { getTranslations } from 'next-intl/server';

import DogSwitch from '../../DogSwitch';
import { calculateBoxPrice, setRecipeAction } from './actions';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';
import RecipeForm from '@/components/forms/Recipe';
import RecurringBoxNote from '@/components/notes/RecurringBox';

export default async function PlanRecipe() {
  const t = await getTranslations();
  const { dogs } = await getLoginedMe();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie(dogs[0].id);
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === currentSelectedDogId) || dogs[0]
    : dogs[0];

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
          <p className="mx-auto mt-4 max-w-[620px] text-center text-primary">
            {t('select-up-to-{}-suitable-recipes-below', { value: 2 })}
          </p>
          <div className="mt-5">
            <RecipeForm
              name={dog.name}
              pickiness={dog.pickiness}
              activityLevel={dog.activityLevel}
              bodyCondition={dog.bodyCondition}
              foodAllergies={dog.foodAllergies}
              initialRecipe1={dog.plan.recipe1}
              initialRecipe2={dog.plan.recipe2}
              fetchBoxPrice={async (data) => {
                'use server';
                return await calculateBoxPrice({ ...data, id: dog.id });
              }}
              action={async (data) => {
                'use server';
                return await setRecipeAction({ ...data, id: dog.id });
              }}
            />
          </div>
          <div className="mt-8 text-center">
            <UnderlineBackButton label={t('go-back')} />
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
