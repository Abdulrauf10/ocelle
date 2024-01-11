import Button from '@/components/Button';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import UnderlineButton from '../UnderlineButton';
import Section from '../Section';
import H2 from '@/components/Heading/H2';
import SectionBreak from '../SectionBreak';

export default function OwnerFragment({ forward }: FragmentProps) {
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
      <H2 className="font-bold text-primary">Now, tell us a bit about you!</H2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-[50px]">
        <Section title="What’s your name?">
          <div className="mx-auto max-w-[320px]">
            <Controller
              name="firstname"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder="First Name" fullWidth {...field} />
              )}
            />
            <Controller
              name="lastname"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  error={!!error}
                  placeholder="Last Name"
                  fullWidth
                  {...field}
                  className="mt-[20px]"
                />
              )}
            />
          </div>
        </Section>
        <SectionBreak />
        <Section title="What’s your email address?">
          <div className="mx-auto max-w-[320px]">
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: '[This email doesn’t look correct, please update it.]',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder="Email" fullWidth {...field} />
              )}
            />
          </div>
          {errors?.email?.message && (
            <p className="mt-[10px] w-full text-[#f00]">{String(errors?.email?.message)}</p>
          )}
        </Section>
        <div className="mt-[40px]">
          <UnderlineButton onClick={() => {}}>ALREADY HAVE AN ACCOUNT? LOG IN HERE</UnderlineButton>
        </div>
        <Button className="mt-[40px]">Continue</Button>
      </form>
    </Container>
  );
}
