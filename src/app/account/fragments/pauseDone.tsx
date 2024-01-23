import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import { Route } from '../types';
import CircleTick from '@/components/Icon/CircleTick';
import UnderlineButton from '@/components/UnderlineButton';

export default function PauseDoneFragment({ navigate }: FragmentProps<Route>) {
  return (
    <div className="py-10">
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
          <UnderlineButton
            type="button"
            onClick={() => navigate('info', { empty: true })}
            label="Back To My Info"
          />
        </div>
      </Container>
    </div>
  );
}
