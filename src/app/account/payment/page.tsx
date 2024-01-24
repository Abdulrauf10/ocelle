'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { ThemeProvider } from '@mui/material';
import Button from '@/components/Button';
import theme from '@/app/mui-theme';
import CardForm from '@/components/forms/Card';

export default function Payments() {
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
        <Container>
          <div className="mx-auto max-w-[520px]">
            <H2 inline className="text-center text-primary">
              Payment Info
            </H2>
            <div className="py-4"></div>
            <CardForm control={control} />
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
      </main>
    </ThemeProvider>
  );
}
