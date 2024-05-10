import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import pluralize from 'pluralize';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Price from '@/components/Price';
import Button from '@/components/buttons/Button';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import RecipeCheckbox from '@/components/controls/RecipeCheckbox';
import { Recipe } from '@/enums';
import { isAllergies, isRecommendedRecipe } from '@/helpers/dog';
import { arrayToRecipe, recipeToArray } from '@/helpers/form';
import { booleanToString, stringToBoolean } from '@/helpers/string';
import useSentence from '@/hooks/useSentence';

interface RecommendedPlanForm {
  transition: 'Y' | 'N';
  recipe: boolean[];
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
    pickiness,
    activityLevel,
    bodyCondition,
    foodAllergies,
    recipe1,
    recipe2,
    isEnabledTransitionPeriod,
  } = getDog();
  const {
    control,
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

  const validateRecipeCheckbox = () => {
    const values = getValues('recipe');
    if (!Array.isArray(values)) {
      return false;
    }
    if (!values.some((value) => !!value)) {
      // all elements are false
      return 'you must select at least one recipe';
    }
    if (values.filter((value) => !!value).length > 2) {
      return 'you must select not more than 2 recipes';
    }
    return true;
  };

  const handleAddDog = React.useCallback(async () => {
    if (await trigger()) {
      const { transition, recipe } = getValues();
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      setDog({ recipe1, recipe2, isEnabledTransitionPeriod: stringToBoolean(transition) });
      nextDog();
      navigate(Stage.Dog);
    }
  }, [trigger, navigate, nextDog, setDog, getValues]);

  const onSubmit = React.useCallback(
    ({ transition, recipe }: RecommendedPlanForm) => {
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      setDog({ recipe1, recipe2, isEnabledTransitionPeriod: stringToBoolean(transition) });
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

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <form className="text-center" onSubmit={handleSubmit(onSubmit)}>
        <Section
          className="px-4"
          title={t.rich('{}-recommended-plan', {
            name,
            span: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
          })}
          description={
            <span className="not-italic">
              {t.rich('{}-recommended-plan:description', {
                name,
                br: () => <br className="max-md:hidden" />,
              })}
            </span>
          }
        >
          <div className="-mb-[clamp(16px,2.4vw,35px)] bg-[#F8F3EB] pb-[40px] pt-5">
            <Container>
              <div className="flex justify-center">
                <div className="">
                  <p className="body-3 text-primary">
                    {t.rich(
                      'feel-free-to-adjust-{}-meal-plan-by-selecting-from-up-to-suitable-recipes-below',
                      { name, recipes: 2 }
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
                        error={!!errors?.recipe}
                        picture="/meal-plan/chicken.jpg"
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
                        recommended={isRecommendedRecipe(
                          Recipe.Chicken,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={isAllergies(Recipe.Chicken, foodAllergies!)}
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
                        error={!!errors?.recipe}
                        picture="/meal-plan/pork.jpg"
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
                        recommended={isRecommendedRecipe(
                          Recipe.Pork,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={isAllergies(Recipe.Pork, foodAllergies!)}
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
                        error={!!errors?.recipe}
                        picture="/meal-plan/duck.jpg"
                        price="normal"
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
                        recommended={isRecommendedRecipe(
                          Recipe.Duck,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={isAllergies(Recipe.Duck, foodAllergies!)}
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
                        error={!!errors?.recipe}
                        picture="/meal-plan/beef.jpg"
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
                        recommended={isRecommendedRecipe(
                          Recipe.Beef,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={isAllergies(Recipe.Beef, foodAllergies!)}
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
                        error={!!errors?.recipe}
                        picture="/meal-plan/lamb.jpg"
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
                        recommended={isRecommendedRecipe(
                          Recipe.Lamb,
                          pickiness!,
                          activityLevel!,
                          bodyCondition!,
                          foodAllergies!
                        )}
                        disabled={isAllergies(Recipe.Lamb, foodAllergies!)}
                        onChange={() => trigger('recipe')}
                      />
                    </div>
                    <div className="mt-5 flex items-center px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                      <div className="relative w-full pt-[100%]">
                        <Image
                          src="/ocelle-food.png"
                          alt="ocelle food"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-auto items-center max-xl:hidden">
                  <div className="relative w-full pt-[112.8%]">
                    <Image
                      src="/ocelle-food.png"
                      alt="ocelle food"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-10 max-w-[840px] rounded-[20px] border border-primary bg-white p-7 text-primary shadow-[3px_3px_10px_rgba(0,0,0,.2)]">
                <h2 className="heading-4 font-bold">
                  {t('use-a-transition-period-in-starter-box')}
                </h2>
                <div className="mt-5"></div>
                <p className="body-3">{t('use-a-transition-period-in-starter-box:description')}</p>
                <div className="my-3 flex flex-wrap justify-center">
                  <div className="mt-4 px-2">
                    <InteractiveBlock
                      type="radio"
                      value="N"
                      control={control}
                      name="transition"
                      label={t('dont-use-transition')}
                      rules={{ required: true }}
                      error={!!errors?.transition}
                      className="w-[180px]"
                    />
                  </div>
                  <div className="mt-4 px-2">
                    <InteractiveBlock
                      type="radio"
                      value="Y"
                      control={control}
                      name="transition"
                      label={t('use-transition')}
                      rules={{ required: true }}
                      error={!!errors?.transition}
                      className="w-[180px]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center">
                <Image
                  src="/question/eat-anything-gold.svg"
                  alt="Eating Dog"
                  width={60}
                  height={70}
                />
                <div className="my-2 ml-3 inline-flex flex-wrap items-center justify-center text-primary">
                  <div className="mr-1">{t('{}-colon', { value: t('starter-box') })}</div>
                  <div>
                    <span className="inline-block">
                      <Price value={504} discount />
                      <Price className="ml-1 font-bold" value={252} /> (
                      <Price value={36} discount />
                      <Price className="ml-1 font-bold" value={18} />
                      <span className="font-bold text-dark-green">{t('per-day')}</span>)
                    </span>
                    &nbsp;
                    <span className="inline-block">{t('with-your-starter-discount')}</span>
                  </div>
                </div>
              </div>
              <div className="mb-[1vw]">
                <Button
                  theme="primary"
                  className="mx-2 mt-4 !bg-none !px-11"
                  type="button"
                  onClick={handleAddDog}
                  disabled={!isValid}
                >
                  + {t('add-another-dog')}
                </Button>
                <Button className="mx-2 mt-4" disabled={!isValid}>
                  {t('continue-to-{}', { name: t('checkout') })}
                </Button>
              </div>
            </Container>
          </div>
        </Section>
      </form>
    </motion.div>
  );
}
