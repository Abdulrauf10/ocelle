import React from 'react';
import { FragmentProps } from '@/components/FragmentRouter';
import { Route } from '../types';
import { useForm } from 'react-hook-form';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import DateCalendar from '@/components/controls/DateCalendar';
import UnderlineButton from '@/components/UnderlineButton';

export default function PauseFragment({ navigate }: FragmentProps<Route>) {
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
        <H2 inline className="text-center text-primary">
          Pause All Deliveries
        </H2>
        <p className="mx-auto mt-4 max-w-[680px] text-center">
          Let us know when you’d like to pause your plan until. You can always adjust your restart
          date and we’ll notify you before we begin preparing your next order.
        </p>
        <div className="py-4"></div>
        <div className="text-gold text-center text-xl font-bold">
          When Would You Like To Resume?
        </div>
        <div className="mt-4">
          <DateCalendar name="deliveryDate" control={control} minDate={new Date()} />
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
        </div>
      </Container>
    </form>
  );
}
