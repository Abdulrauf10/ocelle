'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import TextField from '../controls/TextField';
import CircleTick from '../icons/CircleTick';

interface ICouponForm {
  coupon: string;
}

interface CouponFormProps {
  disabled?: boolean;
  action(data: ICouponForm): Promise<void>;
}

export default function CouponForm({ disabled, action }: CouponFormProps) {
  const t = useTranslations();
  const b = useTranslations('Button');
  const [pending, startTransition] = React.useTransition();
  const form = useForm<ICouponForm>({ defaultValues: { coupon: '' } });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const [applied, setApplied] = React.useState(false);

  const onSubmit = React.useCallback(
    (values: ICouponForm) => {
      startTransition(async () => {
        try {
          await action(values);
          setApplied(true);
        } catch (e) {
          console.error(e);
        }
      });
    },
    [action]
  );

  return (
    <FormProvider {...form}>
      <div className="-mx-1 mt-3 flex flex-wrap justify-between">
        <div className="flex-1 px-1">
          <TextField
            name="coupon"
            rules={{ required: true }}
            inputProps={{ className: '!bg-white' }}
            fullWidth
            disabled={disabled}
          />
        </div>
        <div className="px-1">
          <button
            type="button"
            disabled={!isValid || pending || disabled}
            className="rounded-lg bg-secondary px-6 py-[9.5px] transition-all duration-300 ease-in-out disabled:bg-gray disabled:bg-opacity-50 disabled:hover:opacity-100 mouse:hover:opacity-85"
            onClick={() => handleSubmit(onSubmit)()}
          >
            <span className="font-open-sans font-bold text-white">{b('apply-coupon')}</span>
          </button>
        </div>
      </div>
      {applied && (
        <div className="mt-3 flex items-center">
          <div className="h-7 w-7 rounded-full bg-secondary p-1">
            <CircleTick />
          </div>
          <p className="ml-2 text-sm">{t('your-promo-code-was-successfully-applied')}</p>
        </div>
      )}
    </FormProvider>
  );
}
