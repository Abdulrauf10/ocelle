import React from 'react';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { FragmentProps } from '@/components/FragmentRouter';
import FreshPlan from '@/components/FreshPlan';
import Section from '../Section';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function ChoosePlanFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const firstUpdate = React.useRef(true);
  const [selected, setSelected] = React.useState<number>();
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    if (firstUpdate.current && selected == null) {
      setError(t('you-must-select-either-one-of-the-plan'));
      firstUpdate.current = false;
    } else {
      setError(undefined);
    }
  }, [t, selected]);

  const onSubmit = React.useCallback(() => {
    if (selected == null) {
      setError(t('you-must-select-either-one-of-the-plan'));
    } else {
      navigate(Stage.RecommendedPlan);
    }
  }, [t, selected, navigate]);

  const name = 'Charlie';

  return (
    <Container className="text-center">
      <Section title={t('choose-the-best-plan-for-you-and-{}', { name })}>
        <div className="mx-auto flex max-w-[900px] flex-wrap">
          <div className="w-1/2 px-2 max-lg:w-full">
            <FreshPlan
              title={t('fresh-full-plan')}
              picture="/meal-plan/full-plan.jpg"
              pricePerDay={36}
              discountedPricePerDay={18}
              firstDiscount
              error={!!error}
              recommended
              selected={selected === 0}
              onSelect={() => setSelected(0)}
            >
              {t('fresh-full-plan:description')}
            </FreshPlan>
          </div>
          <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
            <FreshPlan
              title={t('fresh-half-plan')}
              picture="/meal-plan/half-plan.jpg"
              pricePerDay={25}
              discountedPricePerDay={12.5}
              firstDiscount
              error={!!error}
              selected={selected === 1}
              onSelect={() => setSelected(1)}
            >
              {t('fresh-half-plan:description')}
            </FreshPlan>
          </div>
        </div>
        {error && <p className="mt-5 text-error">{error}</p>}
      </Section>
      <Button className="mt-10" onClick={onSubmit}>
        {t('continue')}
      </Button>
    </Container>
  );
}
