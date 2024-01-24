'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { TextField, ThemeProvider } from '@mui/material';
import Button from '@/components/Button';
import theme from '@/app/mui-theme';

export default function ChangePassword() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  const onSubmit = React.useCallback((values: unknown) => {
    console.log(values);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <div className="mx-auto max-w-[520px]">
              <H2 inline className="text-center text-primary">
                Account Info
              </H2>
              <div className="py-4"></div>
              <div className="-m-2 flex flex-wrap">
                <div className="w-1/2 p-2">
                  <Controller
                    name="firstname"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="First Name" fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <Controller
                    name="lastname"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Last Name" fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Email" fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Phone Number" fullWidth error={!!error} />
                    )}
                  />
                </div>
              </div>
              <div className="mt-10">
                <UnderlineButton
                  type="button"
                  href="/account/change-password"
                  label="Change Password"
                />
              </div>
              <div className="-mx-2 mt-8 flex">
                <div className="w-1/2 px-2">
                  <Button fullWidth onClick={reset} reverse>
                    Cancel
                  </Button>
                </div>
                <div className="w-1/2 px-2">
                  <Button fullWidth>Save Changes</Button>
                </div>
              </div>
              <div className="mt-12 text-center">
                <UnderlineButton type="button" onClick={() => router.back()} label="Go Back" />
              </div>
            </div>
          </Container>
        </form>
      </main>
    </ThemeProvider>
  );
}
