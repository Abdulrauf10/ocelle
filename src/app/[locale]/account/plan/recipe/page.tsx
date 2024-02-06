'use client';

import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import Button from '@/components/Button';
import { useForm } from 'react-hook-form';
import RecipeCheckbox from '@/components/controls/RecipeCheckbox';
import DogSwitch from '../../DogSwitch';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

export default function PlanRecipe() {
  const t = useTranslations();
  const router = useRouter();
  const { control } = useForm();

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch />
          </div>
          <Headings tag="h1" styles="h2" className="text-center text-primary max-lg:mt-6">
            Choose [Charlie]&apos;s Fresh Recipes
          </Headings>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            [Charlie]’s upcoming box is scheduled for the{' '}
            <strong className="whitespace-nowrap">[15th of December 2023]</strong>.
          </p>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            You can make changes until the{' '}
            <strong className="whitespace-nowrap">[10th of December 2023] 11:59PM</strong>.
          </p>
          <p className="mx-auto mt-4 max-w-[620px] text-center text-primary">
            Select up to 2 suitable recipes below.
          </p>
          <div className="mx-auto mt-5 flex max-w-[820px] flex-wrap justify-center">
            <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
              <RecipeCheckbox
                title="Fresh Chicken Recipe"
                description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                name="recipe"
                value="chicken"
                control={control}
                picture="/meal-plan/chicken.jpg"
                ingredients="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas, Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
                nutrientBlend="Selenium Yeast, Vitamin A Supplement, Thiamine Hydrochloride (Vitamin B1), Riboflavin (Vitamin B2), Niacin (Vitamin B3), Pyridoxine Hydrochloride (Vitamin B6), Folic Acid (Vitamin B9), Cholecalciferol (Vitamin B12), Vitamin D3 Supplement, Sodium Chloride, Tricalcium Phosphate, Iron Amino Acid Chelate, Potassium Chloride, Potassium Iodide, Zinc Amino Acid Chelate, Magnesium Amino Acid Chelate, Manganese Amino Acid Chelate, Copper Amino Acid Chelate, Taurine, Choline Bitartrate."
                calorie={1540}
                protein={19}
                fat={5}
                fibre={2}
                moisture={60}
                recommended
              />
            </div>
            <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
              <RecipeCheckbox
                title="Fresh Pork Recipe"
                description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                name="recipe"
                value="pork"
                control={control}
                picture="/meal-plan/pork.jpg"
                ingredients="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas, Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
                nutrientBlend="Selenium Yeast, Vitamin A Supplement, Thiamine Hydrochloride (Vitamin B1), Riboflavin (Vitamin B2), Niacin (Vitamin B3), Pyridoxine Hydrochloride (Vitamin B6), Folic Acid (Vitamin B9), Cholecalciferol (Vitamin B12), Vitamin D3 Supplement, Sodium Chloride, Tricalcium Phosphate, Iron Amino Acid Chelate, Potassium Chloride, Potassium Iodide, Zinc Amino Acid Chelate, Magnesium Amino Acid Chelate, Manganese Amino Acid Chelate, Copper Amino Acid Chelate, Taurine, Choline Bitartrate."
                calorie={1540}
                protein={19}
                fat={5}
                fibre={2}
                moisture={60}
                recommended
              />
            </div>
            <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
              <RecipeCheckbox
                title="Fresh Duck Recipe"
                description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                name="recipe"
                value="duck"
                control={control}
                picture="/meal-plan/duck.jpg"
                ingredients="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas, Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
                nutrientBlend="Selenium Yeast, Vitamin A Supplement, Thiamine Hydrochloride (Vitamin B1), Riboflavin (Vitamin B2), Niacin (Vitamin B3), Pyridoxine Hydrochloride (Vitamin B6), Folic Acid (Vitamin B9), Cholecalciferol (Vitamin B12), Vitamin D3 Supplement, Sodium Chloride, Tricalcium Phosphate, Iron Amino Acid Chelate, Potassium Chloride, Potassium Iodide, Zinc Amino Acid Chelate, Magnesium Amino Acid Chelate, Manganese Amino Acid Chelate, Copper Amino Acid Chelate, Taurine, Choline Bitartrate."
                calorie={1540}
                protein={19}
                fat={5}
                fibre={2}
                moisture={60}
              />
            </div>
            <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
              <RecipeCheckbox
                title="Fresh Beef Recipe"
                description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                name="recipe"
                value="beef"
                control={control}
                picture="/meal-plan/beef.jpg"
                ingredients="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas, Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
                nutrientBlend="Selenium Yeast, Vitamin A Supplement, Thiamine Hydrochloride (Vitamin B1), Riboflavin (Vitamin B2), Niacin (Vitamin B3), Pyridoxine Hydrochloride (Vitamin B6), Folic Acid (Vitamin B9), Cholecalciferol (Vitamin B12), Vitamin D3 Supplement, Sodium Chloride, Tricalcium Phosphate, Iron Amino Acid Chelate, Potassium Chloride, Potassium Iodide, Zinc Amino Acid Chelate, Magnesium Amino Acid Chelate, Manganese Amino Acid Chelate, Copper Amino Acid Chelate, Taurine, Choline Bitartrate."
                calorie={1540}
                protein={19}
                fat={5}
                fibre={2}
                moisture={60}
              />
            </div>
            <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
              <RecipeCheckbox
                title="Fresh Lamb Recipe"
                description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                name="recipe"
                value="lamb"
                control={control}
                picture="/meal-plan/lamb.jpg"
                ingredients="Chicken Breast, Chicken Liver, Whole-Grain Rice, Shiitake Mushroom, Spinach, Peas, Cranberry, Flaxseed, Salmon Oil, OCELLE Targeted Nutrient Blend."
                nutrientBlend="Selenium Yeast, Vitamin A Supplement, Thiamine Hydrochloride (Vitamin B1), Riboflavin (Vitamin B2), Niacin (Vitamin B3), Pyridoxine Hydrochloride (Vitamin B6), Folic Acid (Vitamin B9), Cholecalciferol (Vitamin B12), Vitamin D3 Supplement, Sodium Chloride, Tricalcium Phosphate, Iron Amino Acid Chelate, Potassium Chloride, Potassium Iodide, Zinc Amino Acid Chelate, Magnesium Amino Acid Chelate, Manganese Amino Acid Chelate, Copper Amino Acid Chelate, Taurine, Choline Bitartrate."
                calorie={1540}
                protein={19}
                fat={5}
                fibre={2}
                moisture={60}
                disabled
              />
            </div>
          </div>
          <div className="mt-10 text-center font-bold text-dark-green">
            Total Price: [$210 ($15/Day)]
          </div>
          <div className="mx-auto mt-10 max-w-[480px]">
            <div className="-mx-2 flex">
              <div className="w-1/2 px-2">
                <Button fullWidth onClick={() => {}} reverse>
                  {t('cancel')}
                </Button>
              </div>
              <div className="w-1/2 px-2">
                <Button fullWidth>{t('save-changes')}</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <UnderlineButton type="button" label={t('go-back')} onClick={() => router.back()} />
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
