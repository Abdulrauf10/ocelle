'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';
import CloseCircle from '../icons/CloseCircle';
import Image from 'next/image';
import clsx from 'clsx';
import React from 'react';
import { arrayToSentence } from '@/helpers/translation';

export default function RecipeMediumDialog({
  name,
  description,
  picture,
  ingredients,
  targetedNutrientBlendIngredients,
  calorie,
  analysis,
  children,
}: React.PropsWithChildren<{
  name: string;
  description: React.ReactNode;
  picture: string;
  ingredients: string[];
  targetedNutrientBlendIngredients: string[];
  calorie: number;
  analysis: {
    protein: number;
    fat: number;
    fibre: number;
    moisture: number;
  };
}>) {
  const t = useTranslations();
  const [tab, setTab] = React.useState<'Ingredients' | 'Nutrition'>('Ingredients');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-3">
        <div className="relative flex max-w-[1016px] items-start rounded-3xl border-2 border-primary bg-white px-5 py-4 text-left max-md:flex-wrap max-md:pt-9">
          <div className="w-[400px] min-w-[400px] max-lg:min-w-[320px] max-xs:w-full max-xs:min-w-full">
            <div className="relative overflow-hidden rounded-2xl pt-[100%]">
              <Image src={picture} alt={name} fill />
            </div>
          </div>
          <div className="ml-6 py-1 max-md:mx-3 max-md:mt-4">
            <h2 className="text-xl font-bold text-primary max-lg:text-lg">{name}</h2>
            <p className="mt-2 leading-tight">{description}</p>
            <hr className="my-3 border-[#7B8D97]" />
            <div className="-mx-4 flex">
              <button
                className={clsx(
                  'mx-4 text-lg',
                  tab === 'Ingredients'
                    ? 'text-primary underline'
                    : 'text-[#7B8D97] hover:underline'
                )}
                type="button"
                onClick={() => setTab('Ingredients')}
              >
                {t('ingredients')}
              </button>
              <button
                className={clsx(
                  'mx-4 text-lg',
                  tab === 'Nutrition' ? 'text-primary underline' : 'text-[#7B8D97] hover:underline'
                )}
                type="button"
                onClick={() => setTab('Nutrition')}
              >
                {t('nutrition')}
              </button>
            </div>
            {tab === 'Ingredients' && (
              <>
                <p className="mt-3 leading-tight">
                  <strong>{t('{}-colon', { value: t('ingredients') })}</strong>
                  <br />
                  {arrayToSentence(t, ingredients)}
                </p>
                <p className="mt-3 leading-tight">
                  <strong>{t('{}-colon', { value: t('ocelle-targeted-nutrient-blend') })}</strong>
                  <br />
                  {arrayToSentence(t, targetedNutrientBlendIngredients)}
                </p>
              </>
            )}
            {tab === 'Nutrition' && (
              <>
                <div className="mt-2 flex flex-wrap justify-between">
                  <strong className="uppercase">
                    {t('{}-colon', { value: t('calorie-content') })}
                  </strong>
                  <span>{t('{}-kcal-per-kg', { value: calorie })}</span>
                </div>
                <div className="mt-1">
                  <strong className="uppercase">
                    {t('{}-colon', { value: t('guarenteed-analysis') })}
                  </strong>
                  <div className="mt-2 flex flex-wrap justify-between">
                    <span>{t('crude-protein')}</span>
                    <span>{t('{}-pct-min', { value: analysis.protein })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('crude-fat')}</span>
                    <span>{t('{}-pct-min', { value: analysis.fat })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('crude-firbe')}</span>
                    <span>{t('{}-pct-max', { value: analysis.fibre })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('moisture')}</span>
                    <span>{t('{}-pct-max', { value: analysis.moisture })}</span>
                  </div>
                  <p className="mt-3 leading-tight">
                    {t('our-{}-for-dogs-is-formulated-to-meet-the-nutritional-levels', { name })}
                  </p>
                </div>
              </>
            )}
            <DialogClose className="absolute right-4 top-3 cursor-pointer">
              <CloseCircle className="h-5 w-5" />
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
