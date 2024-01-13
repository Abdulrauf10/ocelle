import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import UnderlineButton from '../UnderlineButton';
import Section from '../Section';

export default function DogAgeFragment({ forward }: FragmentProps) {
  const { handleSubmit, control } = useForm();

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
          <UnderlineButton className="font-bold" onClick={() => {}}>
            Enter Age
          </UnderlineButton>
          <UnderlineButton active={false} onClick={() => {}}>
            Select Birthday
          </UnderlineButton>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-[480px]">
          <div className="flex justify-center">
            <div className="flex items-center px-4">
              <Controller
                name="years"
                control={control}
                rules={{ required: true }}
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
                rules={{ required: true }}
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
          <Button className="mt-8">Continue</Button>
        </form>
      </Section>
    </Container>
  );
}
