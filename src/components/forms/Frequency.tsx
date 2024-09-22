'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'react-toastify';
import roundTo from 'round-to';

import Button from '@/components/buttons/Button';
import { Frequency } from '@/enums';
import useDefaultValues from '@/hooks/defaultValues';

export default function FrequencyForm({
  initialFrequency,
  oneWeekPrice,
  twoWeekPrice,
  endAdornment,
  action,
}: {
  initialFrequency: Frequency;
  oneWeekPrice: number;
  twoWeekPrice: number;
  endAdornment?: React.ReactNode;
  action(data: { frequency: Frequency }): Promise<void>;
}) {
  const t = useTranslations();
  const { defaultValues, setDefaultValues } = useDefaultValues({ frequency: initialFrequency });
  const [pending, startTransition] = React.useTransition();
  const [frequency, setFrequency] = React.useState<Frequency>(defaultValues.frequency);

  const onSubmit = React.useCallback(() => {
    startTransition(async () => {
      await action({ frequency });
      setDefaultValues({ frequency });
      toast.success('Your desired delivery frequency has been successfully updated.');
    });
  }, [action, setDefaultValues, frequency]);

  const isSameAsDefaultValue = frequency === defaultValues.frequency;

  return (
    <>
      <div className="mt-6">
        <div className="-mx-4 -my-3 flex flex-wrap justify-center">
          <div className="px-4 py-3">
            <div
              className="relative mt-3 flex w-[270px] items-center rounded-3xl border border-gray bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              onClick={() => setFrequency(Frequency.OneWeek)}
            >
              <div className="flex-1 px-2">
                <h2 className="heading-4 font-bold text-primary">{t('{}-days', { value: 7 })}</h2>
                <p className="mt-1">${t('{}-per-day', { value: roundTo(oneWeekPrice, 1) })}</p>
              </div>
              <div className="px-2">
                {frequency === Frequency.OneWeek ? (
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
              onClick={() => setFrequency(Frequency.TwoWeek)}
            >
              <div className="flex-1 px-2">
                <h2 className="heading-4 font-bold text-primary">{t('{}-days', { value: 14 })}</h2>
                <p className="mt-1">${t('{}-per-day', { value: roundTo(twoWeekPrice, 1) })}</p>
              </div>
              <div className="px-2">
                {frequency === Frequency.TwoWeek ? (
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
      {endAdornment && <div className="mt-8">{endAdornment}</div>}
      <div className="mx-auto mt-8 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              onClick={() => setFrequency(defaultValues.frequency)}
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
