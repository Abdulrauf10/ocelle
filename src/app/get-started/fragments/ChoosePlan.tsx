import Container from '@/components/Container';
import Section from '../Section';
import Image from 'next/image';
import React, { useEffect } from 'react';
import clsx from 'clsx';
import Tick from '@/app/tick.svg';
import Button from '@/components/Button';
import FragmentProps from '../FragmentProps';
import Price from '../Price';

interface PlanProps {
  title: string;
  picture: string;
  pricePerDay: number;
  discountedPricePerDay?: number;
  recommended?: boolean;
  selected: boolean;
  onSelect(): void;
}

function Plan({
  title,
  picture,
  pricePerDay,
  discountedPricePerDay,
  recommended,
  selected,
  onSelect,
  children,
}: React.PropsWithChildren<PlanProps>) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-[405px] cursor-pointer rounded-[30px] border p-[24px] text-left shadow-[0_0_5px_rgba(0,0,0,0.4)]',
        selected ? 'border-primary' : 'border-transparent'
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
      <div className="max-xs:flex-wrap flex items-start">
        <Image
          src={picture}
          alt={title}
          width={150}
          height={150}
          className="min-w-[160] rounded-[20px]"
        />
        <div className="max-xs:ml-0 max-xs:mt-2 ml-[18px]">
          <h3
            className={clsx(
              'text-[20px] font-bold uppercase',
              selected ? 'text-primary' : 'text-[#A98D72]'
            )}
          >
            {title}
          </h3>
          <div
            className={clsx(
              'font-open-sans inline-block rounded-[20px] bg-secondary px-[12px] py-[3px] text-center text-sm italic text-white',
              !recommended && 'opacity-0'
            )}
          >
            Recommended
          </div>
          <p className="mt-[8px]">
            Starting at:
            <br />
            <Price price={pricePerDay} discountedPrice={discountedPricePerDay} />
            <span className="font-bold text-[#269D9E]">/day</span>.
          </p>
          <p className="mt-[8px]">
            Enjoy <span className="font-bold text-[#269D9E]">50%</span> off for{' '}
            <br className="max-lg:hidden" />
            your starter box.
          </p>
        </div>
      </div>
      <p className="mt-[20px]">{children}</p>
      <div className="font-open-sans mt-[20px] flex justify-end text-center text-white">
        <div
          className={clsx(
            'inline-flex min-w-[120px] items-center justify-center rounded-[20px] px-[8px] py-[5px]',
            selected ? 'bg-primary' : 'bg-[#A98D72]'
          )}
        >
          {selected && (
            <Image src={Tick} alt="Tick" width={20} height={20} className="mr-2 inline-block" />
          )}
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
        <div className="mx-auto flex max-w-[920px] flex-wrap">
          <div className="w-1/2 px-2 max-lg:w-full">
            <Plan
              title="Fresh Full Plan"
              picture="/meal-plan/full-plan.jpg"
              pricePerDay={36}
              discountedPricePerDay={18}
              recommended
              selected={selected === 0}
              onSelect={() => setSelected(0)}
            >
              Everything needed in one simple serving. Reap the full benefits of fresh, nutritious
              meals for your dog, meticulously crafted and portioned by experts.
            </Plan>
          </div>
          <div className="w-1/2 px-2 max-lg:mt-[30px] max-lg:w-full">
            <Plan
              title="Fresh Half Plan"
              picture="/meal-plan/half-plan.jpg"
              pricePerDay={25}
              discountedPricePerDay={12.5}
              selected={selected === 1}
              onSelect={() => setSelected(1)}
            >
              Everything needed to supplement your dog’s current diet! Reinvigorate your dog&apos;s
              current meals with a fresh, nutrient-packed addition.
            </Plan>
          </div>
        </div>
        {error && <p className="mt-[20px] text-[#f00]">{error}</p>}
      </Section>
      <Button className="mt-[40px]" onClick={onSubmit}>
        Continue
      </Button>
    </Container>
  );
}
