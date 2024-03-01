'use client';

import Button from '@/components/Button';
import React, { useTransition } from 'react';
import Headings from '@/components/Headings';
import { useTranslations } from 'next-intl';
import { serialize } from 'object-to-formdata';

export default function OrderSizeForm({
  initialSize,
  action,
}: {
  initialSize: 7 | 14;
  action(formData: FormData): Promise<void>;
}) {
  const t = useTranslations();
  const [pending, startTransition] = useTransition();
  const [size, setSize] = React.useState<7 | 14>(initialSize);

  const isSameAsDefaultValue = size === initialSize;

  return (
    <>
      <div className="mt-6">
        <div className="-mx-4 -my-3 flex flex-wrap justify-center">
          <div className="px-4 py-3">
            <div
              className="relative mt-3 flex w-[270px] items-center rounded-3xl border border-gray bg-white px-8 py-8 shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              onClick={() => setSize(7)}
            >
              <div className="flex-1 px-2">
                <Headings tag="h2" styles="h2" className="text-primary">
                  {t('{}-days', { value: 7 })}
                </Headings>
                <p className="mt-1">$[15]{t('per-day')}</p>
              </div>
              <div className="px-2">
                {size === 7 ? (
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
              onClick={() => setSize(14)}
            >
              <div className="flex-1 px-2">
                <Headings tag="h2" styles="h2" className="text-primary">
                  {t('{}-days', { value: 14 })}
                </Headings>
                <p className="mt-1">$[13]{t('per-day')}</p>
              </div>
              <div className="px-2">
                {size === 14 ? (
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
          strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
        })}{' '}
        It contains [Charlie]&apos;s and [Muffin]’s fresh food.
      </p>
      <p className="mx-auto mt-4 max-w-[620px] text-center">
        {t.rich('unfortunately-you-can-no-longer-make-changes-to-your-upcoming-box', {
          date: '[29th of December 2023]',
          strong: (chunks) => <strong className="whitespace-nowrap">{chunks}</strong>,
        })}
      </p>
      <div className="mx-auto mt-8 max-w-[480px]">
        <div className="-mx-2 flex">
          <div className="w-1/2 px-2">
            <Button fullWidth onClick={() => {}} reverse disabled={isSameAsDefaultValue}>
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button
              fullWidth
              disabled={pending || isSameAsDefaultValue}
              onClick={() => {
                startTransition(() => {
                  action(serialize({ size }));
                });
              }}
            >
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
