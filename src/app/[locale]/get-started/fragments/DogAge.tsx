import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import UnderlineButton from '@/components/UnderlineButton';
import Section from '../Section';
import DateCalendar from '@/components/controls/DateCalendar';
import clsx from 'clsx';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { subDays } from 'date-fns';

interface DogAgeForm {
  months?: number;
  years?: number;
  birthday?: Date;
}

export default function DogAgeFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { getDog, setDog } = useSurvey();
  const { name, age } = getDog();
  const {
    handleSubmit,
    control,
    formState: { errors },
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

  return (
    <Container className="text-center">
      <Section
        title={t('how-old-is-{}', { name })}
        description={t('if-youre-unsure-just-give-us-your-best-guess')}
      >
        <div className="mx-auto mt-8 flex max-w-[260px] justify-between">
          <UnderlineButton
            underline={tab === 'Age'}
            className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
            onClick={() => setTab('Age')}
            label={t('enter-age')}
          />
          <UnderlineButton
            underline={tab === 'Birthday'}
            className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
            onClick={() => setTab('Birthday')}
            label={t('select-birthday')}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6 max-w-[480px]">
          {tab === 'Age' && (
            <div className="flex justify-center">
              <div className="flex items-center px-4">
                <Controller
                  name="years"
                  control={control}
                  rules={{ required: tab === 'Age' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="number"
                      className="mr-2 w-20"
                      inputProps={{ min: 0 }}
                      {...field}
                      error={!!error}
                    />
                  )}
                />
                <span className="body-3 ml-2">{t('years')}</span>
              </div>
              <div className="flex items-center px-4">
                <Controller
                  name="months"
                  control={control}
                  rules={{ required: tab === 'Age' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      type="number"
                      className="mr-2 w-20"
                      inputProps={{ min: 0 }}
                      {...field}
                      error={!!error}
                    />
                  )}
                />
                <span className="body-3 ml-2">{t('months')}</span>
              </div>
            </div>
          )}
          {tab === 'Birthday' && (
            <DateCalendar
              control={control}
              name="birthday"
              rules={{ required: tab === 'Birthday' }}
              error={!!errors.birthday}
              maxDate={subDays(new Date(), 1)}
            />
          )}
          <Button className="mt-8">{t('continue')}</Button>
        </form>
      </Section>
    </Container>
  );
}
