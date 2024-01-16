import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import UnderlineButton from '../UnderlineButton';
import Section from '../Section';
import DateCalendar from '../controls/DateCalendar';

export default function DogAgeFragment({ forward }: FragmentProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>('Age');

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <Container className="text-center">
      <Section
        title="How old is [Charlie]?"
        description="If you're unsure, just give us your best guess!"
      >
        <div className="mx-auto flex max-w-[260px] justify-between">
          <UnderlineButton
            active={tab === 'Age'}
            className={tab === 'Age' ? 'font-bold' : ''}
            onClick={() => setTab('Age')}
          >
            Enter Age
          </UnderlineButton>
          <UnderlineButton
            active={tab === 'Birthday'}
            className={tab === 'Birthday' ? 'font-bold' : ''}
            onClick={() => setTab('Birthday')}
          >
            Select Birthday
          </UnderlineButton>
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
