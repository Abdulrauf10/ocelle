import Container from '@/components/Container';
import FragmentProps from '../FragmentProps';
import Section from '../Section';
import Image from 'next/image';
import { Control, FieldValues, RegisterOptions, useController, useForm } from 'react-hook-form';
import clsx from 'clsx';
import H2 from '@/components/Heading/H2';
import RadioControl from '../controls/Radio';
import Price from '../Price';
import Button from '@/components/Button';
import React from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import Close from '@/components/Icon/Close';

interface PlanProps {
  title: string;
  description: string;
  name: string;
  picture: string;
  ingredients: string;
  nutrientBlend: string;
  calorie: number;
  protein: number;
  fat: number;
  fibre: number;
  moisture: number;
  disabled?: boolean;
  control: Control<FieldValues, any>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  recommended?: boolean;
}

function Dotted() {
  return (
    <div className="after:content-dotted after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-0 after:inline-block after:align-[3px] after:tracking-[6px] after:text-black"></div>
  );
}

function Plan({
  picture,
  title,
  name,
  control,
  recommended,
  disabled,
  description,
  ingredients,
  nutrientBlend,
  calorie,
  protein,
  fat,
  fibre,
  moisture,
}: PlanProps) {
  const { field } = useController({ name, control });
  const [isOpen, setIsOpen] = React.useState(false);
  const [tab, setTab] = React.useState<'Ingredients' | 'Nutrition'>('Ingredients');

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  // Set up label and description ids
  const labelId = React.useId();
  const descriptionId = React.useId();

  return (
    <div
      className={clsx(
        'relative mx-auto mt-[70px] min-w-[230px] max-w-[280px] rounded-[20px] border p-[10px] shadow-[3px_3px_10px_rgba(0,0,0,.2)]',
        disabled
          ? 'pointer-events-none select-none border-[#7B8D97] bg-[#F2F4F5]'
          : 'border-[#BE873B] bg-white'
      )}
    >
      <div className="absolute -top-[70px] left-1/2 -translate-x-1/2">
        {recommended && (
          <div
            className={clsx(
              'absolute -left-1/2 inline-block select-none rounded-3xl border border-white bg-secondary px-3 py-px text-center text-sm italic text-white'
            )}
          >
            RECOMMENDED
          </div>
        )}
        <Image
          src={picture}
          alt={title}
          width={140}
          height={140}
          className="min-w-[140px] rounded-2xl shadow-[3px_3px_10px_rgba(0,0,0,.2)]"
        />
      </div>
      <div className="h-[70px]"></div>
      <div className={clsx('mt-2', disabled ? 'text-[#BDC6CB]' : 'text-[#BE873B]')}>
        <label>
          <input type="checkbox" {...field} disabled={disabled} />
          <span className="ml-2 font-bold">{title}</span>
        </label>
        <div className="mt-0.5">$$</div>
        <div className="mt-0.5">
          <button
            type="button"
            className="font-light underline"
            ref={refs.setReference}
            {...getReferenceProps()}
          >
            See Details
          </button>
          <FloatingPortal>
            {isOpen && (
              <FloatingOverlay
                className="z-40 flex items-center justify-center bg-[#231815] bg-opacity-60"
                lockScroll
              >
                <FloatingFocusManager context={context}>
                  <div
                    className="relative m-3 flex max-w-[1024px] items-start rounded-3xl border-2 border-primary bg-white px-5 py-4 max-md:flex-wrap max-md:pt-9"
                    ref={refs.setFloating}
                    aria-labelledby={labelId}
                    aria-describedby={descriptionId}
                    {...getFloatingProps()}
                  >
                    <div className="max-xs:w-full max-xs:min-w-full w-[400px] min-w-[400px] max-lg:min-w-[320px]">
                      <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                        <Image src="/meal-plan/chicken-recipe.jpg" alt="Chicken Recipe" fill />
                      </div>
                    </div>
                    <div className="ml-6 py-1 max-md:mx-3 max-md:mt-4">
                      <h2 id={labelId} className="text-xl font-bold text-primary max-lg:text-lg">
                        {title}
                      </h2>
                      <p id={descriptionId} className="mt-2 leading-tight">
                        {description}
                      </p>
                      <hr className="my-3 border-[#7B8D97]" />
                      <div className="-mx-4 flex">
                        <button
                          className={clsx(
                            'mx-4 text-lg',
                            tab === 'Ingredients'
                              ? 'text-primary underline'
                              : 'text-[#7B8D97] hover:underline'
                          )}
                          type="button"
                          onClick={() => setTab('Ingredients')}
                        >
                          Ingredients
                        </button>
                        <button
                          className={clsx(
                            'mx-4 text-lg',
                            tab === 'Nutrition'
                              ? 'text-primary underline'
                              : 'text-[#7B8D97] hover:underline'
                          )}
                          type="button"
                          onClick={() => setTab('Nutrition')}
                        >
                          Nutrition
                        </button>
                      </div>
                      {tab === 'Ingredients' && (
                        <>
                          <p className="mt-3 leading-tight">
                            <strong>Ingredients</strong>
                            <br />
                            {ingredients}
                          </p>
                          <p className="mt-3 leading-tight">
                            <strong>Ocelle Targeted Nutrient Blend:</strong>
                            <br />
                            {nutrientBlend}
                          </p>
                        </>
                      )}
                      {tab === 'Nutrition' && (
                        <>
                          <div className="mt-2 flex flex-wrap justify-between">
                            <strong>CALORIE CONTENT:</strong>
                            <span>{calorie} kcal/kg</span>
                          </div>
                          <div className="mt-1">
                            <strong>GUARENTEED ANALYSIS:</strong>
                            <div className="mt-2 flex flex-wrap justify-between">
                              <span>Crude Protein</span>
                              <span>{protein}% Min</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>Crude Fat</span>
                              <span>{fat}% Min</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>Crude Firbe</span>
                              <span>{fibre}% Max</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>Moisture</span>
                              <span>{moisture}% Max</span>
                            </div>
                            <p className="mt-3 leading-tight">
                              Our {title} for Dogs is formulated to meet the nutritional levels
                              established by the AAFCO Dog Food Nutrient Profiles for all life
                              stages, including growth of large sized dogs (70 lbs. or more as an
                              adult).
                            </p>
                          </div>
                        </>
                      )}
                      <button
                        className="absolute right-4 top-3 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        <Close className="h-[20px] w-[20px]" />
                      </button>
                    </div>
                  </div>
                </FloatingFocusManager>
              </FloatingOverlay>
            )}
          </FloatingPortal>
        </div>
      </div>
    </div>
  );
}

export default function RecommendedPlanFragment({ forward }: FragmentProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <form className="text-center" onSubmit={handleSubmit(onSubmit)}>
      <Section
        className="px-4"
        title={
          <>
            [Charlie]’s <span className="whitespace-nowrap">Recommended Plan</span>
          </>
        }
        description={
          <span className="not-italic">
            Based on your responses, we recommend these fresh recipes for [Charlie]. They’re all
            made <br className="max-md:hidden" />
            with human grade meat and fresh vegetables that are ideal for [Charlie]’s needs.
          </span>
        }
      >
        <div className="-mb-[3vw] bg-[#F8F3EB] py-[2vw] max-md:py-5 max-sm:-mb-8">
          <Container>
            <div className="flex justify-center">
              <div className="">
                <p className="text-primary">
                  Feel free to adjust [Charlie]’s meal plan by selecting from up to 2 suitable
                  recipes below.
                </p>
                <div className="mt-5 flex max-w-[820px] flex-wrap justify-center">
                  <div className="mt-5 px-5 max-xl:w-1/3 max-md:w-1/2 max-sm:w-full">
                    <Plan
                      title="Fresh Chicken Recipe"
                      description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                      name="recipe"
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
                    <Plan
                      title="Fresh Pork Recipe"
                      description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                      name="recipe"
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
                    <Plan
                      title="Fresh Duck Recipe"
                      description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                      name="recipe"
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
                    <Plan
                      title="Fresh Beef Recipe"
                      description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                      name="recipe"
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
                    <Plan
                      title="Fresh Lamb Recipe"
                      description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
                      name="recipe"
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
              <H2 inline>Use A Transition Period In Starter Box?</H2>
              <p className="mt-5">
                Vets recommend for dogs to undergo a transition period when changing to a new diet –
                especially if there has been little or no change over the years to the previous
                diet. In the early stages of a new diet, your dog may experience some watery poops
                if transitioned too quickly; this is perfectly normal and nothing to be concerned
                about. While transitioning isn’t an exact science, OCELLE suggests slowly
                transitioning your dog on to the new diet with smaller portions over a 7-day period,
                to enable time to adjust to the OCELLE goodness!
              </p>
              <div className="my-3 flex flex-wrap justify-center">
                <div className="mt-4 px-2">
                  <RadioControl
                    value={0}
                    isBlock
                    control={control}
                    name="transition"
                    label="Don’t Use Transition"
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
                  <RadioControl
                    value={1}
                    isBlock
                    control={control}
                    name="transition"
                    label="Use Transition"
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
                <p className="mt-5 text-[#f00]">{String(errors?.transition?.message)}</p>
              )}
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center">
              <Image src="/question/eat-anything.svg" alt="Eating Dog" width={60} height={70} />
              <p className="my-2 ml-3 text-primary">
                Starter Box: <Price price={504} discountedPrice={252} /> (
                <Price price={36} discountedPrice={18} />
                <span className="font-bold text-[#269D9E]">/day</span>){' '}
                <span className="whitespace-nowrap">with your starter discount.</span>
              </p>
            </div>
            <div className="mb-[1vw]">
              <Button
                className="mx-2 mt-4 !bg-primary !bg-none !px-11 hover:!bg-[#47789c]"
                type="button"
              >
                + Add Another Dog
              </Button>
              <Button className="mx-2 mt-4">Continue To Checkout</Button>
            </div>
          </Container>
        </div>
      </Section>
    </form>
  );
}
