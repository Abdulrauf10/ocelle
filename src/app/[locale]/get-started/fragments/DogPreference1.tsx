import React from 'react';
import { useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import PictureRadio from '@/components/controls/PictureRadio';
import Image from 'next/image';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { ActivityLevel, BodyCondition } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';
import TextField from '@/components/controls/TextField';

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
    formState: { errors },
  } = useForm<DogPreference1Form>({
    defaultValues: {
      weight,
      bodyCondition,
      activityLevel,
    },
  });

  const onSubmit = React.useCallback(
    ({ weight, bodyCondition, activityLevel }: DogPreference1Form) => {
      setDog({ weight, bodyCondition, activityLevel });
      navigate(Stage.DogPreference2);
    },
    [navigate, setDog]
  );

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
                rules={{
                  required: true,
                  min: {
                    value: 0.5,
                    message: t('ocelle-is-currently-available-to-dogs-between-05-to-50-kg'),
                  },
                  max: {
                    value: 50,
                    message: t('ocelle-is-currently-available-to-dogs-between-05-to-50-kg'),
                  },
                }}
                className="mr-2 w-20"
                inputProps={{ min: 0, step: 0.1 }}
              />
              <span className="body-3 ml-2">kg</span>
              {errors?.weight?.message && (
                <p className="body-4 mt-3 w-full text-error">{String(errors?.weight?.message)}</p>
              )}
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('what-best-represents-their-current-body-condition')}>
            <div className="mx-auto mt-10 max-w-[840px]">
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
                        <br />
                        <br />
                        <i>{t('adjust-their-calories')}</i>
                      </p>
                    ),
                    value: 'TooSkinny',
                    children: (
                      <Image
                        src="/question/body-skinny.svg"
                        alt="dog skinny"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('just-right'),
                    descripton: (
                      <p className="body-3 text-primary">
                        Clear waistline and tucked in belly. You can easily feel their ribs and / or
                        spine, but they are not clearly visible.
                      </p>
                    ),
                    value: 'JustRight',
                    children: (
                      <Image
                        src="/question/body-just-right.svg"
                        alt="dog just right"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('rounded'),
                    descripton: (
                      <p className="body-3 text-primary">
                        Waistline is disappearing, difficult to feel ribs and spine. Broad back.
                        <br />
                        <br />
                        <i>
                          We’ll adjust their calories and help to manage their weight, so that it’s
                          just right for optimum health and wellbeing!
                        </i>
                      </p>
                    ),
                    value: 'Rounded',
                    children: (
                      <Image
                        src="/question/body-rounded.svg"
                        alt="dog rounded"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('chunky'),
                    descripton: (
                      <p className="body-3 text-primary">
                        Waistline is lost. You cannot feel their ribs and spine. Weight is a serious
                        concern.
                        <br />
                        <br />
                        <i>
                          We’ll adjust their calories and help to manage their weight, so that it’s
                          just right for optimum health and wellbeing!
                        </i>
                      </p>
                    ),
                    value: 'Chunky',
                    children: (
                      <Image
                        src="/question/body-chunky.svg"
                        alt="dog chunky"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('how-active-is', { name })}>
            <div className="mx-auto mt-10 max-w-[640px]">
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
                        {t('less-than-30-minutes-of-outdoor-daily-activity')}
                      </p>
                    ),
                    value: 'Mellow',
                    children: (
                      <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={95} />
                    ),
                  },
                  {
                    label: t('active'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('around-1-2-hours-of-outdoor-daily-activity')}
                      </p>
                    ),
                    value: 'Active',
                    children: (
                      <Image src="/question/active.svg" alt="Active dog" width={80} height={95} />
                    ),
                  },
                  {
                    label: t('very-active'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('more-than-2-hours-of-outdoor-daily-activity')}
                      </p>
                    ),
                    value: 'VeryActive',
                    children: (
                      <Image
                        src="/question/very-active.svg"
                        alt="Very Active dog"
                        width={110}
                        height={95}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </Section>
          <Button className="mt-8">{t('continue')}</Button>
        </form>
      </Container>
    </motion.div>
  );
}
