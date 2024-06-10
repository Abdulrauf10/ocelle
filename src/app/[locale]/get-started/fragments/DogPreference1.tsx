import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import PictureRadio from '@/components/controls/PictureRadio';
import TextField from '@/components/controls/TextField';
import { ActivityLevel, BodyCondition } from '@/enums';

interface DogPreference1Form {
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
}

export default function DogPreference1Fragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog, setDog } = useSurvey();
  const { name, weight, bodyCondition, activityLevel } = getDog();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<DogPreference1Form>({
    mode: 'onChange',
    defaultValues: {
      weight,
      bodyCondition,
      activityLevel,
    },
  });
  const weightInput = watch('weight');
  const onSubmit = React.useCallback(
    ({ weight, bodyCondition, activityLevel }: DogPreference1Form) => {
      setDog({ weight, bodyCondition, activityLevel });
      navigate(Stage.DogPreference2);
    },
    [navigate, setDog]
  );
  useEffect(() => {}, [weightInput]);
  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Section
            title={t('what-is-{}-current-weight', { name })}
            description={t(
              'if-youre-unsure-you-can-always-adjust-this-information-in-your-account-later'
            )}
          >
            <div className="flex flex-wrap items-center justify-center">
              <TextField
                name="weight"
                type="number"
                control={control}
                disableErrorMessage
                rules={{
                  required: true,
                  min: {
                    value: 0.5,
                    message: t('ocelle-is-currently-available-to-dogs-between-05-to-50-kg'),
                  },
                  max: {
                    value: 50,
                    message: t(
                      'unfortunately-the-amount-that-{}-needs-fall-outside-of-the-portion-sizes-ocelle-typically-offers',
                      { name }
                    ),
                  },
                }}
                className="mr-2 w-20"
                inputProps={{ step: 0.5 }}
                InputProps={{ sx: { input: { '&::-webkit-inner-spin-button': { opacity: 1 } } } }}
              />
              <span className="body-3 ml-2">KG</span>
              {errors?.weight?.message && (
                <p className="mt-3 w-full text-error">
                  <span className="body-4">{String(errors?.weight?.message)}</span>
                </p>
              )}
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('what-best-represents-their-current-body-condition')}>
            <div className="mx-auto mt-10 max-w-[700px]">
              <PictureRadio
                name="bodyCondition"
                watch={watch}
                rules={{ required: true }}
                control={control}
                error={!!errors.bodyCondition}
                radios={[
                  {
                    label: t('too-skinny'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('visible-rib-cage-spine-noticeable-loss-of-muscle-mass')}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.TooSkinny,
                    children: (
                      <Image
                        src="/question/body-skinny.svg"
                        alt="dog skinny"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('just-right'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t(
                          'clear-waistline-and-tucked-in-belly-you-can-easily-feel-their-ribs-and-or-spine-but-they-are-not-clearly-visible'
                        )}
                      </p>
                    ),
                    value: BodyCondition.JustRight,
                    children: (
                      <Image
                        src="/question/body-just-right.svg"
                        alt="dog just right"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('rounded'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('waistline-is-disappearing-difficult-to-feel-ribs-and-spine-broad-back')}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.Rounded,
                    children: (
                      <Image
                        src="/question/body-rounded.svg"
                        alt="dog rounded"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('chunky'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t(
                          'waistline-is-lost-you-cannot-feel-their-ribs-and-spine-weight-is-a-serious-concern'
                        )}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.Chunky,
                    children: (
                      <Image
                        src="/question/body-chunky.svg"
                        alt="dog chunky"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('how-active-is', { name })}>
            <div className="mx-auto mt-10 max-w-[440px]">
              <PictureRadio
                name="activityLevel"
                watch={watch}
                rules={{ required: true }}
                control={control}
                error={!!errors.activityLevel}
                radios={[
                  {
                    label: t('mellow'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('less-than-30-minutes-of-daily-outdoor-activity')}
                      </p>
                    ),
                    value: ActivityLevel.Mellow,
                    children: (
                      <Image src="/question/mellow.svg" alt="Mellow dog" width={68} height={43} />
                    ),
                  },
                  {
                    label: t('active'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('around-1-2-hours-of-daily-outdoor-activity')}
                      </p>
                    ),
                    value: ActivityLevel.Active,
                    children: (
                      <Image src="/question/active.svg" alt="Active dog" width={51} height={61} />
                    ),
                  },
                  {
                    label: t('very-active'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('more-than-2-hours-of-daily-outdoor-activity')}
                      </p>
                    ),
                    value: ActivityLevel.VeryActive,
                    children: (
                      <Image
                        src="/question/very-active.svg"
                        alt="Very Active dog"
                        width={79}
                        height={61}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Section>
          <Button className="mt-8" disabled={!isValid}>
            {t('continue')}
          </Button>
        </form>
      </Container>
    </motion.div>
  );
}
