import React from 'react';
import Image from 'next/image';
import { type Control, type FieldValues, type RegisterOptions } from 'react-hook-form';
import clsx from 'clsx';
import Close from '../icons/Close';
import RoundedCheckbox from './RoundedCheckbox';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';
import { useTranslations } from 'next-intl';

interface RecipeCheckboxProps {
  title: string;
  description: string;
  name: string;
  value: string | number;
  picture: string;
  ingredients: string;
  nutrientBlend: string;
  calorie: number;
  protein: number;
  fat: number;
  fibre: number;
  moisture: number;
  disabled?: boolean;
  control: Control<FieldValues, any>;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  recommended?: boolean;
}

function Dotted() {
  return (
    <div className="after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-0 after:inline-block after:align-[3px] after:tracking-[6px] after:text-black after:content-dotted"></div>
  );
}

export default function RecipeCheckbox({
  picture,
  title,
  name,
  value,
  control,
  recommended,
  disabled,
  description,
  ingredients,
  nutrientBlend,
  calorie,
  protein,
  fat,
  fibre,
  moisture,
}: RecipeCheckboxProps) {
  const t = useTranslations();
  const [tab, setTab] = React.useState<'Ingredients' | 'Nutrition'>('Ingredients');

  return (
    <div
      className={clsx(
        'relative mx-auto mt-[70px] min-w-[230px] max-w-[280px] rounded-[20px] border p-[10px] shadow-[3px_3px_10px_rgba(0,0,0,.2)]',
        disabled
          ? 'pointer-events-none select-none border-[#7B8D97] bg-[#F2F4F5]'
          : 'border-gold bg-white'
      )}
    >
      <div className="absolute -top-[70px] left-1/2 -translate-x-1/2">
        {recommended && (
          <div
            className={clsx(
              'absolute -left-1/2 inline-block select-none rounded-3xl border border-white bg-secondary px-3 py-px text-center text-sm uppercase italic text-white'
            )}
          >
            {t('recommended')}
          </div>
        )}
        <Image
          src={picture}
          alt={title}
          width={140}
          height={140}
          className="min-w-[140px] rounded-2xl shadow-[3px_3px_10px_rgba(0,0,0,.2)]"
        />
      </div>
      <div className="h-[70px]"></div>
      <div className={clsx('mt-2 text-center', disabled ? 'text-[#BDC6CB]' : 'text-gold')}>
        <RoundedCheckbox
          name={name}
          control={control}
          label={title}
          value={value}
          className="font-bold text-gold"
          disabled={disabled}
        />
        <div className={clsx('mt-0.5 text-[#7B8D97]', disabled && 'text-opacity-50')}>$$</div>
        <div className="mt-0.5">
          <Dialog>
            <DialogTrigger className="font-light underline" type="button">
              {t('see-details')}
            </DialogTrigger>
            <DialogContent className="max-w-[1040px] p-3">
              <div className="relative flex items-start rounded-3xl border-2 border-primary bg-white px-5 py-4 text-left max-md:flex-wrap max-md:pt-9">
                <div className="w-[400px] min-w-[400px] max-lg:min-w-[320px] max-xs:w-full max-xs:min-w-full">
                  <div className="relative overflow-hidden rounded-2xl pt-[100%]">
                    <Image src="/meal-plan/chicken-recipe.jpg" alt="Chicken Recipe" fill />
                  </div>
                </div>
                <div className="ml-6 py-1 max-md:mx-3 max-md:mt-4">
                  <h2 className="text-xl font-bold text-primary max-lg:text-lg">{title}</h2>
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
                        tab === 'Nutrition'
                          ? 'text-primary underline'
                          : 'text-[#7B8D97] hover:underline'
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
                        <strong>{t('ingredients')}</strong>
                        <br />
                        {ingredients}
                      </p>
                      <p className="mt-3 leading-tight">
                        <strong>Ocelle Targeted Nutrient Blend:</strong>
                        <br />
                        {nutrientBlend}
                      </p>
                    </>
                  )}
                  {tab === 'Nutrition' && (
                    <>
                      <div className="mt-2 flex flex-wrap justify-between">
                        <strong className="uppercase">{t('calorie-content')}:</strong>
                        <span>{t('kcal-per-kg', { value: calorie })}</span>
                      </div>
                      <div className="mt-1">
                        <strong>{t('guarenteed-analysis')}:</strong>
                        <div className="mt-2 flex flex-wrap justify-between">
                          <span>{t('crude-protein')}</span>
                          <span>{t('pct-min', { value: protein })}</span>
                        </div>
                        <div className="my-1">
                          <Dotted />
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span>{t('crude-fat')}</span>
                          <span>{t('pct-min', { value: fat })}</span>
                        </div>
                        <div className="my-1">
                          <Dotted />
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span>{t('crude-firbe')}</span>
                          <span>{t('pct-max', { value: fibre })}</span>
                        </div>
                        <div className="my-1">
                          <Dotted />
                        </div>
                        <div className="flex flex-wrap justify-between">
                          <span>{t('moisture')}</span>
                          <span>{t('pct-max', { value: moisture })}</span>
                        </div>
                        <p className="mt-3 leading-tight">
                          Our {title} for Dogs is formulated to meet the nutritional levels
                          established by the AAFCO Dog Food Nutrient Profiles for all life stages,
                          including growth of large sized dogs (70 lbs. or more as an adult).
                        </p>
                      </div>
                    </>
                  )}
                  <DialogClose className="absolute right-4 top-3 cursor-pointer">
                    <Close className="h-5 w-5" />
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
