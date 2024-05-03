import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';

import CollapseBlock from './CollapseBlock';
import SectionBlock from './SectionBlock';
import SectionHr from './SectionHr';

import { getLoginedMeFullSize } from '@/actions';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import { MealPlan, OrderSize } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';
import getSentence from '@/servers/getSentence';

function SectionTitle({ children }: React.PropsWithChildren) {
  return <strong className="text-lg text-gold">{children}</strong>;
}

export default async function Reactivate() {
  const t = await getTranslations();
  const sentence = await getSentence();
  const n = await getTranslations('Navigator');
  const { orderSize, dogs, defaultShippingAddress, defaultBillingAddress } =
    await getLoginedMeFullSize();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <h1 className="heading-4 text-center font-bold text-primary">
          {t('welcome-back-to-the-ocelle-pack')}
        </h1>
        <p className="mt-6 text-center">{t('please-review-your-details-below')}</p>
        {dogs.map((dog) => {
          return (
            <CollapseBlock
              key={dog.id}
              className="mt-8"
              title={
                <div className="text-2xl font-bold text-primary">
                  {t('{}-information-plan-details', { name: dog.name })}
                </div>
              }
            >
              <div className="-mx-2 flex items-center">
                <div className="flex-1 px-2">
                  <SectionTitle>{t('dogs-information')}</SectionTitle>
                  <p>{t('{}-is-{}', { name: dog.name, value: sentence.dog(dog) })}</p>
                </div>
                <div className="px-2">
                  <EditButton href={`/account/dog/${dog.id}`} />
                </div>
              </div>
              <SectionHr />
              <div className="-mx-2 flex items-center">
                <div className="flex-1 px-2">
                  <SectionTitle>{t('meal-plan')}</SectionTitle>
                  <p>
                    {t(dog.plan.mealPlan === MealPlan.Full ? 'fresh-full-plan' : 'fresh-half-plan')}
                  </p>
                </div>
                <div className="px-2">
                  <EditButton href={`/account/plan/meal?current=${dog.id}`} />
                </div>
              </div>
              <SectionHr />
              <div className="-mx-2 flex items-center">
                <div className="flex-1 px-2">
                  <SectionTitle>{t('fresh-{}', { value: n('recipes') })}</SectionTitle>
                  <p>
                    {t('fresh-{}', { value: t(getRecipeSlug(dog.plan.recipe1)) })}
                    {dog.plan.recipe2 && (
                      <>
                        {t('comma')}
                        {t('fresh-{}', { value: t(getRecipeSlug(dog.plan.recipe2)) })}
                      </>
                    )}
                  </p>
                </div>
                <div className="px-2">
                  <EditButton href={`/account/plan/recipe?current=${dog.id}`} />
                </div>
              </div>
            </CollapseBlock>
          );
        })}

        <SectionBlock className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('address')}</div>
            </div>
            <EditButton className="px-2" href="/account/address" />
          </div>
          <SectionHr />
          <SectionTitle>{t('delivery')}</SectionTitle>
          <p>{sentence.address(defaultShippingAddress!)}</p>
          <SectionHr />
          <SectionTitle>{t('billing')}</SectionTitle>
          <p>{sentence.address(defaultBillingAddress!)}</p>
        </SectionBlock>
        <SectionBlock className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('payment-info')}</div>
            </div>
            <EditButton className="px-2" href="/account/payment" />
          </div>
          <SectionHr />
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
        </SectionBlock>
        <SectionBlock className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">[{t('delivery-frequency')}]</div>
            </div>
            <EditButton className="px-2" href="/account/plan/often" />
          </div>
          <SectionHr />
          <p>
            {t('every-{}', {
              value: t('{}-weeks', { value: orderSize === OrderSize.OneWeek ? 1 : 2 }),
            })}
          </p>
        </SectionBlock>
        <SectionBlock className="mt-8">
          <div className="item-center -mx-2 flex">
            <div className="flex-1 px-2">
              <div className="text-2xl font-bold text-primary">{t('delivery-date')}</div>
            </div>
            <EditButton className="px-2" href="/account/plan/delivery-date" />
          </div>
          <SectionHr />
          <p>
            <SectionTitle>{t('{}-colon', { value: t('scheduled') })}</SectionTitle> [15th of
            December 2024]
          </p>
          <p>
            {t('after-reactivating-you-can-adjust-your-delivery-date-until-the-{}', {
              date: '10th of December 2024',
            })}
          </p>
        </SectionBlock>
        <SectionBlock className="mt-8">
          {dogs.map((dog) => {
            return (
              <React.Fragment key={dog.id}>
                <div className="text-2xl font-bold text-primary">
                  {t('{}-fresh-food-box', { name: dog.name })}
                </div>
                <div className="mt-5">
                  <div className="-m-3 flex items-center max-sm:flex-col">
                    <div className="p-3">
                      <Image
                        src="/reactivate-box.svg"
                        alt="Reactivate box"
                        width={180}
                        height={180}
                      />
                    </div>
                    <div className="w-full flex-1 p-3">
                      <div className="my-2 flex items-center">
                        <div className="min-w-[150px] text-xl font-bold text-brown">
                          {t('{}-colon', { value: t('meal-plan') })}
                        </div>
                        <div className="flex-1 text-right">
                          {t(
                            dog.plan.mealPlan === MealPlan.Full
                              ? 'fresh-full-plan'
                              : 'fresh-half-plan'
                          )}
                        </div>
                      </div>
                      <div className="my-2 flex items-center">
                        <div className="min-w-[150px] text-xl font-bold text-brown">
                          {t('{}-colon', { value: n('recipes') })}
                        </div>
                        <div className="flex-1 text-right">
                          {t('fresh-{}', { value: t(getRecipeSlug(dog.plan.recipe1)) })}
                          {dog.plan.recipe2 && (
                            <>
                              {t('comma')}
                              {t('fresh-{}', { value: t(getRecipeSlug(dog.plan.recipe2)) })}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="my-2 flex items-center">
                        <div className="min-w-[150px] text-xl font-bold capitalize text-brown">
                          {t('{}-colon', { value: t('days-of-food') })}
                        </div>
                        <div className="flex-1 text-right">
                          {t('{}-days', { value: orderSize === OrderSize.OneWeek ? 7 : 14 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <SectionHr />
              </React.Fragment>
            );
          })}
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
        </SectionBlock>
      </Container>
    </main>
  );
}
