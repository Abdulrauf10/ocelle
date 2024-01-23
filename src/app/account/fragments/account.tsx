import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/headings/H2';
import { Route } from '../types';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import React from 'react';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';

export default function AccountFragment({ navigate }: FragmentProps<Route>) {
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
              onClick={() => navigate('password')}
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
            <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
          </div>
        </div>
      </Container>
    </form>
  );
}
