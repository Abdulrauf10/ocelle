'use client';

import { FoodAllergies, Recipe } from '@/enums';
import { useForm } from 'react-hook-form';
import RecipeCheckbox from '../controls/RecipeCheckbox';
import Button from '../buttons/Button';
import { useTranslations } from 'next-intl';
import { isAllergies, isRecommendedRecipe } from '@/helpers/dog';
import { ActivityLevel, BodyCondition, Pickiness } from '@/types';
import React from 'react';
import { arrayToRecipe, recipeToArray } from '@/helpers/form';
import equal from 'deep-equal';
import pluralize from 'pluralize';
import useDefaultValues from '@/hooks/defaultValues';

interface RecipeForm {
  recipe: boolean[];
}

export default function RecipeForm({
  pickiness,
  activityLevel,
  bodyCondition,
  foodAllergies,
  initialRecipe1,
  initialRecipe2,
  action,
}: {
  pickiness: Pickiness;
  activityLevel: ActivityLevel;
  bodyCondition: BodyCondition;
  foodAllergies: FoodAllergies;
  initialRecipe1: Recipe;
  initialRecipe2?: Recipe;
  action(data: { recipe1: Recipe; recipe2?: Recipe }): Promise<void>;
}) {
  const t = useTranslations();
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
    if (values.filter((value) => !!value).length > 2) {
      return 'you must select not more than 2 recipes';
    }
    return true;
  };

  const onSubmit = React.useCallback(
    ({ recipe }: RecipeForm) => {
      const { recipe1, recipe2 } = arrayToRecipe(recipe);
      startTransition(async () => {
        await action({ recipe1: recipe1!, recipe2 });
        setDefaultValues({ recipe: recipeToArray(recipe1, recipe2) });
      });
    },
    [action, setDefaultValues]
  );

  const isSameAsDefaultValue = equal(watch('recipe'), defaultValues.recipe);

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
            ingredients={[
              t('chicken-breast'),
              t('chicken-liver'),
              t('whole-grain-rice'),
              pluralize.plural(t('shiitake-mushroom')),
              t('spinach'),
              t('peas'),
              pluralize.plural(t('cranberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
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
            title="Fresh Pork Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.1"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/pork.jpg"
            ingredients={[
              t('pork-loin'),
              t('pork-liver'),
              t('celery'),
              pluralize.plural(t('potato')),
              t('spinach'),
              t('peas'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
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
            title="Fresh Duck Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.2"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/duck.jpg"
            ingredients={[
              t('duck-breast'),
              t('chicken-liver'),
              t('whole-grain-pasta'),
              t('winter-melon'),
              t('peas'),
              pluralize.plural(t('goji-berry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
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
            title="Fresh Beef Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.3"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/beef.jpg"
            ingredients={[
              t('beef-chuck'),
              t('beef-liver'),
              pluralize.plural(t('potato')),
              pluralize.plural(t('carrot')),
              t('kale'),
              t('peas'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
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
            title="Fresh Lamb Recipe"
            description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
            name="recipe.4"
            control={control}
            rules={{
              validate: validateRecipeCheckbox,
            }}
            error={!!errors?.recipe}
            picture="/meal-plan/lamb.jpg"
            ingredients={[
              t('lamb-leg-boneless'),
              t('beef-liver'),
              t('whole-grain-rice'),
              t('peas'),
              t('spinach'),
              pluralize.plural(t('blueberry')),
              t('flaxseed'),
              t('salmon-oil'),
              t('ocelle-targeted-nutrient-blend'),
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
      </div>
      <div className="mt-10 text-center font-bold text-dark-green">
        Total Price: [$210 ($15/Day)]
      </div>
      <div className="mx-auto mt-10 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => reset(defaultValues)}
              reverse
              disabled={isSameAsDefaultValue}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending || isSameAsDefaultValue}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
