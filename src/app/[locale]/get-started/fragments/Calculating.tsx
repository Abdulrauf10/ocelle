import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import Headings from '@/components/Headings';
import Stage from '../Stage';

export default function CalculatingFragment({ navigate }: FragmentProps<Stage>) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(Stage.ChoosePlan);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Container className="text-center">
      <Image
        src="/question/loading.gif"
        alt="loading indicator"
        width={200}
        height={200}
        className="inline-block"
      />
      <Headings tag="h1" styles="h2" className="mt-8 font-bold text-primary">
        Calculating...
      </Headings>
      <p className="mt-8 text-primary">
        We’re crunching some numbers to formulate [Charlie]’s meal plan.
      </p>
    </Container>
  );
}
