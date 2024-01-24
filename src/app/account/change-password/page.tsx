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
                Change Password
              </H2>
              <div className="py-4"></div>
              <div className="-m-2 flex flex-wrap">
                <div className="w-full p-2">
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Current Password" fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="New Password" fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-1/2 p-2">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Confirm New Password"
                        fullWidth
                        error={!!error}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="-mx-2 mt-10 flex">
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
