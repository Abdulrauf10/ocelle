import React from 'react';
import { useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import Image from 'next/image';
import PictureRadio from '@/components/controls/PictureRadio';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { AmountOfTreats, CurrentlyEating, Pickiness } from '@/types';
import { arrayToAllergies, foodAllergiesToArray, getFoodAllergiesOptions } from '@/helpers/form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

interface DogPreference2Form {
  allergies: Array<boolean | undefined>;
  eating?: CurrentlyEating;
  amountOfTreats?: AmountOfTreats;
  pickiness?: Pickiness;
}

export default function DogPreference2Fragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog, setDog } = useSurvey();
  const { name, foodAllergies, currentlyEating, amountOfTreats, pickiness } = getDog();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useForm<DogPreference2Form>({
    defaultValues: {
      allergies: foodAllergiesToArray(foodAllergies),
      eating: currentlyEating,
      amountOfTreats,
      pickiness,
    },
  });
  const options = React.useMemo(() => {
    return getFoodAllergiesOptions().map((option) => ({ label: t(option) }));
  }, [t]);

  const onSubmit = React.useCallback(
    ({ allergies, eating, amountOfTreats, pickiness }: DogPreference2Form) => {
      setDog({
        foodAllergies: arrayToAllergies(allergies),
        currentlyEating: eating,
        amountOfTreats,
        pickiness,
      });
      navigate(Stage.Owner);
    },
    [navigate, setDog]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Section
            title={t.rich('does-{}-have-any-food-allergies-or-sensitivities', {
              name,
              br: () => <br className="max-md:hidden" />,
            })}
          >
            <div className="mx-auto -mt-4 flex max-w-[360px] flex-wrap justify-center">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="checkbox"
                  label={options[0].label}
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
              {options.map((option, idx) => {
                if (idx === 0) {
                  return;
                }
                return (
                  <div className="mt-4 px-3" key={idx}>
                    <InteractiveBlock
                      type="checkbox"
                      label={options[idx].label}
                      control={control}
                      name={`allergies.${idx}`}
                      error={Array.isArray(errors.allergies) && !!errors.allergies[idx]}
                      rules={{
                        validate: {
                          required: (value, formValues) =>
                            formValues.allergies.some((value) => !!value),
                          conflict: (value, formValues) => !value || !formValues.allergies[0],
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
                <p className="body-4 mx-auto mt-3 max-w-[360px] text-error">
                  You’ve indicated that [Charlie] has no allergies (“None!”) as well as allergies to
                  [
                  {getValues('allergies')
                    .map((v: unknown, i: number) => (v ? options[i].label : v))
                    .filter((v: unknown, i: number) => !!v && i !== 0)
                    .join(', ')}
                  ]. Please recheck and re-enter your selection.
                </p>
              )}
          </Section>
          <SectionBreak />
          <Section title={t('what-is-{}-currently-eating', { name })}>
            <div className="mx-auto -mt-4 flex max-w-[460px] flex-wrap justify-between">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Dry"
                  control={control}
                  name="eating"
                  label={t('dry')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Wet"
                  control={control}
                  name="eating"
                  label={t('wet')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Raw"
                  control={control}
                  name="eating"
                  label={t('raw')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Dehydrated"
                  control={control}
                  name="eating"
                  label={t('dehydrated')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Fresh"
                  control={control}
                  name="eating"
                  label={t('fresh')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Homemade"
                  control={control}
                  name="eating"
                  label={t('homemade')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="Other"
                  control={control}
                  name="eating"
                  label={t('other')}
                  error={!!errors.eating}
                  rules={{ required: true }}
                />
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
                  value="None"
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
                  value="Some"
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
                  value="Lots"
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
          <Section title={t('how-picky-is-{}-at-mealtimes', { name })}>
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
                    value: 'Picky',
                    children: (
                      <div className="flex items-end">
                        <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                      </div>
                    ),
                  },
                  {
                    label: t('is-a-good-eater'),
                    value: 'GoodEater',
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
                    value: 'EatAnything',
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
          <Button className="mt-10">{t('continue')}</Button>
        </form>
      </Container>
    </motion.div>
  );
}
