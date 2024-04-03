import React from 'react';
import Image from 'next/image';
import type { FieldValues } from 'react-hook-form';
import clsx from 'clsx';
import RoundedCheckbox from './RoundedCheckbox';
import { useTranslations } from 'next-intl';
import { InputControllerProps } from '@/types';
import RecipeMediumDialog from '../dialogs/RecipeMedium';

interface RecipeCheckboxProps<T extends FieldValues> extends InputControllerProps<T> {
  title: string;
  description: string;
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
  disabled?: boolean;
  recommended?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function RecipeCheckbox<T extends FieldValues>({
  picture,
  title,
  name,
  control,
  rules,
  error,
  recommended,
  disabled,
  description,
  ingredients,
  targetedNutrientBlendIngredients,
  calorie,
  analysis,
  onChange,
}: RecipeCheckboxProps<T>) {
  const t = useTranslations();

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
              'body-4 absolute -left-1/2 inline-block select-none rounded-3xl border border-white bg-secondary px-3 py-px text-center uppercase italic text-white'
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
          rules={rules}
          error={error}
          label={title}
          className="font-bold text-gold"
          disabled={disabled}
          onChange={onChange}
        />
        <div className={clsx('mt-0.5 text-[#7B8D97]', disabled && 'text-opacity-50')}>$$</div>
        <div className="mt-0.5">
          <RecipeMediumDialog
            name={title}
            description={description}
            picture="/meal-plan/chicken-recipe.jpg"
            ingredients={ingredients}
            targetedNutrientBlendIngredients={targetedNutrientBlendIngredients}
            calorie={calorie}
            analysis={analysis}
          >
            <button type="button" className="font-light underline">
              {t('see-details')}
            </button>
          </RecipeMediumDialog>
        </div>
      </div>
    </div>
  );
}
