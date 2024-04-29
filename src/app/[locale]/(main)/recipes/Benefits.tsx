'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import Button from '@/components/buttons/Button';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';

export default function RecipeBenefits() {
  const t = useTranslations();
  const r = useTranslations('Recipes');

  const benefits = React.useMemo(() => {
    return [
      {
        title: r('block-7-title-1'),
        description: r('block-7-content-1'),
      },
      {
        title: r('block-7-title-2'),
        description: r('block-7-content-2'),
      },
      {
        title: r('block-7-title-3'),
        description: r('block-7-content-3'),
      },
      {
        title: r('block-7-title-4'),
        description: r('block-7-content-4'),
      },
      {
        title: r('block-7-title-5'),
        description: r('block-7-content-5'),
      },
      {
        title: r('block-7-title-6'),
        description: r('block-7-content-6'),
      },
      {
        title: r('block-7-title-7'),
        description: r('block-7-content-7'),
      },
    ];
  }, []);
  const [opened, setOpened] = React.useState(false);

  return (
    <div className="rounded-[30px] border border-gray bg-white p-10 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:p-6">
      <div className="flex max-md:items-end">
        <h2 className="heading-4 flex-1 text-center font-bold text-primary">
          {r('block-7-title')}
        </h2>
        <button className="ml-3" onClick={() => setOpened(!opened)}>
          {opened ? <Sub className="w-4" /> : <Plus className="w-4" />}
        </button>
      </div>
      <hr className="my-4 border-gray" />
      {benefits.map((benefit, idx) => {
        return (
          <div key={idx} className="mt-3 text-lg">
            <div className="flex">
              <div className="mt-1.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-primary text-sm font-bold leading-none text-white">
                {idx + 1}
              </div>
              <h3 className="body-1 ml-2 text-primary">{benefit.title}</h3>
            </div>
            {opened && <p className="body-1 ml-8 mt-1">{benefit.description}</p>}
          </div>
        );
      })}
      <div className="mt-6 text-center">
        <Button href="/why-fresh">{t('learn-more')}</Button>
      </div>
    </div>
  );
}
