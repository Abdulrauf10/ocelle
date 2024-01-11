import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import Button from '@/components/Button';
import { Autocomplete, TextField } from '@mui/material';
import RadioControl from '../controls/Radio';

const breeds: string[] = [];

export default function DogBasicFragment({ forward }: FragmentProps) {
  const { handleSubmit, control } = useForm();

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <Container className="text-center">
      <H2 className="text-primary">What breed is [Charlie]?</H2>
      <p className="mt-[20px] italic text-primary">
        If [Charlie] is a mix, you can select multiple breeds.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-[30px] max-w-[480px]">
        <Controller
          name="breed"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              multiple
              fullWidth
              options={breeds}
              renderInput={(params) => (
                <TextField placeholder="Start Typing The Breed" {...params} {...field} />
              )}
            />
          )}
        />
        <div className="mt-[20px] px-3">
          <RadioControl
            control={control}
            name="isUnknownBreed"
            label="Don’t Know The Breed"
            value="Y"
          />
        </div>
        <H2 className="mt-[70px] text-primary">[Charlie] is a ...</H2>
        <div className="mt-[30px] flex justify-center">
          <div className="px-3">
            <RadioControl value={0} isBlock control={control} name="gender" label="Boy" />
          </div>
          <div className="px-3">
            <RadioControl value={1} isBlock control={control} name="gender" label="Girl" />
          </div>
        </div>
        <H2 className="mt-[80px] text-primary">Is [Charlie] ...</H2>
        <div className="mt-[30px] flex justify-center">
          <div className="px-3">
            <RadioControl value={0} isBlock control={control} name="neuter" label="[Neutered]" />
          </div>
          <div className="px-3">
            <RadioControl
              value={1}
              isBlock
              control={control}
              name="neuter"
              label="[Not Neutered]"
            />
          </div>
        </div>
        <p className="mt-[30px] italic text-primary">
          Spayed and neutered dogs require fewer calories.
        </p>
        <Button className="mt-[30px]">Continue</Button>
      </form>
    </Container>
  );
}
