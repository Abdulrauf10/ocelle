import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import PictureRadio from '@/components/controls/PictureRadio';
import Image from 'next/image';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { ActivityLevel, BodyCondition } from '@/types';

interface DogPreference1Form {
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
}

export default function DogPreference1Fragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { getDog, setDog } = useSurvey();
  const { name, weight, bodyCondition, activityLevel } = getDog();
  const {
    handleSubmit,
    control,
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
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('what-is-{}-current-weight', { name })}
          description={t(
            'if-youre-unsure-you-can-always-adjust-this-information-in-your-account-later'
          )}
        >
          <div className="flex flex-wrap items-center justify-center">
            <Controller
              name="weight"
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
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  className="mr-2 w-20"
                  inputProps={{ min: 0, step: 0.1 }}
                  {...field}
                  error={!!error}
                />
              )}
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
              rules={{ required: true }}
              control={control}
              error={!!errors.bodyCondition}
              radios={[
                {
                  label: t('too-skinny'),
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
          <p className="body-3 mt-5 text-primary">
            [{t('visible-rib-cage-spine-noticeable-loss-of-muscle-mass')}]
          </p>
          <p className="body-3 mt-5 italic text-primary">[{t('adjust-their-calories')}]</p>
        </Section>
        <SectionBreak />
        <Section title={t('how-active-is', { name })}>
          <div className="mx-auto mt-10 max-w-[640px]">
            <PictureRadio
              name="activityLevel"
              rules={{ required: true }}
              control={control}
              error={!!errors.activityLevel}
              radios={[
                {
                  label: t('mellow'),
                  value: 'Mellow',
                  children: (
                    <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={95} />
                  ),
                },
                {
                  label: t('active'),
                  value: 'Active',
                  children: (
                    <Image src="/question/active.svg" alt="Active dog" width={80} height={95} />
                  ),
                },
                {
                  label: t('very-active'),
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
          <p className="body-3 mt-5 text-primary">
            [{t('less-than-30-minutes-of-outdoor-daily-activity')}]
          </p>
        </Section>
        <Button className="mt-8">{t('continue')}</Button>
      </form>
    </Container>
  );
}
