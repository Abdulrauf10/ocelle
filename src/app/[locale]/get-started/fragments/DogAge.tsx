import clsx from 'clsx';
import { subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DateCalendar from '@/components/controls/DateCalendar';
import TextField from '@/components/controls/TextField';

interface DogAgeForm {
  months?: number;
  years?: number;
  birthday?: Date;
}

export default function DogAgeFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog, setDog } = useSurvey();
  const { name, age } = getDog();
  const [pending, startTransition] = React.useTransition();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<DogAgeForm>({
    defaultValues:
      typeof age === 'string'
        ? { birthday: new Date(age) }
        : { months: age?.months, years: age?.years },
  });
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>(
    typeof age === 'string' ? 'Birthday' : 'Age'
  );

  const onSubmit = React.useCallback(
    ({ months, years, birthday }: DogAgeForm) => {
      if (tab === 'Age') {
        setDog({ age: { months: months!, years: years! } });
      } else {
        setDog({ age: birthday!.toISOString() });
      }
      navigate(Stage.DogPreference1);
    },
    [navigate, setDog, tab]
  );
  const years = watch('years');
  const months = watch('months');
  useEffect(() => {
    // If years is set and months is untouched or empty, set months to zero
    if (years && (months === 0 || months === undefined)) {
      setValue('months', 0, { shouldValidate: true });
    }
    if (months && (years === 0 || years === undefined)) {
      setValue('years', 0, { shouldValidate: true });
    }
  }, [years, months, setValue]);
  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section
          title={t('how-old-is-{}', { name })}
          description={t('if-youre-unsure-just-give-us-your-best-guess')}
        >
          <div className="mx-auto mt-8 flex max-w-[260px] justify-between">
            <UnderlineButton
              underline={tab === 'Age'}
              className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
              onClick={() => {
                setTab('Age');
                setValue('months', undefined, { shouldValidate: true });
                setValue('birthday', undefined, { shouldValidate: true });
                setValue('years', undefined, { shouldValidate: true });
                trigger('months');
                trigger('years');
              }}
              label={t('enter-age')}
            />
            <UnderlineButton
              underline={tab === 'Birthday'}
              className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
              onClick={() => {
                setTab('Birthday');
                setValue('months', undefined, { shouldValidate: true });
                setValue('birthday', undefined, { shouldValidate: true });
                setValue('years', undefined, { shouldValidate: true });
                trigger('months');
                trigger('years');
              }}
              label={t('select-birthday')}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6 max-w-[480px]">
            {tab === 'Age' && (
              <div className="flex justify-center">
                <div className="flex items-center px-4">
                  <TextField
                    name="years"
                    type="number"
                    control={control}
                    rules={{
                      required: 'Years or months must be specified',
                      validate: {
                        isAtLeastOneNonZero: () => {
                          const formData = control._formValues;
                          return formData.years > 0 || formData.months > 0;
                        },
                      },
                      min: 0 || 'years and months cannot be zero',
                      max: 35 || 'years and months cannot be zero',
                    }}
                    inputProps={{ min: 0, max: 35 }}
                    className="mr-2 w-20 [&_input]:text-center"
                  />
                  <span className="body-3 ml-2">{t('years')}</span>
                </div>
                <div className="flex items-center px-4">
                  <TextField
                    name="months"
                    type="number"
                    control={control}
                    rules={{
                      required: tab === 'Age',
                      min: 0,
                      max: 11,
                    }}
                    inputProps={{ min: 0, max: 11 }}
                    className="mr-2 w-20 [&_input]:text-center"
                  />
                  <span className="body-3 ml-2">{t('months')}</span>
                </div>
              </div>
            )}
            {tab === 'Birthday' && (
              <DateCalendar
                control={control}
                name="birthday"
                rules={{
                  required: tab === 'Birthday',
                }}
                error={!!errors.birthday}
                maxDate={subDays(new Date(), 1)}
              />
            )}
            <Button className="mt-8" disabled={!isValid || pending}>
              {t('continue')}
            </Button>
          </form>
        </Section>
      </Container>
    </motion.div>
  );
}
