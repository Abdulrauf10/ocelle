import { Autocomplete, TextField } from '@mui/material';
import clsx from 'clsx';
import { differenceInWeeks, subDays, subMonths, subYears } from 'date-fns';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DateCalendar from '@/components/controls/DateCalendar';
import { PadSpace } from '@/enums';
import useDogForm from '@/hooks/useDogForm';
import useSentence from '@/hooks/useSentence';

interface DogAgeForm {
  months: number;
  years: number;
}

interface DogBirthdayForm {
  birthday: Date;
}

export default function DogAgeFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog, setDog } = useSurvey();
  const { padSpace } = useSentence();
  const { name, age } = getDog();
  const { form: dogAgeForm, isShowButton: showDogAgeSubmitButton } = useDogForm<DogAgeForm>({
    mode: 'onChange',
    defaultValues: age && typeof age !== 'string' ? age : { months: 0, years: 0 },
  });
  const { form: dogBirthdayForm, isShowButton: showDogBirthdaySubmitButton } =
    useDogForm<DogBirthdayForm>({
      mode: 'onChange',
      defaultValues: age && typeof age === 'string' ? { birthday: new Date(age) } : undefined,
    });
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>(
    typeof age === 'string' ? 'Birthday' : 'Age'
  );

  const onDogAgeSubmit = React.useCallback(
    ({ months, years }: DogAgeForm) => {
      setDog({ age: { months: months!, years: years! } });
      navigate(Stage.DogPreference1);
    },
    [navigate, setDog]
  );

  const onDogBirthdaySubmit = React.useCallback(
    ({ birthday }: DogBirthdayForm) => {
      setDog({ age: birthday.toISOString() });
      navigate(Stage.DogPreference1);
    },
    [navigate, setDog]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section
          title={t('how-old-is-{}', {
            name: padSpace(PadSpace.Right, name),
          })}
          description={t.rich('if-youre-unsure-just-give-us-your-best-guess')}
        >
          <div className="mx-auto mt-8 flex max-w-[260px] justify-between">
            <UnderlineButton
              underline={tab === 'Age'}
              className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
              onClick={() => {
                setTab('Age');
              }}
              label={t('enter-age')}
            />
            <UnderlineButton
              underline={tab === 'Birthday'}
              className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
              onClick={() => {
                setTab('Birthday');
              }}
              label={t('select-birthday')}
            />
          </div>
          {tab === 'Age' && (
            <form
              onSubmit={dogAgeForm.handleSubmit(onDogAgeSubmit)}
              className="mx-auto mt-6 max-w-[480px]"
            >
              <div className="flex justify-center">
                <div className="flex items-center px-4">
                  <Controller
                    name="years"
                    control={dogAgeForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: 'Years or months must be specified',
                      },
                      validate: {
                        isAtLeastOneNonZero: (years, { months }) => {
                          if (years === undefined || months === undefined) {
                            return false;
                          }
                          return years > 0 || months > 0;
                        },
                        under12Weeks: (years, { months }) => {
                          if (years === undefined || months === undefined) {
                            return true;
                          }
                          const dateOfBirth = subYears(subMonths(new Date(), months), years);
                          if (Math.abs(differenceInWeeks(dateOfBirth, new Date())) < 12) {
                            return t('come-back-when-your-puppy-is-12-weeks-old');
                          }
                          return true;
                        },
                      },
                    }}
                    render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        className="mr-2 w-20 text-center"
                        options={Array.from({ length: 36 }, (_, i) => i)}
                        onChange={(_, data) => {
                          onChange(data);
                          dogAgeForm.trigger('months');
                          dogBirthdayForm.reset({ birthday: undefined });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!error}
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                '&&&': { pr: '9px' },
                              },
                            }}
                            inputProps={{
                              ...params.inputProps,
                              sx: {
                                textAlign: 'center',
                              },
                            }}
                          />
                        )}
                        disableClearable
                        popupIcon={null}
                        getOptionLabel={String}
                      />
                    )}
                  />
                  <span className="body-3 ml-2">{t('years')}</span>
                </div>
                <div className="flex items-center px-4">
                  <Controller
                    name="months"
                    control={dogAgeForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: 'Years or months must be specified',
                      },
                      validate: {
                        isAtLeastOneNonZero: (months, { years }) => {
                          if (years === undefined || months === undefined) {
                            return false;
                          }
                          return years > 0 || months > 0;
                        },
                        under12Weeks: (months, { years }) => {
                          if (years === undefined || months === undefined) {
                            return true;
                          }
                          const dateOfBirth = subYears(subMonths(new Date(), months), years);
                          if (Math.abs(differenceInWeeks(dateOfBirth, new Date())) < 12) {
                            return t('come-back-when-your-puppy-is-12-weeks-old');
                          }
                          return true;
                        },
                      },
                    }}
                    render={({ field: { onChange, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        className="mr-2 w-20"
                        options={Array.from({ length: 12 }, (_, i) => i)}
                        onChange={(_, data) => {
                          onChange(data);
                          dogAgeForm.trigger('years');
                          dogBirthdayForm.reset();
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            className="text-center"
                            error={!!error}
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                '&&&': { pr: '9px' },
                              },
                            }}
                            inputProps={{
                              ...params.inputProps,
                              sx: {
                                textAlign: 'center',
                              },
                            }}
                          />
                        )}
                        disableClearable
                        popupIcon={null}
                        getOptionLabel={String}
                      />
                    )}
                  />
                  <span className="body-3 ml-2">{t('months')}</span>
                </div>
              </div>
              {dogAgeForm.formState.errors && (
                <div className="mt-4">
                  <p className="body-3 text-error">
                    {dogAgeForm.formState.errors.years?.message ||
                      dogAgeForm.formState.errors.months?.message}
                  </p>
                </div>
              )}
              {showDogAgeSubmitButton && (
                <Button className="mt-8" disabled={!dogAgeForm.formState.isValid}>
                  {t('continue')}
                </Button>
              )}
            </form>
          )}
          {tab === 'Birthday' && (
            <FormProvider {...dogBirthdayForm}>
              <form
                onSubmit={dogBirthdayForm.handleSubmit(onDogBirthdaySubmit)}
                className="mx-auto mt-6 max-w-[480px]"
              >
                <DateCalendar
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
                  error={!!dogBirthdayForm.formState.errors.birthday}
                  minDate={subYears(new Date(), 35)}
                  maxDate={subDays(new Date(), 1)}
                  onChange={() => dogAgeForm.reset({ years: 0, months: 0 })}
                />
                {dogBirthdayForm.formState.errors && (
                  <div className="mt-4">
                    <p className="body-3 text-error">
                      {dogBirthdayForm.formState.errors.birthday?.message}
                    </p>
                  </div>
                )}
                {showDogBirthdaySubmitButton && (
                  <Button className="mt-8" disabled={!dogBirthdayForm.formState.isValid}>
                    {t('continue')}
                  </Button>
                )}
              </form>
            </FormProvider>
          )}
        </Section>
      </Container>
    </motion.div>
  );
}
