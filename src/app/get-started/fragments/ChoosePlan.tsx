import React from 'react';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { FragmentProps } from '@/components/FragmentRouter';
import FreshPlan from '@/components/FreshPlan';
import Section from '../Section';
import Stage from '../Stage';

export default function ChoosePlanFragment({ navigate }: FragmentProps<Stage>) {
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
      navigate(Stage.RecommendedPlan);
    }
  }, [selected, navigate]);

  return (
    <Container className="text-center">
      <Section title="Choose The Best Plan For You And [Charlie]">
        <div className="mx-auto flex max-w-[900px] flex-wrap">
          <div className="w-1/2 px-2 max-lg:w-full">
            <FreshPlan
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
            </FreshPlan>
          </div>
          <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
            <FreshPlan
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
            </FreshPlan>
          </div>
        </div>
        {error && <p className="text-error mt-5">{error}</p>}
      </Section>
      <Button className="mt-10" onClick={onSubmit}>
        Continue
      </Button>
    </Container>
  );
}
