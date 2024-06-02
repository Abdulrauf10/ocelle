import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import PictureRadio from '@/components/controls/PictureRadio';
import { useAuth } from '@/contexts/auth';
import { AmountOfTreats, Pickiness } from '@/enums';
import {
  arrayToAllergies,
  arrayToFoods,
  foodAllergiesToArray,
  foodsToArray,
  getFoodAllergiesOptions,
  getFoodOptions,
} from '@/helpers/form';

interface DogPreference2Form {
  allergies: Array<boolean | undefined>;
  eating: Array<boolean | undefined>;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

export default function DogPreference2Fragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const auth = useAuth();
  const { getDog, setDog, currentDogIdx } = useSurvey();
  const { name, foodAllergies, currentEating, amountOfTreats, pickiness } = getDog();
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    getValues,
    trigger,
    watch,
  } = useForm<DogPreference2Form>({
    defaultValues: {
      allergies: foodAllergiesToArray(foodAllergies),
      eating: foodsToArray(currentEating),
      amountOfTreats,
      pickiness,
    },
  });
  const foodAllergiesOptions = React.useMemo(() => {
    return getFoodAllergiesOptions().map((option) => ({ label: t(option) }));
  }, [t]);
  const currentEatingOptions = React.useMemo(() => {
    return getFoodOptions().map((option) => ({ label: t(option) }));
  }, [t]);

  const onSubmit = React.useCallback(
    ({ allergies, eating, amountOfTreats, pickiness }: DogPreference2Form) => {
      setDog({
        foodAllergies: arrayToAllergies(allergies),
        currentEating: arrayToFoods(eating),
        amountOfTreats,
        pickiness,
      });
      if (currentDogIdx === 0 && !auth.me) navigate(Stage.Owner);
      else navigate(Stage.Calculating);
    },
    [currentDogIdx, navigate, setDog, auth.me]
  );

  const eating = getValues('eating');

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Section title={t.rich('does-{}-have-any-food-allergies-or-sensitivities', { name })}>
            <div className="mx-auto -mt-4 flex max-w-[360px] flex-wrap justify-center">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="checkbox"
                  label={t('{}-exclamation', { value: foodAllergiesOptions[0].label })}
                  control={control}
                  name="allergies.0"
                  error={Array.isArray(errors.allergies) && !!errors.allergies[0]}
                  rules={{
                    validate: {
                      required: (value, formValues) =>
                        formValues.allergies.some((value) => !!value),
                      conflict: (value, formValues) =>
                        !value || !formValues.allergies.some((value, idx) => idx > 0 && value),
                    },
                  }}
                  onChange={() => trigger('allergies')}
                />
              </div>
              {foodAllergiesOptions.map((option, idx) => {
                if (idx === 0) {
                  return;
                }
                return (
                  <div className="mt-4 px-3" key={idx}>
                    <InteractiveBlock
                      type="checkbox"
                      label={option.label}
                      control={control}
                      name={`allergies.${idx}`}
                      error={Array.isArray(errors.allergies) && !!errors.allergies[idx]}
                      rules={{
                        validate: {
                          required: (value, formValues) =>
                            formValues.allergies.some((value) => !!value),
                          conflict: (value, formValues) => !value || !formValues.allergies[0],
                          selectedAll: (value, formValues) =>
                            formValues.allergies.slice(-5).some((x) => !x),
                        },
                      }}
                      onChange={() => trigger('allergies')}
                    />
                  </div>
                );
              })}
            </div>
            {Array.isArray(errors.allergies) &&
              errors.allergies.some((x) => x.type === 'conflict') && (
                <p className="mx-auto mt-3 max-w-[360px] text-error">
                  <span className="body-4">
                    {t(
                      'You-ve-indicated-that-{}-has-no-allergies-None-as-well-as-allergies-to-{}-please-check-your-selection',
                      {
                        name,
                        value: getValues('allergies')
                          .map((v: unknown, i: number) => (v ? foodAllergiesOptions[i].label : v))
                          .filter((v: unknown, i: number) => !!v && i !== 0)
                          .join(', '),
                      }
                    )}
                  </span>
                </p>
              )}
            {Array.isArray(errors.allergies) &&
              errors.allergies.some((x) => x.type === 'selectedAll') && (
                <p className="mx-auto mt-3 max-w-[360px] text-error">
                  <span className="body-4">
                    {t(
                      'unfortunately-all-our-recipes-contain-an-ingredient-{}-is-allergic-sensitive-to',
                      {
                        name,
                      }
                    )}
                  </span>
                </p>
              )}
          </Section>
          <SectionBreak />
          <Section title={t.rich('what-is-{}-currently-eating', { name })}>
            <div className="mx-auto -mt-4 flex max-w-[480px] flex-wrap justify-center max-sm:max-w-[360px]">
              {currentEatingOptions.map((option, idx) => {
                return (
                  <div key={idx} className="mt-4 px-3">
                    <InteractiveBlock
                      type="checkbox"
                      label={option.label}
                      control={control}
                      name={`eating.${idx}`}
                      error={Array.isArray(errors.eating) && !!errors.eating[idx]}
                      rules={{
                        validate: {
                          required: (value, formValues) =>
                            formValues.eating.some((value) => !!value),
                        },
                      }}
                      onChange={() => trigger('eating')}
                      disabled={
                        eating.filter((v) => v === true).length >= 2 && eating[idx] !== true
                      }
                    />
                  </div>
                );
              })}
              <div className="px-3">
                <div className="min-w-[128px]"></div>
              </div>
              <div className="px-3">
                <div className="min-w-[128px]"></div>
              </div>
            </div>
          </Section>
          <SectionBreak />
          <Section
            title={t.rich('how-many-treats-or-table-scraps-does-{}-normally-get', {
              name,
              br: () => <br className="max-md:hidden" />,
            })}
          >
            <div className="mx-auto -mt-4 flex max-w-[520px] flex-wrap justify-center">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value={AmountOfTreats.None}
                  control={control}
                  name="amountOfTreats"
                  label={t('none')}
                  error={!!errors.amountOfTreats}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value={AmountOfTreats.Some}
                  control={control}
                  name="amountOfTreats"
                  label={t('some')}
                  error={!!errors.amountOfTreats}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value={AmountOfTreats.Lots}
                  control={control}
                  name="amountOfTreats"
                  label={t('lots')}
                  error={!!errors.amountOfTreats}
                  rules={{ required: true }}
                />
              </div>
            </div>
          </Section>
          <SectionBreak />
          <Section title={t.rich('how-picky-is-{}-at-mealtimes', { name })}>
            <div className="mx-auto mt-10 max-w-[640px]">
              <PictureRadio
                name="pickiness"
                watch={watch}
                rules={{ required: true }}
                control={control}
                error={!!errors.pickiness}
                radios={[
                  {
                    label: t('can-be-picky'),
                    value: Pickiness.Picky,
                    children: (
                      <div className="flex items-end">
                        <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                      </div>
                    ),
                  },
                  {
                    label: t('is-a-good-eater'),
                    value: Pickiness.GoodEater,
                    children: (
                      <div className="flex items-end">
                        <Image
                          src="/question/good-eater.svg"
                          alt="Eater dog"
                          width={80}
                          height={73}
                        />
                      </div>
                    ),
                  },
                  {
                    label: t('will-eat-anything'),
                    value: Pickiness.EatAnything,
                    children: (
                      <Image
                        src="/question/eat-anything.svg"
                        alt="Eat anything dog"
                        width={70}
                        height={81}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Section>
          <Button className="mt-10" disabled={!isValid}>
            {t('continue')}
          </Button>
        </form>
      </Container>
    </motion.div>
  );
}
