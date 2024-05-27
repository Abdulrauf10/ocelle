import clsx from 'clsx';
import { differenceInWeeks, subDays, subMonths, subYears } from 'date-fns';
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
import useDefaultValues from '@/hooks/defaultValues';

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
  const { defaultValues } = useDefaultValues(
    typeof age === 'string'
      ? { birthday: new Date(age) }
      : age
        ? { months: age?.months, years: age?.years }
        : { months: 0, years: 0 }
  );
  const {
    handleSubmit,
    control,
    trigger,
    getValues,
    unregister,
    reset,
    formState: { errors, isValid },
  } = useForm<DogAgeForm>({
    mode: 'all',
    defaultValues,
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
                unregister('birthday');
                reset(defaultValues);
              }}
              label={t('enter-age')}
            />
            <UnderlineButton
              underline={tab === 'Birthday'}
              className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
              onClick={() => {
                setTab('Birthday');
                unregister('years');
                unregister('months');
                reset(defaultValues);
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
                    disableErrorMessage
                    rules={{
                      required: {
                        value: true,
                        message: 'Years or months must be specified',
                      },
                      min: {
                        value: 0,
                        message: 'years and months cannot be zero',
                      },
                      max: {
                        value: 35,
                        message: 'years and months cannot be zero',
                      },
                      validate: {
                        isAtLeastOneNonZero: () => {
                          const values = getValues();
                          if (values.years === undefined || values.months === undefined) {
                            return false;
                          }
                          return values.years > 0 || values.months > 0;
                        },
                        under12Weeks: () => {
                          const values = getValues();
                          if (values.years === undefined || values.months === undefined) {
                            return true;
                          }
                          const dateOfBirth = subYears(
                            subMonths(new Date(), values.months),
                            values.years
                          );
                          if (Math.abs(differenceInWeeks(dateOfBirth, new Date())) < 12) {
                            return t('come-back-when-your-puppy-is-12-weeks-old');
                          }
                          return true;
                        },
                      },
                    }}
                    inputProps={{ min: 0, max: 35 }}
                    className="mr-2 w-20 [&_input]:text-center"
                    onChange={() => trigger('months')}
                  />
                  <span className="body-3 ml-2">{t('years')}</span>
                </div>
                <div className="flex items-center px-4">
                  <TextField
                    name="months"
                    type="number"
                    control={control}
                    disableErrorMessage
                    rules={{
                      required: tab === 'Age',
                      min: 0,
                      max: 11,
                      validate: {
                        isAtLeastOneNonZero: () => {
                          const values = getValues();
                          if (values.years === undefined || values.months === undefined) {
                            return false;
                          }
                          return values.years > 0 || values.months > 0;
                        },
                        under12Weeks: () => {
                          const values = getValues();
                          if (values.years === undefined || values.months === undefined) {
                            return true;
                          }
                          const dateOfBirth = subYears(
                            subMonths(new Date(), values.months),
                            values.years
                          );
                          if (Math.abs(differenceInWeeks(dateOfBirth, new Date())) < 12) {
                            return t('come-back-when-your-puppy-is-12-weeks-old');
                          }
                          return true;
                        },
                      },
                    }}
                    inputProps={{ min: 0, max: 11 }}
                    className="mr-2 w-20 [&_input]:text-center"
                    onChange={() => trigger('years')}
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
                  required: true,
                  validate: {
                    under12Weeks: (value) => {
                      if (value === undefined) {
                        return true;
                      }
                      if (Math.abs(differenceInWeeks(value, new Date())) < 12) {
                        return t('come-back-when-your-puppy-is-12-weeks-old');
                      }
                      return true;
                    },
                  },
                }}
                error={!!errors.birthday}
                maxDate={subDays(new Date(), 1)}
              />
            )}
            {errors && (
              <div className="mt-4">
                <p className="body-3 text-error">
                  {errors.years?.message || errors.months?.message || errors.birthday?.message}
                </p>
              </div>
            )}
            <Button className="mt-8" disabled={!isValid}>
              {t('continue')}
            </Button>
          </form>
        </Section>
      </Container>
    </motion.div>
  );
}
