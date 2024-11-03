import { getTranslations } from 'next-intl/server';
import React from 'react';

import getCoupons from './actions';

import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import UnderlineBackButton from '@/components/buttons/UnderlineBackButton';

export default async function Coupon() {
  const t = await getTranslations();
  const coupons = await getCoupons();

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container>
          <div className="mx-auto max-w-[680px]">
            <h1 className="heading-4 text-center font-bold text-primary">{t('coupons')}</h1>
            <div className="mt-6"></div>
            <div className="mx-auto max-w-[680px] overflow-hidden rounded-3xl border border-gray">
              <div className="bg-gray px-8 py-4 font-bold text-white">{t('available-coupons')}</div>
              <div className="bg-white">
                <div className="flex flex-row items-center px-8 py-4">
                  <div className="flex-1">
                    [Dog Birthday ‘23: 30% Off Your Next Order] [(#2910899)]
                    <br />
                    [Expires] on [31st of December 2024]
                  </div>
                  <div>[30%]</div>
                </div>
                <hr className="border-gray" />
                <div className="flex flex-row items-center px-8 py-4">
                  <div className="flex-1">
                    [Refer A Friend: $50 Off Your Next Order] [(#1909839)]
                    <br />
                    [Expires] on [18th of December 2024]
                  </div>
                  <div>[$50]</div>
                </div>
              </div>
            </div>
            <div className="mt-10"></div>
            <div className="mx-auto max-w-[680px] overflow-hidden rounded-3xl border border-gray">
              <div className="bg-gray px-8 py-4 font-bold text-white">{t('inactive-coupons')}</div>
              <div className="bg-white">
                <div className="flex flex-row items-center px-8 py-4">
                  <div className="flex-1">
                    [Refer A Friend: $50 Off Your Next Order] [(#1909810)]
                    <br />
                    [Used] on [18th of January 2024] [for order ID#] [310]
                  </div>
                  <div>[30%]</div>
                </div>
                <hr className="border-gray" />
                <div className="flex flex-row items-center px-8 py-4">
                  <div className="flex-1">
                    [Fresh New Year: $50 Off Your Next Order] [(#200)]
                    <br />
                    [Expired] on [1st of January 2024]
                  </div>
                  <div>[$50]</div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <UnderlineBackButton label={t('go-back')} />
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
