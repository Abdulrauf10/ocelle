import Button from '@/components/Button';
import Container from '@/components/Container';
import H2 from '@/components/Heading/H2';
import Image from 'next/image';
import Benefits from '../Benefits';
import FragmentProps from '../FragmentProps';

export default function WelcomeFragment({ forward }: FragmentProps) {
  return (
    <Container className="text-center">
      <H2 className="text-primary">
        Better Food = Better Health...
        <br />
        And It Starts Here!
      </H2>
      <p className="mt-[20px] text-primary">
        Let’s determine your recommended meal plan and price!
      </p>
      <p className="mt-[20px] flex items-center justify-center text-left text-primary">
        <Image
          src="/question/timer.svg"
          alt="Timer"
          width={30}
          height={30}
          className="mr-2 inline-block"
        />
        This should only take about 2 minutes per dog.
      </p>
      <Button className="mt-[30px]" onClick={() => forward()}>
        Let’s Get Started
      </Button>
      <Benefits />
    </Container>
  );
}
