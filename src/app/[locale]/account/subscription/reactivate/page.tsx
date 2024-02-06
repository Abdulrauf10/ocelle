'use client';

import { useRouter } from '@/navigation';
import clsx from 'clsx';
import Container from '@/components/Container';
import EditButton from '@/components/EditButton';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';
import Image from 'next/image';
import Button from '@/components/Button';
import Headings from '@/components/Headings';
import { useTranslations } from 'next-intl';

interface BlockProps {
  className?: string;
}

function Block({ className, children }: React.PropsWithChildren<BlockProps>) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-[720px] rounded-2xl border border-gray bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)]',
        className
      )}
    >
      {children}
    </div>
  );
}

function Hr() {
  return <hr className="my-4 border-gray" />;
}

function SectionTitle({ children }: React.PropsWithChildren) {
  return <strong className="text-lg text-gold">{children}</strong>;
}

export default function Reactivate() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <Headings tag="h1" styles="h2" className="text-center text-primary">
          {t('welcome-back-to-the-ocelle-pack')}
        </Headings>
        <p className="mt-6 text-center">{t('please-review-your-details-below')}</p>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">
                {t('{}-information-plan-details', { name: 'Muffin' })}
              </div>
            </div>
            <button className="px-2">
              <Sub className="h-4 w-4" />
            </button>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>{t('dogs-information')}</SectionTitle>
              <p>
                [Muffin] is, [7 years and 7 months old, 8 kg, mellow, is spayed, and has no
                allergies / food sensitivities]
              </p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => router.push('/account/dog/1')} />
            </div>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>{t('meal-plan')}</SectionTitle>
              <p>Fresh [Full] Plan</p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => router.push('/account/plan/meal')} />
            </div>
          </div>
          <Hr />
          <div className="-mx-2 flex items-center">
            <div className="flex-1 px-2">
              <SectionTitle>{t('fresh-{}', { value: t('recipes') })}</SectionTitle>
              <p>[Fresh Beef]</p>
            </div>
            <div className="px-2">
              <EditButton onClick={() => () => router.push('/account/plan/recipe')} />
            </div>
          </div>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('address')}</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/address')} />
          </div>
          <Hr />
          <SectionTitle>{t('delivery')}</SectionTitle>
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
          <Hr />
          <SectionTitle>{t('billing')}</SectionTitle>
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('payment-info')}</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/payment')} />
          </div>
          <Hr />
          <div className="flex items-center">
            [
            <Image
              src="/payments/mc.svg"
              alt="Master Card Icon"
              className="inline-block"
              width={46}
              height={30}
            />
            &nbsp;
            <span className="relative top-0.5">**** **** ****</span>&nbsp;1234]
          </div>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">[{t('delivery-frequency')}]</div>
            </div>
            <EditButton className="px-2" onClick={() => router.push('/account/plan/often')} />
          </div>
          <Hr />
          <p>[{t('every-{}', { value: t('{}-weeks', { value: 2 }) })}]</p>
        </Block>
        <Block className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('delivery-date')}</div>
            </div>
            <EditButton
              className="px-2"
              onClick={() => router.push('/account/plan/delivery-date')}
            />
          </div>
          <Hr />
          <p>
            <SectionTitle>{t('{}-colon', { value: t('scheduled') })}</SectionTitle> [15th of
            December 2024]
          </p>
          <p>
            {t('after-reactivating-you-can-adjust-your-delivery-date-until-the-{}', {
              date: '10th of December 2024',
            })}
          </p>
        </Block>
        <Block className="mt-8">
          <div className="text-2xl font-bold text-primary">
            {t('{}-fresh-food-box', { name: 'Muffin' })}
          </div>
          <div className="mt-5">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <Image src="/reactivate-box.svg" alt="Reactivate box" width={180} height={180} />
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('meal-plan') })}
                  </div>
                  <div className="flex-1 text-right">Fresh [Full] Plan</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('recipes') })}
                  </div>
                  <div className="flex-1 text-right">[Fresh Beef]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold capitalize text-brown">
                    {t('{}-colon', { value: t('days-of-food') })}
                  </div>
                  <div className="flex-1 text-right">[14] Days</div>
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <div className="text-2xl font-bold text-primary">
            {t('{}-fresh-food-box', { name: 'Charlie' })}
          </div>
          <div className="mt-5">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <Image src="/reactivate-box.svg" alt="Reactivate box" width={180} height={180} />
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('meal-plan') })}
                  </div>
                  <div className="flex-1 text-right">Fresh [Half] Plan</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('recipes') })}
                  </div>
                  <div className="flex-1 text-right">[Fresh Beef, Fresh Chicken]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold capitalize text-brown">
                    {t('{}-colon', { value: t('days-of-food') })}
                  </div>
                  <div className="flex-1 text-right">[14] Days</div>
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <div className="">
            <div className="-m-3 flex items-center max-sm:flex-col">
              <div className="p-3">
                <div className="w-[180px]"></div>
              </div>
              <div className="w-full flex-1 p-3">
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('delivery') })}
                  </div>
                  <div className="flex-1 text-right">[{t('free')}]</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('promo-code') })}
                  </div>
                  <div className="flex-1 text-right">－</div>
                </div>
                <div className="my-2 flex items-center">
                  <div className="min-w-[150px] text-xl font-bold text-brown">
                    {t('{}-colon', { value: t('todays-total') })}
                  </div>
                  <div className="flex-1 text-right">$[250]</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto my-6 max-w-[320px]">
            <Button fullWidth>{t('reactivate-plan')}</Button>
          </div>
        </Block>
      </Container>
    </main>
  );
}
