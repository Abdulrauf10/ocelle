import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import Image from 'next/image';

export default function CalculatingFragment() {
  return (
    <Container className="text-center">
      <Image
        src="/question/loading.gif"
        alt="loading indicator"
        width={200}
        height={200}
        className="inline-block"
      />
      <H2 className="mt-[30px] font-bold text-primary">Calculating...</H2>
      <p className="mt-[30px] text-primary">
        We’re crunching some numbers to formulate [Charlie]’s meal plan.
      </p>
    </Container>
  );
}
