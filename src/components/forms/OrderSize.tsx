'use client';

import Button from '@/components/buttons/Button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { OrderSize } from '@/enums';
import { nativeRound } from '@/helpers/number';
import useDefaultValues from '@/hooks/defaultValues';

export default function OrderSizeForm({
  initialSize,
  oneWeekPrice,
  twoWeekPrice,
  action,
}: {
  initialSize: OrderSize;
  oneWeekPrice: number;
  twoWeekPrice: number;
  action(data: { size: OrderSize }): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({ size: initialSize });
  const [pending, startTransition] = React.useTransition();
  const [size, setSize] = React.useState<OrderSize>(defaultValues.size);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      await action({ size });
      setDefaultValues({ size });
    });
  }, [action, setDefaultValues, size]);

  const isSameAsDefaultValue = size === defaultValues.size;

  return (
    <>
      <div className="mt-6">
        <div className="-mx-4 -my-3 flex flex-wrap justify-center">
          <div className="px-4 py-3">
            <div
              className="relative mt-3 flex w-[270px] items-center rounded-3xl border border-gray bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              onClick={() => setSize(OrderSize.OneWeek)}
            >
              <div className="flex-1 px-2">
                <h2 className="heading-4 font-bold text-primary">{t('{}-days', { value: 7 })}</h2>
                <p className="mt-1">${t('{}-per-day', { value: nativeRound(oneWeekPrice) })}</p>
              </div>
              <div className="px-2">
                {size === OrderSize.OneWeek ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary">
                    <div className="h-6 w-6 rounded-full bg-secondary"></div>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border border-gray"></div>
                )}
              </div>
              <div className="absolute top-0 -translate-y-1/2 rounded-2xl border border-white bg-[#7B8D97] px-6 py-0.5 text-white">
                {t('save-space')}
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div
              className="relative mt-3 flex w-[270px] items-center rounded-3xl border border-gray bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              onClick={() => setSize(OrderSize.TwoWeek)}
            >
              <div className="flex-1 px-2">
                <h2 className="heading-4 font-bold text-primary">{t('{}-days', { value: 14 })}</h2>
                <p className="mt-1">${t('{}-per-day', { value: nativeRound(twoWeekPrice) })}</p>
              </div>
              <div className="px-2">
                {size === OrderSize.TwoWeek ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary">
                    <div className="h-6 w-6 rounded-full bg-secondary"></div>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border border-gray"></div>
                )}
              </div>
              <div className="absolute top-0 -translate-y-1/2 rounded-2xl border border-white bg-secondary px-6 py-0.5 text-white">
                {t('best-value')}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[620px] text-center">
        {t.rich('your-upcoming-box-is-arriving-on-the-{}', {
          date: '[15th of December 2023]',
        })}{' '}
        It contains [Charlie]&apos;s and [Muffin]’s fresh food.
      </p>
      <p className="mx-auto mt-4 max-w-[620px] text-center">
        {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
          date: '[29th of December 2023]',
        })}
      </p>
      <div className="mx-auto mt-8 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => setSize(defaultValues.size)}
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
