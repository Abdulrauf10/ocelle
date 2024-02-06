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
  const t = useTranslations();
  const router = useRouter();
  const [selected, setSelected] = React.useState<number>(0);

  const onSubmit = React.useCallback(() => {
    //
  }, []);

  const name = 'Charlie';

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto flex max-w-[1120px] justify-end">
            <DogSwitch />
          </div>
          <Headings tag="h1" styles="h2" className="text-center text-primary max-lg:mt-6">
            {t('choose-{}-fresh-recipes', { name })}
          </Headings>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            {t.rich('{}-upcoming-box-is-scheduled-for-the-{}', {
              name,
              date: '15th of December 2023',
              strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
            })}
          </p>
          <p className="mx-auto mt-4 max-w-[620px] text-center">
            {t.rich('you-can-make-changes-until-the-{}', {
              date: '15th of December 2023',
              strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
            })}
          </p>
          <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap">
            <div className="w-1/2 px-2 max-lg:w-full">
              <FreshPlan
                title={t('fresh-full-plan')}
                picture="/meal-plan/full-plan.jpg"
                pricePerDay={36}
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
                selected={selected === 1}
                onSelect={() => setSelected(1)}
              >
                {t('fresh-half-plan:description')}
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
