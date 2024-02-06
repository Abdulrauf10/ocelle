import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import { useForm } from 'react-hook-form';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import Price from '@/components/Price';
import Button from '@/components/Button';
import RecipeCheckbox from '@/components/controls/RecipeCheckbox';
import { FragmentProps } from '@/components/FragmentRouter';
import Section from '../Section';
import Stage from '../Stage';
import Headings from '@/components/Headings';
import { useTranslations } from 'next-intl';

export default function RecommendedPlanFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(() => {
    navigate(Stage.Checkout);
  }, [navigate]);

  const name = 'Charlie';

  return (
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
        <div className="-mb-[3vw] bg-[#F8F3EB] py-[2vw] max-md:py-5 max-sm:-mb-8">
          <Container>
            <div className="flex justify-center">
              <div className="">
                <p className="text-primary">
                  {t(
                    'feel-free-to-adjust-{}-meal-plan-by-selecting-from-up-to-suitable-recipes-below',
                    { name, recipes: 2 }
                  )}
                </p>
                <div className="mt-5 flex max-w-[820px] flex-wrap justify-center">
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
                  <Image src="/ocelle-food.png" alt="ocelle food" fill className="object-contain" />
                </div>
              </div>
            </div>
            <div className="mx-auto mt-10 max-w-[840px] rounded-[20px] border border-primary bg-white p-7 text-primary shadow-[3px_3px_10px_rgba(0,0,0,.2)]">
              <Headings tag="h2" styles="h2">
                {t('use-a-transition-period-in-starter-box')}
              </Headings>
              <p className="mt-5">{t('use-a-transition-period-in-starter-box:description')}</p>
              <div className="my-3 flex flex-wrap justify-center">
                <div className="mt-4 px-2">
                  <InteractiveBlock
                    type="radio"
                    value={0}
                    control={control}
                    name="transition"
                    label={t('dont-use-transition')}
                    rules={{
                      required: {
                        value: true,
                        message: '[You must select transition period]',
                      },
                    }}
                    error={!!errors?.transition}
                    className="w-[190px]"
                  />
                </div>
                <div className="mt-4 px-2">
                  <InteractiveBlock
                    type="radio"
                    value={1}
                    control={control}
                    name="transition"
                    label={t('use-transition')}
                    rules={{
                      required: {
                        value: true,
                        message: '[You must select transition period]',
                      },
                    }}
                    error={!!errors?.transition}
                    className="w-[190px]"
                  />
                </div>
              </div>
              {errors?.transition?.message && (
                <p className="mt-5 text-error">{String(errors?.transition?.message)}</p>
              )}
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center">
              <Image src="/question/eat-anything.svg" alt="Eating Dog" width={60} height={70} />
              <div className="my-2 ml-3 inline-flex flex-wrap items-center justify-center text-primary">
                <div className="mr-1">{t('{}-colon', { value: t('starter-box') })}</div>
                <div>
                  <Price value={504} discount />
                  <Price className="ml-1 font-bold" value={252} /> (
                  <Price value={36} discount />
                  <Price className="ml-1 font-bold" value={18} />
                  <span className="font-bold text-dark-green">{t('per-day')}</span>)&nbsp;
                  <span className="whitespace-nowrap">{t('with-your-starter-discount')}</span>
                </div>
              </div>
            </div>
            <div className="mb-[1vw]">
              <Button theme="primary" className="mx-2 mt-4 !bg-none !px-11" type="button">
                + {t('add-another-dog')}
              </Button>
              <Button className="mx-2 mt-4">{t('continue-to-{}', { name: t('checkout') })}</Button>
            </div>
          </Container>
        </div>
      </Section>
    </form>
  );
}
