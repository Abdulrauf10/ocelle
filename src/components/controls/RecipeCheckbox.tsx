import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import type { FieldValues } from 'react-hook-form';

import RecipeMediumDialog from '../dialogs/RecipeMedium';
import RoundedCheckbox from './RoundedCheckbox';

import { InputControllerProps } from '@/types';

interface RecipeCheckboxProps<T extends FieldValues> extends InputControllerProps<T> {
  title: string;
  description: string;
  picture: string;
  dialogPicture: React.ReactNode;
  price: 'cheap' | 'normal' | 'expensive';
  ingredients: string[];
  targetedNutrientBlendIngredients: string[];
  calorie: number;
  analysis: {
    protein: number;
    fat: number;
    fibre: number;
    moisture: number;
  };
  disabled?: boolean;
  readonly?: boolean;
  recommended?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function RecipeCheckbox<T extends FieldValues>({
  picture,
  dialogPicture,
  title,
  name,
  rules,
  error,
  recommended,
  disabled,
  readonly,
  description,
  price,
  ingredients,
  targetedNutrientBlendIngredients,
  calorie,
  analysis,
  onChange,
}: RecipeCheckboxProps<T>) {
  const t = useTranslations();
  const b = useTranslations('Button');
  return (
    <div className="relative mx-auto mt-[70px] w-[220px] max-w-[230px] max-lg:w-[210px] max-md:w-full">
      <div
        className={clsx(
          'rounded-[20px] border p-[10px] shadow-black/20 drop-shadow-style-1',
          disabled
            ? 'pointer-events-none select-none border-[#7B8D97] bg-[#F2F4F5]'
            : 'border-gold bg-white'
        )}
      >
        <div className="h-[70px]"></div>
        <div className={clsx('mt-2 text-center', disabled ? 'text-[#BDC6CB]' : 'text-gold')}>
          <RoundedCheckbox
            name={name}
            rules={rules}
            error={error}
            label={title}
            className="font-bold text-gold"
            disabled={disabled}
            onChange={onChange}
            readonly={readonly}
          />
          <div className={clsx('mt-0.5 text-[#7B8D97]', disabled && 'text-opacity-50')}>
            {price === 'cheap' ? '$$' : price === 'expensive' ? '$$$$' : '$$$'}
          </div>
          <div className="mt-0.5">
            <RecipeMediumDialog
              name={title}
              description={description}
              picture={dialogPicture}
              ingredients={ingredients}
              targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
              calorie={calorie}
              analysis={analysis}
            >
              <button type="button" className="font-light underline">
                {b('see-details')}
              </button>
            </RecipeMediumDialog>
          </div>
        </div>
      </div>
      <div className="absolute -top-[70px] left-1/2 -translate-x-1/2">
        {recommended && (
          <div
            className={clsx(
              'absolute left-0 z-10 inline-block -translate-x-1/2 select-none rounded-3xl border border-white bg-secondary px-3 py-[3px]'
            )}
          >
            <p className="body-4 text-center uppercase italic text-white">{t('recommended')}</p>
          </div>
        )}
        <Image
          src={picture}
          alt={title}
          width={140}
          height={140}
          className="min-w-[140px] rounded-2xl shadow-black/20 drop-shadow-style-5"
        />
      </div>
    </div>
  );
}
