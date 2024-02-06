import Button from '@/components/Button';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import UnderlineButton from '@/components/UnderlineButton';
import Section from '../Section';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function DogFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { handleSubmit, control } = useForm();
  const [showMoreDogs, setShowMoreDogs] = React.useState(false);

  const onSubmit = React.useCallback(() => {
    navigate(Stage.DogBasic);
  }, [navigate]);

  return (
    <Container className="text-center">
      <Section title="What’s your dog’s name?">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-[320px]">
          <Controller
            name="dogName"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField error={!!error} placeholder="Your Dog’s Name" fullWidth {...field} />
            )}
          />
          <Button className="mt-10">{t('continue')}</Button>
        </form>
        <UnderlineButton
          className="mt-10 text-lg"
          onClick={() => setShowMoreDogs(true)}
          label="I Have More Dogs"
        />
        {showMoreDogs && (
          <p className="mt-5 italic text-primary">
            [Great! After you have finalised the order details for your first dog,
            <br />
            you can click ‘<strong>+ Add Another Dog</strong>’ later in this quiz or in your
            account.
            <br />
            We’ll conduct the nutritional consultation for your other dog(s), as nutrition is not a
            one-size-fits-all affair...
            <br />
            and that is of course, reflected in their personalised meal plans.]
          </p>
        )}
      </Section>
    </Container>
  );
}
