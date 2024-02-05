'use client';

import theme from '@/app/mui-theme';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import { TextField, ThemeProvider } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function ResetPassword() {
  const { control, handleSubmit } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    //
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="py-10 text-center text-primary">
        <Container>
          <Headings tag="h1" styles="h2">
            Change Password
          </Headings>
          <div className="mx-auto max-w-[280px] max-xs:max-w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-6">
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label="New Password"
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-4"></div>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    error={!!error}
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    {...field}
                  />
                )}
              />
              <div className="py-6"></div>
              <Button fullWidth>Set New Password</Button>
            </form>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
