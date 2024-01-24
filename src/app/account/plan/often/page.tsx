'use client';

import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import H2 from '@/components/headings/H2';
import Button from '@/components/Button';
import React from 'react';

export default function PlanOften() {
  const router = useRouter();
  const [size, setSize] = React.useState<7 | 14>(14);

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <H2 inline className="text-center text-primary">
          How Often Would You Like To Receive Deliveries?
        </H2>
        <div className="mt-6">
          <div className="-mx-4 -my-3 flex flex-wrap justify-center">
            <div className="px-4 py-3">
              <div className="border-gray relative mt-3 flex w-[270px] items-center rounded-3xl border bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
                <div className="flex-1 px-2">
                  <H2 inline className="text-primary">
                    7 Days
                  </H2>
                  <p className="mt-1">$[15]/day</p>
                </div>
                <div className="px-2">
                  {size === 7 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary">
                      <div className="h-6 w-6 rounded-full bg-secondary"></div>
                    </div>
                  ) : (
                    <div className="border-gray h-8 w-8 rounded-full border"></div>
                  )}
                </div>
                <div className="absolute top-0 -translate-y-1/2 rounded-2xl border border-white bg-[#7B8D97] px-6 py-0.5 text-white">
                  Save Space
                </div>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="border-gray relative mt-3 flex w-[270px] items-center rounded-3xl border bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]">
                <div className="flex-1 px-2">
                  <H2 inline className="text-primary">
                    14 Days
                  </H2>
                  <p className="mt-1">$[13]/day</p>
                </div>
                <div className="px-2">
                  {size === 14 ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary">
                      <div className="h-6 w-6 rounded-full bg-secondary"></div>
                    </div>
                  ) : (
                    <div className="border-gray h-8 w-8 rounded-full border"></div>
                  )}
                </div>
                <div className="absolute top-0 -translate-y-1/2 rounded-2xl border border-white bg-secondary px-6 py-0.5 text-white">
                  Best Value
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-[620px] text-center">
          Your upcoming box is arriving on the{' '}
          <strong className="whitespace-nowrap">[15th of December 2023]</strong>. It contains
          [Charlie]&apos;s and [Muffin]’s fresh food.
        </p>
        <p className="mx-auto mt-4 max-w-[620px] text-center">
          Unfortunately, you can no longer make changes to your upcoming box. However, you can
          reschedule your next box, scheduled for the{' '}
          <strong className="whitespace-nowrap">[29th of December 2023]</strong>.
        </p>
        <div className="mx-auto mt-8 max-w-[480px]">
          <div className="-mx-2 flex">
            <div className="w-1/2 px-2">
              <Button fullWidth onClick={() => {}} reverse>
                Cancel
              </Button>
            </div>
            <div className="w-1/2 px-2">
              <Button fullWidth>Save Changes</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" label="Go Back" onClick={() => router.back()} />
        </div>
      </Container>
    </main>
  );
}
