import { queryOptions, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import pluralize from 'pluralize';
import React from 'react';
import { UseFormWatch, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import roundTo from 'round-to';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { getBoxPrices } from '../actions';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Price from '@/components/Price';
import Button from '@/components/buttons/Button';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import RecipeCheckbox from '@/components/controls/RecipeCheckbox';
import CircleTick from '@/components/icons/CircleTick';
import PlasticBox from '@/components/layouts/PlasticBox';
import PlasticBoxPreview from '@/components/layouts/PlasticBoxPreview';
import { ActivityLevel, BodyCondition, MealPlan, Recipe } from '@/enums';
import { PadSpace } from '@/enums';
import { formatCurrency } from '@/helpers/currency';
import DogHelper from '@/helpers/dog';
import { arrayToRecipe, getRecipeOptions, recipeToArray } from '@/helpers/form';
import RecipeHelper from '@/helpers/recipe';
import { booleanToString, stringToBoolean } from '@/helpers/string';
import useSentence from '@/hooks/useSentence';
import { BreedDto } from '@/types/dto';

interface RecommendedPlanForm {
  transition: 'Y' | 'N';
  recipe: boolean[];
}

function recipesBoxPriceOptions(
  breeds: BreedDto[],
  age:
    | string
    | {
        years: number;
        months: number;
      },
  isNeutered: boolean,
  weight: number,
  bodyCondition: BodyCondition,
  activityLevel: ActivityLevel,
  recipes: { recipe1?: Recipe; recipe2?: Recipe },
  mealPlan: MealPlan,
  isEnabledTransitionPeriod: boolean
) {
  const dateOfBirth =
    typeof age === 'string' ? age : DogHelper.getDateOfBirth(age?.years, age?.months).toISOString();
  return queryOptions({
    queryKey: [
      'recommendedPlan',
      JSON.stringify(breeds),
      dateOfBirth,
      isNeutered,
      weight,
      bodyCondition,
      activityLevel,
      recipes.recipe1,
      recipes.recipe2,
      mealPlan,
      isEnabledTransitionPeriod,
    ],
    queryFn: () =>
      getBoxPrices(
        breeds,
        dateOfBirth,
        isNeutered,
        weight,
        bodyCondition,
        activityLevel,
        recipes,
        mealPlan,
        isEnabledTransitionPeriod
      ),
  });
}

function useRecipeStatus(watch: UseFormWatch<RecommendedPlanForm>) {
  const recipes = watch('recipe');

  return {
    recipes: arrayToRecipe(recipes),
    selectedRecipes: recipes.filter((x) => x === true).length > 0,
    containsTwoRecipes: recipes.filter((x) => x === true).length >= 2,
  };
}

export default function RecommendedPlanFragment() {
  const t = useTranslations();
  const r = useTranslations('Recipes');
  const i = useTranslations('Ingredients');
  const sentence = useSentence();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDog, setDog, nextDog } = useSurvey();
  const {
    name,
    age,
    breeds,
    isNeutered,
    weight,
    pickiness,
    activityLevel,
    bodyCondition,
    foodAllergies,
    mealPlan,
    recipe1,
    recipe2,
    isEnabledTransitionPeriod,
  } = getDog(location.state?.dogIndex);
  const {
    control,
    watch,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RecommendedPlanForm>({
    defaultValues: {
      recipe: recipeToArray(recipe1, recipe2),
      transition: booleanToString(isEnabledTransitionPeriod) ?? 'Y',
    },
  });
  const { recipes, selectedRecipes, containsTwoRecipes } = useRecipeStatus(watch);
  const enabledTransitionPeriod = stringToBoolean(watch('transition'));
  const { data: boxPrice, isLoading } = useQuery({
    ...recipesBoxPriceOptions(
      breeds!,
      age!,
      isNeutered!,
      weight!,
      bodyCondition!,
      activityLevel!,
      recipes,
      mealPlan!,
      enabledTransitionPeriod!
    ),
    enabled: !!name,
  });

  const validateRecipeCheckbox = React.useCallback(() => {
    const values = getValues('recipe');
    if (!Array.isArray(values)) {
      return false;
    }
    if (!values.some((value) => !!value)) {
      // all elements are false
      return 'you must select at least one recipe';
    }
    return true;
  }, [getValues]);

  const handleAddDog = React.useCallback(async () => {
    if (await trigger()) {
      const { transition, recipe } = getValues();
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      setDog({ recipe1, recipe2, isEnabledTransitionPeriod: stringToBoolean(transition) });
      navigate(Stage.Dog);
      nextDog();
    }
  }, [trigger, navigate, nextDog, setDog, getValues]);

  const onSubmit = React.useCallback(
    ({ transition, recipe }: RecommendedPlanForm) => {
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      setDog(
        { recipe1, recipe2, isEnabledTransitionPeriod: stringToBoolean(transition) },
        location.state?.dogIndex
      );
      if (location.state?.isEdit) {
        navigate(Stage.Processing, { replace: true });
      } else {
        navigate(Stage.Processing);
      }
    },
    [navigate, setDog, location.state]
  );

  const targetedNutrientBlendIngredients = [
    t('selenium-yeast'),
    t('vitamin-a-supplement'),
    t('thiamine-hydrochloride-vitamin-b1'),
    t('riboflavin-vitamin-b2'),
    t('niacin-vitamin-b3'),
    t('pyridoxine-hydrochloride-vitamin-b6'),
    t('folic-acid-vitamin-b9'),
    t('cholecalciferol-vitamin-b12'),
    t('vitamin-d3-supplement'),
    t('sodium-chloride'),
    t('tricalcium-phosphate'),
    t('iron-amino-acid-chelate'),
    t('potassium-chloride'),
    t('potassium-iodide'),
    t('zinc-amino-acid-chelate'),
    t('magnesium-amino-acid-chelate'),
    t('manganese-amino-acid-chelate'),
    t('copper-amino-acid-chelate'),
    t('taurine'),
    t('choline-bitartrate'),
  ];

  const defaultRecommendedRecipes = React.useMemo(() => {
    let recipe1: Recipe | undefined = undefined;
    let recipe2: Recipe | undefined = undefined;

    for (const recipe of getRecipeOptions()) {
      const recommended = RecipeHelper.isRecommended(
        recipe,
        pickiness!,
        activityLevel!,
        bodyCondition!,
        foodAllergies!
      );
      if (recommended) {
        if (!recipe1) recipe1 = recipe;
        else if (!recipe2) recipe2 = recipe;
        else break;
      }
    }

    if (!recipe1) {
      for (const recipe of getRecipeOptions()) {
        if (!recipe1 && !DogHelper.isAllergies(recipe, foodAllergies!)) {
          recipe1 = recipe;
        }
      }
    }

    return { recipe1, recipe2 };
  }, [pickiness, activityLevel, bodyCondition, foodAllergies]);

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <form className="text-center" onSubmit={handleSubmit(onSubmit)}>
        <Section
          className="px-4"
          title={t.rich('{}-recommended-plan', {
            name: sentence.padSpace(PadSpace.Both, name),
            span: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
          })}
          description={
            <span className="not-italic">
              {t.rich('{}-recommended-plan:description', {
                name: sentence.padSpace(PadSpace.Both, name),
                br: () => <br className="max-md:hidden" />,
              })}
            </span>
          }
        >
          <div className="-mb-[30px] bg-[#F8F3EB] pb-[40px] pt-5">
            <Container>
              <div className="-mx-2 flex justify-center">
                <div className="px-2">
                  <p className="body-3 text-primary">
                    {t.rich(
                      'feel-free-to-adjust-{}-meal-plan-by-selecting-from-up-to-suitable-recipes-below',
                      { name: sentence.padSpace(PadSpace.Both, name), recipes: 2 }
                    )}
                  </p>
                  <div className="mt-5"></div>
                  <div className="flex max-w-[820px] flex-wrap justify-center">
                    <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <RecipeCheckbox
                        title={sentence.recipe(Recipe.Chicken)}
                        description={r('chicken:description')}
                        name="recipe.0"
                        control={control}
                        rules={{
                          validate: validateRecipeCheckbox,
                        }}
                        picture="/meal-plan/chicken.jpg"
                        dialogPicture={
                          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#95cfd0] from-30% to-white max-md:pt-[100%]">
                            <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                              <PlasticBox name={name ?? ''} recipe={Recipe.Chicken} />
                            </div>
                          </div>
                        }
                        price="cheap"
                        ingredients={[
                          i('chicken-breast'),
                          i('chicken-liver'),
                          i('whole-grain-rice'),
                          pluralize.plural(i('shiitake-mushroom')),
                          i('spinach'),
                          i('peas'),
                          pluralize.plural(i('cranberry')),
                          i('flaxseed'),
                          i('salmon-oil'),
                          i('ocelle-targeted-nutrient-blend'),
                        ]}
                        targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                        calorie={1540}
                        analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
                        recommended={RecipeHelper.isRecommended(
                          Recipe.Chicken,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={DogHelper.isAllergies(Recipe.Chicken, foodAllergies!)}
                        readonly={containsTwoRecipes && !watch('recipe')[0]}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <RecipeCheckbox
                        title={sentence.recipe(Recipe.Pork)}
                        description={r('pork:description')}
                        name="recipe.1"
                        control={control}
                        rules={{
                          validate: validateRecipeCheckbox,
                        }}
                        picture="/meal-plan/pork.jpg"
                        dialogPicture={
                          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#97cfea] from-30% to-white max-md:pt-[100%]">
                            <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                              <PlasticBox name={name ?? ''} recipe={Recipe.Pork} />
                            </div>
                          </div>
                        }
                        price="cheap"
                        ingredients={[
                          i('pork-loin'),
                          i('pork-liver'),
                          i('celery'),
                          pluralize.plural(i('potato')),
                          i('spinach'),
                          i('peas'),
                          pluralize.plural(i('blueberry')),
                          i('flaxseed'),
                          i('salmon-oil'),
                          i('ocelle-targeted-nutrient-blend'),
                        ]}
                        targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                        calorie={1540}
                        analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
                        recommended={RecipeHelper.isRecommended(
                          Recipe.Pork,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={DogHelper.isAllergies(Recipe.Pork, foodAllergies!)}
                        readonly={containsTwoRecipes && !watch('recipe')[1]}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <RecipeCheckbox
                        title={sentence.recipe(Recipe.Duck)}
                        description={r('duck:description')}
                        name="recipe.2"
                        control={control}
                        rules={{
                          validate: validateRecipeCheckbox,
                        }}
                        picture="/meal-plan/duck.jpg"
                        dialogPicture={
                          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#f9cc81] from-30% to-white max-md:pt-[100%]">
                            <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                              <PlasticBox name={name ?? ''} recipe={Recipe.Duck} />
                            </div>
                          </div>
                        }
                        price="expensive"
                        ingredients={[
                          i('duck-breast'),
                          i('chicken-liver'),
                          i('whole-grain-pasta'),
                          i('winter-melon'),
                          i('peas'),
                          pluralize.plural(i('goji-berry')),
                          i('flaxseed'),
                          i('salmon-oil'),
                          i('ocelle-targeted-nutrient-blend'),
                        ]}
                        targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                        calorie={1540}
                        analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
                        recommended={RecipeHelper.isRecommended(
                          Recipe.Duck,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={DogHelper.isAllergies(Recipe.Duck, foodAllergies!)}
                        readonly={containsTwoRecipes && !watch('recipe')[2]}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <RecipeCheckbox
                        title={sentence.recipe(Recipe.Beef)}
                        description={r('beef:description')}
                        name="recipe.3"
                        control={control}
                        rules={{
                          validate: validateRecipeCheckbox,
                        }}
                        picture="/meal-plan/beef.jpg"
                        dialogPicture={
                          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#f7c1b5] from-30% to-white max-md:pt-[100%]">
                            <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                              <PlasticBox name={name ?? ''} recipe={Recipe.Beef} />
                            </div>
                          </div>
                        }
                        price="normal"
                        ingredients={[
                          i('beef-chuck'),
                          i('beef-liver'),
                          pluralize.plural(i('potato')),
                          pluralize.plural(i('carrot')),
                          i('kale'),
                          i('peas'),
                          pluralize.plural(i('blueberry')),
                          i('flaxseed'),
                          i('salmon-oil'),
                          i('ocelle-targeted-nutrient-blend'),
                        ]}
                        targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                        calorie={1540}
                        analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
                        recommended={RecipeHelper.isRecommended(
                          Recipe.Beef,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={DogHelper.isAllergies(Recipe.Beef, foodAllergies!)}
                        readonly={containsTwoRecipes && !watch('recipe')[3]}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <RecipeCheckbox
                        title={sentence.recipe(Recipe.Lamb)}
                        description={r('lamb:description')}
                        name="recipe.4"
                        control={control}
                        rules={{
                          validate: validateRecipeCheckbox,
                        }}
                        picture="/meal-plan/lamb.jpg"
                        dialogPicture={
                          <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#cae8b8] from-30% to-white max-md:pt-[100%]">
                            <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                              <PlasticBox name={name ?? ''} recipe={Recipe.Lamb} />
                            </div>
                          </div>
                        }
                        price="expensive"
                        ingredients={[
                          i('lamb-leg-boneless'),
                          i('beef-liver'),
                          i('whole-grain-rice'),
                          i('peas'),
                          i('spinach'),
                          pluralize.plural(i('blueberry')),
                          i('flaxseed'),
                          i('salmon-oil'),
                          i('ocelle-targeted-nutrient-blend'),
                        ]}
                        targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
                        calorie={1540}
                        analysis={{ protein: 19, fat: 5, fibre: 2, moisture: 60 }}
                        recommended={RecipeHelper.isRecommended(
                          Recipe.Lamb,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={DogHelper.isAllergies(Recipe.Lamb, foodAllergies!)}
                        readonly={containsTwoRecipes && !watch('recipe')[4]}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 flex items-center px-5 max-xl:w-full">
                      <div className="relative mx-auto w-full max-w-[520px]">
                        <PlasticBoxPreview
                          name={name ?? ''}
                          recipe1={
                            recipes.recipe1 ?? defaultRecommendedRecipes.recipe1 ?? Recipe.Pork
                          }
                          recipe2={
                            recipes.recipe1 ? recipes.recipe2 : defaultRecommendedRecipes.recipe2
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-auto px-2 max-xl:hidden">
                  <div className="flex h-full items-center pt-[40px]">
                    <PlasticBoxPreview
                      name={name ?? ''}
                      recipe1={recipes.recipe1 ?? defaultRecommendedRecipes.recipe1 ?? Recipe.Pork}
                      recipe2={
                        recipes.recipe1 ? recipes.recipe2 : defaultRecommendedRecipes.recipe2
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-10 max-w-[840px] rounded-[20px] border border-primary bg-white p-7 text-primary shadow-black/20 drop-shadow-style-1 lang-zh:p-6">
                <h2 className="heading-4 font-bold">
                  {t('use-a-transition-period-in-starter-box')}
                </h2>
                <div className="mt-5"></div>
                <p className="body-3">
                  {t.rich('use-a-transition-period-in-starter-box:description', {
                    br: () => <br className="max-md:hidden" />,
                  })}
                </p>
                <div className="my-3 flex flex-wrap justify-center">
                  <div className="mt-4 px-2">
                    <InteractiveBlock
                      type="radio"
                      value="Y"
                      control={control}
                      name="transition"
                      label={(checked) => {
                        if (!checked) {
                          return t('use-transition');
                        }
                        return (
                          <>
                            <CircleTick className="-mt-0.5 mr-2 inline-block h-4 w-4" />
                            {t('use-transition')}
                          </>
                        );
                      }}
                      rules={{ required: true }}
                      error={!!errors?.transition}
                      className="w-[180px]"
                    />
                  </div>
                  <div className="mt-4 px-2">
                    <InteractiveBlock
                      type="radio"
                      value="N"
                      control={control}
                      name="transition"
                      label={(checked) => {
                        if (!checked) {
                          return t('dont-use-transition');
                        }
                        return (
                          <>
                            <CircleTick className="-mt-0.5 mr-2 inline-block h-4 w-4" />
                            {t('dont-use-transition')}
                          </>
                        );
                      }}
                      rules={{ required: true }}
                      error={!!errors?.transition}
                      className="w-[180px]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-12"></div>
              {selectedRecipes && !isLoading && boxPrice && (
                <div className="flex flex-wrap items-center justify-center">
                  <Image
                    src="/get-started/eat-anything-gold.svg"
                    alt="Eating Dog"
                    width={60}
                    height={70}
                  />
                  <div className="relative top-1 my-2 ml-3 inline-flex flex-wrap items-center justify-center text-primary">
                    <div className="mr-1">{t('{}-colon', { value: t('starter-box') })}</div>
                    <div>
                      <span className="inline-block">
                        <Price value={formatCurrency(roundTo(boxPrice.total, 1))} discount />
                        <Price
                          className="ml-1 font-bold"
                          value={formatCurrency(roundTo(boxPrice.discountedTotal, 2))}
                        />{' '}
                        (
                        <Price value={formatCurrency(roundTo(boxPrice.daily, 2))} discount />
                        <Price
                          className="ml-1 font-bold"
                          value={formatCurrency(roundTo(boxPrice.discountedDaily, 2))}
                        />
                        <span className="font-bold text-dark-green">{t('per-day')}</span>)
                      </span>
                      &nbsp;
                      <span className="inline-block">{t('with-your-starter-discount')}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4"></div>
              <div className="-my-2 flex flex-wrap justify-center">
                <div className="py-2">
                  <Button
                    theme="primary"
                    className="mx-2 !bg-none !px-[54px]"
                    type="button"
                    onClick={handleAddDog}
                    disabled={!isValid}
                    disableIcon
                  >
                    + {t.rich('add-another-dog')}
                  </Button>
                </div>
                <div className="py-2">
                  <Button className="mx-2" disabled={!isValid}>
                    {t('continue-to-{}', { name: t('checkout') })}
                  </Button>
                </div>
              </div>
              <div className="mt-[1vw]"></div>
            </Container>
          </div>
        </Section>
      </form>
    </motion.div>
  );
}
