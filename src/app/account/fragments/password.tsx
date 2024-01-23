import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import { Route } from '../types';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import React from 'react';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';

export default function PasswordFragment({ navigate }: FragmentProps<Route>) {
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
    <form className="py-10" onSubmit={handleSubmit(onSubmit)}>
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
                  <TextField {...field} label="Confirm New Password" fullWidth error={!!error} />
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
            <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
          </div>
        </div>
      </Container>
    </form>
  );
}
