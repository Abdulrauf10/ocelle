'use client';

import { useQuery } from '@tanstack/react-query';
import equal from 'deep-equal';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import pluralize from 'pluralize';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { roundTo } from 'round-to';

import Button from '../buttons/Button';
import RecipeCheckbox from '../controls/RecipeCheckbox';
import PlasticBox from '../layouts/PlasticBox';

import { ActivityLevel, BodyCondition, FoodAllergies, Pickiness, Recipe } from '@/enums';
import DogHelper from '@/helpers/dog';
import { arrayToRecipe, recipeToArray } from '@/helpers/form';
import RecipeHelper from '@/helpers/recipe';
import useDefaultValues from '@/hooks/defaultValues';

interface RecipeForm {
  recipe: boolean[];
}

export default function RecipeForm({
  name,
  pickiness,
  activityLevel,
  bodyCondition,
  foodAllergies,
  initialRecipe1,
  initialRecipe2,
  fetchBoxPrice,
  action,
}: {
  name: string;
  pickiness: Pickiness;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  foodAllergies: FoodAllergies;
  initialRecipe1: Recipe;
  initialRecipe2?: Recipe;
  fetchBoxPrice(data: {
    recipe1?: Recipe;
    recipe2?: Recipe;
  }): Promise<{ total: number; daily: number } | undefined>;
  action(data: { recipe1: Recipe; recipe2?: Recipe }): Promise<void>;
}) {
  const t = useTranslations();
  const i = useTranslations('Ingredients');
  const { defaultValues, setDefaultValues } = useDefaultValues({
    recipe: recipeToArray(initialRecipe1, initialRecipe2),
  });
  const [pending, startTransition] = React.useTransition();
  const {
    formState: { errors },
    control,
    reset,
    watch,
    handleSubmit,
    getValues,
    trigger,
    setValue,
  } = useForm<RecipeForm>({ defaultValues });
  const recipeValues = watch('recipe');
  const recipes = arrayToRecipe(recipeValues);
  const { data: boxPrice, isLoading } = useQuery({
    queryKey: ['boxPrice', recipes.recipe1, recipes.recipe2],
    queryFn: () => fetchBoxPrice(recipes),
  });

  React.useEffect(() => {
    setValue('recipe', recipeToArray(initialRecipe1, initialRecipe2));
    setDefaultValues({ recipe: recipeToArray(initialRecipe1, initialRecipe2) });
  }, [initialRecipe1, initialRecipe2, setValue, setDefaultValues]);

  const validateRecipeCheckbox = () => {
    const values = getValues('recipe');
    if (!Array.isArray(values)) {
      return false;
    }
    if (!values.some((value) => !!value)) {
      // all elements are false
      return 'you must select at least one recipe';
    }
    return true;
  };

  const onSubmit = React.useCallback(
    ({ recipe }: RecipeForm) => {
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      startTransition(async () => {
        await action({ recipe1: recipe1!, recipe2 });
        setDefaultValues({ recipe: recipeToArray(recipe1, recipe2) });
        //TODO
        toast.success(
          `Your recipe selection for ${name}’s upcoming box has been successfully updated.`
        );
      });
    },
    [name, action, setDefaultValues]
  );

  const isSameAsDefaultValue = equal(watch('recipe'), defaultValues.recipe);
  const containsTwoRecipes = watch('recipe').filter((x) => x === true).length >= 2;

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto flex max-w-[820px] flex-wrap justify-center">
        <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
          <RecipeCheckbox
            title="Fresh Chicken Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.0"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/chicken.jpg"
            dialogPicture={
              <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                <Image src="/plastic/background/chicken.jpg" alt="" fill />
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                  <PlasticBox name={name!} recipe={Recipe.Chicken} />
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
            disabled={
              DogHelper.isAllergies(Recipe.Chicken, foodAllergies!) ||
              (containsTwoRecipes && !watch('recipe')[0])
            }
            onChange={() => trigger('recipe')}
          />
        </div>
        <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
          <RecipeCheckbox
            title="Fresh Pork Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.1"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/pork.jpg"
            dialogPicture={
              <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                <Image src="/plastic/background/pork.jpg" alt="" fill />
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                  <PlasticBox name={name!} recipe={Recipe.Pork} />
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
            disabled={
              DogHelper.isAllergies(Recipe.Pork, foodAllergies!) ||
              (containsTwoRecipes && !watch('recipe')[1])
            }
            onChange={() => trigger('recipe')}
          />
        </div>
        <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
          <RecipeCheckbox
            title="Fresh Duck Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.2"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/duck.jpg"
            dialogPicture={
              <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                <Image src="/plastic/background/duck.jpg" alt="" fill />
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                  <PlasticBox name={name!} recipe={Recipe.Duck} />
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
            disabled={
              DogHelper.isAllergies(Recipe.Duck, foodAllergies!) ||
              (containsTwoRecipes && !watch('recipe')[2])
            }
            onChange={() => trigger('recipe')}
          />
        </div>
        <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
          <RecipeCheckbox
            title="Fresh Beef Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.3"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/beef.jpg"
            dialogPicture={
              <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                <Image src="/plastic/background/beef.jpg" alt="" fill />
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                  <PlasticBox name={name!} recipe={Recipe.Beef} />
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
            disabled={
              DogHelper.isAllergies(Recipe.Beef, foodAllergies!) ||
              (containsTwoRecipes && !watch('recipe')[3])
            }
            onChange={() => trigger('recipe')}
          />
        </div>
        <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
          <RecipeCheckbox
            title="Fresh Lamb Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.4"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/lamb.jpg"
            dialogPicture={
              <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                <Image src="/plastic/background/lamb.jpg" alt="" fill />
                <div className="absolute bottom-2 left-0 right-0 mx-auto w-[70%]">
                  <PlasticBox name={name!} recipe={Recipe.Lamb} />
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
            disabled={
              DogHelper.isAllergies(Recipe.Lamb, foodAllergies!) ||
              (containsTwoRecipes && !watch('recipe')[4])
            }
            onChange={() => trigger('recipe')}
          />
        </div>
      </div>
      {boxPrice && (
        <div className="mt-10 text-center font-bold text-dark-green">
          Total Price: ${roundTo(boxPrice.total, 1)} (${roundTo(boxPrice.daily, 1)}/Day)
        </div>
      )}
      <div className="mx-auto mt-10 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => reset(defaultValues)}
              reverse
              disabled={isSameAsDefaultValue || !recipes.recipe1}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending || isSameAsDefaultValue || !recipes.recipe1}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
