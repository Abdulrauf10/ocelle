import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import Button from '@/components/Button';
import { TextField } from '@mui/material';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import LineRadioGroup from '../controls/LineRadioGroup';
import Image from 'next/image';

export default function DogPreference1Fragment({ forward }: FragmentProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title="What is [Charlie]’s current weight?"
          description="If you’re unsure, you can always adjust this information in your account later."
        >
          <div className="flex flex-wrap items-center justify-center">
            <Controller
              name="kgs"
              control={control}
              rules={{
                required: true,
                min: {
                  value: 0.5,
                  message: '[Ocelle is currently available to dogs between 0.5 to 50 kg.]',
                },
                max: {
                  value: 50,
                  message: '[Ocelle is currently available to dogs between 0.5 to 50 kg.]',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  type="number"
                  className="mr-2 w-20"
                  inputProps={{ min: 0, step: 0.1 }}
                  {...field}
                  error={!!error}
                />
              )}
            />
            <span className="ml-2">kg</span>
            {errors?.kgs?.message && (
              <p className="mt-[10px] w-full text-[#f00]">{String(errors?.kgs?.message)}</p>
            )}
          </div>
        </Section>
        <SectionBreak />
        <Section title="What best represents their current body condition?">
          <div className="mx-auto mt-[40px] max-w-[840px]">
            <LineRadioGroup
              name="bodyCondition"
              rules={{ required: true }}
              control={control}
              radios={[
                {
                  label: 'Too Skinny',
                  value: 'too-skinny',
                  children: (
                    <Image
                      src="/question/body-skinny.svg"
                      alt="dog skinny"
                      width={120}
                      height={120}
                    />
                  ),
                },
                {
                  label: 'Just Right',
                  value: 'just-right',
                  children: (
                    <Image
                      src="/question/body-just-right.svg"
                      alt="dog just right"
                      width={120}
                      height={120}
                    />
                  ),
                },
                {
                  label: 'Rounded',
                  value: 'rounded',
                  children: (
                    <Image
                      src="/question/body-rounded.svg"
                      alt="dog rounded"
                      width={120}
                      height={120}
                    />
                  ),
                },
                {
                  label: 'Chunky',
                  value: 'chunky',
                  children: (
                    <Image
                      src="/question/body-chunky.svg"
                      alt="dog chunky"
                      width={120}
                      height={50}
                    />
                  ),
                },
              ]}
            />
          </div>
          <p className="mt-[20px] text-primary">
            [Visible rib cage and / or spine. Noticeable loss of muscle mass.]
          </p>
          <p className="mt-[20px] italic text-primary">
            [We’ll adjust their calories and help to manage their weight, so that it’s just right
            for optimum health and wellbeing!]
          </p>
        </Section>
        <SectionBreak />
        <Section title="How active is [Charlie]?">
          <div className="mx-auto mt-[40px] max-w-[640px]">
            <LineRadioGroup
              name="active"
              rules={{ required: true }}
              control={control}
              radios={[
                {
                  label: 'Mellow',
                  value: 'mellow',
                  children: (
                    <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={100} />
                  ),
                },
                {
                  label: 'Active',
                  value: 'active',
                  children: (
                    <Image src="/question/active.svg" alt="Active dog" width={80} height={80} />
                  ),
                },
                {
                  label: 'Very Active',
                  value: 'very-active',
                  children: (
                    <Image
                      src="/question/very-active.svg"
                      alt="Very Active dog"
                      width={110}
                      height={100}
                    />
                  ),
                },
              ]}
            />
          </div>
          <p className="mt-[20px] text-primary">
            [Less than 30 minutes of outdoor daily activity.]
          </p>
        </Section>
        <Button className="mt-[30px]">Continue</Button>
      </form>
    </Container>
  );
}
