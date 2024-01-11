import Button from '@/components/Button';
import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';

export default function DogFragment({ forward }: FragmentProps) {
  const { handleSubmit, control } = useForm();
  const [showMoreDogs, setShowMoreDogs] = React.useState(false);

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <Container className="text-center">
      <H2 className="text-primary">What’s your dog’s name?</H2>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-[30px] max-w-[320px]">
        <Controller
          name="dogName"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField error={!!error} placeholder="Your Dog’s Name" fullWidth {...field} />
          )}
        />
        <Button className="mt-[40px]">Continue</Button>
      </form>
      <button
        className="mt-[40px] text-[18px] text-secondary underline"
        onClick={() => setShowMoreDogs(true)}
      >
        I Have More Dogs
      </button>
      {showMoreDogs && (
        <p className="mt-[20px] italic text-primary">
          [Great! After you have finalised the order details for your first dog,
          <br />
          you can click ‘<strong>+ Add Another Dog</strong>’ later in this quiz or in your account.
          <br />
          We’ll conduct the nutritional consultation for your other dog(s), as nutrition is not a
          one-size-fits-all affair...
          <br />
          and that is of course, reflected in their personalised meal plans.]
        </p>
      )}
    </Container>
  );
}
