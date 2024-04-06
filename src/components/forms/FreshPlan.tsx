'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import FreshPlan from '../FreshPlan';
import Button from '../buttons/Button';
import { MealPlan } from '@/enums';
import { nativeRound } from '@/helpers/number';

export default function FreshPlanForm({
  initialPlan,
  halfPlanPrice,
  fullPlanPrice,
  action,
}: {
  initialPlan: MealPlan;
  halfPlanPrice: number;
  fullPlanPrice: number;
  action(data: { plan: MealPlan }): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = React.useTransition();
  const [plan, setPlan] = React.useState<MealPlan>(initialPlan);

  const isSameAsDefaultValue = plan === initialPlan;

  return (
    <>
      <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap">
        <div className="w-1/2 px-2 max-lg:w-full">
          <FreshPlan
            title={t('fresh-full-plan')}
            picture="/meal-plan/full-plan.jpg"
            pricePerDay={nativeRound(fullPlanPrice)}
            recommended
            selected={plan === MealPlan.Full}
            onSelect={() => setPlan(MealPlan.Full)}
          >
            {t('fresh-full-plan:description')}
          </FreshPlan>
        </div>
        <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
          <FreshPlan
            title={t('fresh-half-plan')}
            picture="/meal-plan/half-plan.jpg"
            pricePerDay={nativeRound(halfPlanPrice)}
            selected={plan === MealPlan.Half}
            onSelect={() => setPlan(MealPlan.Half)}
          >
            {t('fresh-half-plan:description')}
          </FreshPlan>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => setPlan(initialPlan)}
              reverse
              disabled={isSameAsDefaultValue}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              disabled={pending || isSameAsDefaultValue}
              onClick={() =>
                startTransition(() => {
                  action({ plan });
                })
              }
            >
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
