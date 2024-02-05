'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import Container from '@/components/Container';
import UnderlineButton from '@/components/UnderlineButton';
import Button from '@/components/Button';
import DogSwitch from '../../DogSwitch';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';
import FreshPlan from '@/components/FreshPlan';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

export default function PlanMeal() {
  const t = useTranslations('general');
  const router = useRouter();
  const [selected, setSelected] = React.useState<number>(0);

  const onSubmit = React.useCallback(() => {
    //
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch />
          </div>
          <Headings tag="h1" styles="h2" className="text-center text-primary max-lg:mt-6">
            Choose [Charlie]&apos;s Fresh Recipes
          </Headings>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            [Charlie]’s upcoming box is scheduled for the{' '}
            <strong className="whitespace-nowrap">[15th of December 2023]</strong>.
          </p>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            You can make changes until the{' '}
            <strong className="whitespace-nowrap">[10th of December 2023] 11:59PM</strong>.
          </p>
          <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap">
            <div className="w-1/2 px-2 max-lg:w-full">
              <FreshPlan
                title="Fresh Full Plan"
                picture="/meal-plan/full-plan.jpg"
                pricePerDay={36}
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
                selected={selected === 1}
                onSelect={() => setSelected(1)}
              >
                Everything needed to supplement your dog’s current diet! Reinvigorate your
                dog&apos;s current meals with a fresh, nutrient-packed addition.
              </FreshPlan>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-[480px]">
            <div className="-mx-2 flex">
              <div className="w-1/2 px-2">
                <Button fullWidth onClick={() => {}} reverse>
                  {t('cancel')}
                </Button>
              </div>
              <div className="w-1/2 px-2">
                <Button fullWidth>{t('save-changes')}</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <UnderlineButton type="button" label={t('go-back')} onClick={() => router.back()} />
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
