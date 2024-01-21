import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentViewer';
import H2 from '@/components/Heading/H2';
import Image from 'next/image';
import Stage from '../Stage';

export default function CalculatingFragment({ navigate }: FragmentProps<Stage>) {
  return (
    <Container className="text-center">
      <Image
        src="/question/loading.gif"
        alt="loading indicator"
        width={200}
        height={200}
        className="inline-block"
      />
      <H2 className="mt-8 font-bold text-primary">Calculating...</H2>
      <p className="mt-8 text-primary">
        We’re crunching some numbers to formulate [Charlie]’s meal plan.
      </p>
    </Container>
  );
}
