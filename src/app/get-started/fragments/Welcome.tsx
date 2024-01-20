import Button from '@/components/Button';
import Container from '@/components/Container';
import Image from 'next/image';
import Benefits from '../Benefits';
import FragmentProps from '../FragmentProps';
import Section from '../Section';

export default function WelcomeFragment({ forward }: FragmentProps) {
  return (
    <Container className="text-center">
      <Section
        title={
          <>
            Better Food = Better Health...
            <br />
            And It Starts Here!
          </>
        }
      >
        <p className="text-primary">Let’s determine your recommended meal plan and price!</p>
        <p className="mt-5 flex items-center justify-center text-left text-primary">
          <Image
            src="/question/timer.svg"
            alt="Timer"
            width={30}
            height={26}
            className="mr-2 inline-block"
          />
          This should only take about 2 minutes per dog.
        </p>
        <Button className="mt-8" onClick={() => forward()}>
          Let’s Get Started
        </Button>
      </Section>
      <Benefits />
    </Container>
  );
}
