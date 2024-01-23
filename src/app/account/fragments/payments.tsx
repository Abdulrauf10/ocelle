import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import { Route } from '../types';
import { useForm } from 'react-hook-form';
import React from 'react';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';
import CardForm from '@/components/Form/Card';

export default function PaymentsFragment({ navigate }: FragmentProps<Route>) {
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
            <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
          </div>
        </div>
      </Container>
    </form>
  );
}
