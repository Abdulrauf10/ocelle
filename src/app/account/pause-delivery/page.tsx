'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import UnderlineButton from '@/components/UnderlineButton';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';
import DateCalendar from '@/components/controls/DateCalendar';
import CircleTick from '@/components/icons/CircleTick';

export default function PauseDelivery() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();
  const [completed, setCompleted] = React.useState(false);

  const onSubmit = React.useCallback((values: unknown) => {
    console.log(values);
    setCompleted(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        {completed ? (
          <Container>
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary p-1.5">
              <CircleTick className="relative top-px" />
            </div>
            <H2 inline className="mt-2 text-center text-primary">
              Done!
            </H2>
            <p className="mx-auto mt-4 max-w-[360px] text-center">
              Your orders are now paused. Delivery will resume on the{' '}
              <strong className="whitespace-nowrap">[23rd of February 2024]</strong>.
            </p>
            <div className="mt-8 text-center">
              <UnderlineButton type="button" href="/account" label="Back To My Info" />
            </div>
          </Container>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Container>
              <H2 inline className="text-center text-primary">
                Pause All Deliveries
              </H2>
              <p className="mx-auto mt-4 max-w-[680px] text-center">
                Let us know when you’d like to pause your plan until. You can always adjust your
                restart date and we’ll notify you before we begin preparing your next order.
              </p>
              <div className="py-4"></div>
              <div className="text-gold text-center text-xl font-bold">
                When Would You Like To Resume?
              </div>
              <div className="mt-4">
                <DateCalendar name="deliveryDate" control={control} minDate={new Date()} />
              </div>
              <div className="mt-8 text-center">
                <UnderlineButton type="button" onClick={() => router.back()} label="Go Back" />
              </div>
            </Container>
          </form>
        )}
      </main>
    </ThemeProvider>
  );
}
