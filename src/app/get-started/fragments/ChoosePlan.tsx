import Container from '@/components/Container';
import Section from '../Section';
import Image from 'next/image';
import React from 'react';
import clsx from 'clsx';
import Button from '@/components/Button';
import FragmentProps from '../FragmentProps';
import Price from '@/components/Price';
import CircleTick from '@/components/Icon/CircleTick';

interface PlanProps {
  title: string;
  picture: string;
  pricePerDay: number;
  discountedPricePerDay?: number;
  recommended?: boolean;
  error: boolean;
  selected: boolean;
  onSelect(): void;
}

function Plan({
  title,
  picture,
  pricePerDay,
  discountedPricePerDay,
  recommended,
  error,
  selected,
  onSelect,
  children,
}: React.PropsWithChildren<PlanProps>) {
  return (
    <div
      className={clsx(
        'mx-auto flex h-full max-w-[400px] cursor-pointer flex-col rounded-[30px] border p-6 text-left shadow-[0_0_15px_rgba(0,0,0,0.2)]',
        error ? 'border-[#f00]' : selected ? 'border-primary' : 'border-transparent'
      )}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-start max-xs:flex-wrap">
        <Image
          src={picture}
          alt={title}
          width={160}
          height={160}
          className="min-w-[160px] rounded-2xl"
        />
        <div className="ml-4 max-xs:ml-0 max-xs:mt-2">
          <h3
            className={clsx(
              'text-lg font-bold uppercase',
              selected ? 'text-primary' : 'text-[#A98D72]'
            )}
          >
            {title}
          </h3>
          <div
            className={clsx(
              'mt-0.5 inline-block rounded-3xl bg-secondary px-3 py-0.5 text-center font-open-sans text-sm italic text-white',
              !recommended && 'opacity-0'
            )}
          >
            Recommended
          </div>
          <p className="mt-2">
            Starting at:
            <br />
            <Price value={pricePerDay} discount={!!discountedPricePerDay} />
            {discountedPricePerDay && (
              <Price className="ml-1 font-bold" value={discountedPricePerDay} />
            )}
            <span className="font-bold text-[#269D9E]">/day</span>.
          </p>
          <p className="mt-2">
            Enjoy <span className="font-bold text-[#269D9E]">50%</span> off for{' '}
            <br className="max-lg:hidden" />
            your starter box.
          </p>
        </div>
      </div>
      <p className="mt-5 h-full">{children}</p>
      <div className="mt-5 flex justify-end text-center font-open-sans text-white">
        <div
          className={clsx(
            'inline-flex min-w-[120px] items-center justify-center rounded-3xl px-2 py-1',
            selected ? 'bg-primary' : 'bg-[#A98D72]'
          )}
        >
          {selected && <CircleTick className="mr-2 inline-block h-5 w-5" />}
          {selected ? 'Selected' : 'Select'}
        </div>
      </div>
    </div>
  );
}

export default function ChoosePlanFragment({ forward }: FragmentProps) {
  const firstUpdate = React.useRef(true);
  const [selected, setSelected] = React.useState<number>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    if (firstUpdate.current && selected == null) {
      setError('[You must select either one of the plan]');
      firstUpdate.current = false;
    } else {
      setError(undefined);
    }
  }, [selected]);

  const onSubmit = React.useCallback(() => {
    if (selected == null) {
      setError('[You must select either one of the plan]');
    } else {
      forward();
    }
  }, [selected, forward]);

  return (
    <Container className="text-center">
      <Section title="Choose The Best Plan For You And [Charlie]">
        <div className="mx-auto flex max-w-[900px] flex-wrap">
          <div className="w-1/2 px-2 max-lg:w-full">
            <Plan
              title="Fresh Full Plan"
              picture="/meal-plan/full-plan.jpg"
              pricePerDay={36}
              discountedPricePerDay={18}
              error={!!error}
              recommended
              selected={selected === 0}
              onSelect={() => setSelected(0)}
            >
              Everything needed in one simple serving. Reap the full benefits of fresh, nutritious
              meals for your dog, meticulously crafted and portioned by experts.
            </Plan>
          </div>
          <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
            <Plan
              title="Fresh Half Plan"
              picture="/meal-plan/half-plan.jpg"
              pricePerDay={25}
              discountedPricePerDay={12.5}
              error={!!error}
              selected={selected === 1}
              onSelect={() => setSelected(1)}
            >
              Everything needed to supplement your dog’s current diet! Reinvigorate your dog&apos;s
              current meals with a fresh, nutrient-packed addition.
            </Plan>
          </div>
        </div>
        {error && <p className="mt-5 text-[#f00]">{error}</p>}
      </Section>
      <Button className="mt-10" onClick={onSubmit}>
        Continue
      </Button>
    </Container>
  );
}
