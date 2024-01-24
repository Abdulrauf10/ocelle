import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/headings/H2';
import { Path } from '../types';

export default function IndexFragment({ navigate }: FragmentProps<Path>) {
  const router = useRouter();

  return (
    <Container>
      <H2 inline className="text-center text-primary">
        Cancel My Subscription
      </H2>
      <p className="mx-auto mt-4 max-w-[680px] text-center">
        Please be advised: If you have overstocked or just need a pause in deliveries, you can
        simply delay the next shipment rather than cancel.
        <br />
        If you choose to reactivate your subscription, it can take up to one week to process a new
        order.
      </p>
      <div className="mt-6 text-center">
        <Button href="/account/pause-delivery">Pause All Deliveries</Button>
      </div>
      <div className="mx-auto mt-6 max-w-[590px]">
        <div className="-m-2 flex flex-wrap">
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => navigate('survey')}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
