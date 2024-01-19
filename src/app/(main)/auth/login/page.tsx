'use client';

import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { TextField, ThemeProvider } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function Login() {
  const { control, handleSubmit } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    //
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-[#FCF9F5] py-10 text-center text-primary">
        <Container>
          <H2 inline>Greetings!</H2>
          <p className="mt-4 text-xl">Please log in to continue.</p>
          <div className="mx-auto max-w-[300px] max-xs:max-w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} label="Email" fullWidth {...field} />
                )}
              />
              <div className="py-4"></div>
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label="Password"
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth>Log In</Button>
            </form>
            <UnderlineButton
              href="/auth/forgot-password"
              className="mt-4 text-lg"
              label="Forgot Password?"
            />
            <hr className="mt-4 border-primary" />
            <H2 inline className="mt-6">
              New To OCELLE?
            </H2>
            <Button reverse fullWidth className="mt-8">
              Build Your Plan
            </Button>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
