'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import TextField from '../controls/TextField';
import CircleTick from '../icons/CircleTick';

interface ICouponForm {
  coupon: string;
}

interface CouponFormProps {
  action(data: ICouponForm): Promise<void>;
  onStatusChange?(status: 'applying' | 'applied' | 'failed', value?: string): void;
}

export default function CouponForm({ action }: CouponFormProps) {
  const t = useTranslations();
  const b = useTranslations('Button');
  const [pending, startTransition] = React.useTransition();
  const { control, handleSubmit } = useForm<ICouponForm>({ defaultValues: { coupon: '' } });
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
    <>
      <div className="-mx-1 mt-3 flex flex-wrap justify-between">
        <div className="flex-1 px-1">
          <TextField
            name="coupon"
            control={control}
            rules={{ required: true }}
            inputProps={{ className: '!bg-white' }}
            fullWidth
          />
        </div>
        <div className="px-1">
          <button
            type="button"
            disabled={pending}
            className="rounded-lg bg-secondary px-6 py-[9.5px] transition-all duration-300 ease-in-out mouse:hover:opacity-85"
            onClick={() => handleSubmit(onSubmit)()}
          >
            <span className="font-open-sans font-bold text-white">{b('apply')}</span>
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
    </>
  );
}
