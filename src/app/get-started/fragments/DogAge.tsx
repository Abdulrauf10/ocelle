import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import UnderlineButton from '@/components/UnderlineButton';
import Section from '../Section';
import DateCalendar from '@/components/controls/DateCalendar';
import clsx from 'clsx';
import { FragmentProps } from '@/components/FragmentViewer';
import Stage from '../Stage';

export default function DogAgeFragment({ navigate }: FragmentProps<Stage>) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>('Age');

  const onSubmit = React.useCallback(() => {
    navigate(Stage.DogPreference1);
  }, [navigate]);

  return (
    <Container className="text-center">
      <Section
        title="How old is [Charlie]?"
        description="If you're unsure, just give us your best guess!"
      >
        <div className="mx-auto flex max-w-[260px] justify-between">
          <UnderlineButton
            underline={tab === 'Age'}
            className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
            onClick={() => setTab('Age')}
            label="Enter Age"
          />
          <UnderlineButton
            underline={tab === 'Birthday'}
            className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
            onClick={() => setTab('Birthday')}
            label="Select Birthday"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-[480px]">
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
                <span className="ml-2">Year(s)</span>
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
                <span className="ml-2">Month(s)</span>
              </div>
            </div>
          )}
          {tab === 'Birthday' && (
            <DateCalendar
              control={control}
              name="birthday"
              rules={{ required: tab === 'Birthday' }}
              error={!!errors.birthday}
            />
          )}
          <Button className="mt-8">Continue</Button>
        </form>
      </Section>
    </Container>
  );
}
