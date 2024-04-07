'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import FreshPlan from '../FreshPlan';
import Button from '../buttons/Button';
import { MealPlan } from '@/enums';
import { nativeRound } from '@/helpers/number';
import useDefaultValues from '@/hooks/defaultValues';

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
  const { defaultValues, setDefaultValues } = useDefaultValues({ plan: initialPlan });
  const [pending, startTransition] = React.useTransition();
  const [plan, setPlan] = React.useState<MealPlan>(defaultValues.plan);

  React.useEffect(() => {
    setPlan(initialPlan);
    setDefaultValues({ plan: initialPlan });
  }, [initialPlan, setDefaultValues]);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      await action({ plan });
      setDefaultValues({ plan });
    });
  }, [action, setDefaultValues, plan]);

  const isSameAsDefaultValue = plan === defaultValues.plan;

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
              onClick={() => setPlan(defaultValues.plan)}
              reverse
              disabled={isSameAsDefaultValue}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending || isSameAsDefaultValue} onClick={onSubmit}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
