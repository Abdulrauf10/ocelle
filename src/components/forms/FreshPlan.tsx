'use client';

import { useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import FreshPlan from '../FreshPlan';
import Button from '../Button';
import { serialize } from 'object-to-formdata';

export default function FreshPlanForm({
  initialPlan,
  action,
}: {
  initialPlan: 'full' | 'half';
  action(formData: FormData): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [plan, setPlan] = React.useState<'full' | 'half'>(initialPlan);

  const isSameAsDefaultValue = plan === initialPlan;

  return (
    <>
      <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap">
        <div className="w-1/2 px-2 max-lg:w-full">
          <FreshPlan
            title={t('fresh-full-plan')}
            picture="/meal-plan/full-plan.jpg"
            pricePerDay={36}
            recommended
            selected={plan === 'full'}
            onSelect={() => setPlan('full')}
          >
            {t('fresh-full-plan:description')}
          </FreshPlan>
        </div>
        <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
          <FreshPlan
            title={t('fresh-half-plan')}
            picture="/meal-plan/half-plan.jpg"
            pricePerDay={25}
            selected={plan === 'half'}
            onSelect={() => setPlan('half')}
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
                  action(serialize({ plan }));
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
