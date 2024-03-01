import Container from '@/components/Container';
import EditButton from '@/components/EditButton';
import Image from 'next/image';
import Button from '@/components/Button';
import Headings from '@/components/Headings';
import SectionBlock from './SectionBlock';
import SectionHr from './SectionHr';
import CollapseBlock from './CollapseBlock';
import { getStoreMe } from '@/storeUserProvider';
import { executeQuery } from '@/helpers/queryRunner';
import { Dog, SaleorUser } from '@/entities';
import { getTranslations } from 'next-intl/server';
import { MealPlan, OrderSize, Recipe } from '@/enums';
import React from 'react';

function SectionTitle({ children }: React.PropsWithChildren) {
  return <strong className="text-lg text-gold">{children}</strong>;
}

async function getData() {
  const me = await getStoreMe();

  return executeQuery(async (queryRunner) => {
    const user = await queryRunner.manager.findOne(SaleorUser, {
      where: {
        saleorId: me.id,
      },
    });
    const dogs = await queryRunner.manager.find(Dog, {
      where: {
        user: { saleorId: me.id },
      },
      relations: {
        plan: true,
        breeds: {
          breed: true,
        },
      },
    });
    return { me, dogs, user };
  });
}

export default async function Reactivate() {
  const t = await getTranslations();
  const { me, user, dogs } = await getData();

  return (
    <main className="bg-gold bg-opacity-10 py-10">
      <Container>
        <Headings tag="h1" styles="h2" className="text-center text-primary">
          {t('welcome-back-to-the-ocelle-pack')}
        </Headings>
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
                  <p>
                    [Muffin] is, [7 years and 7 months old, 8 kg, mellow, is spayed, and has no
                    allergies / food sensitivities]
                  </p>
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
                  <SectionTitle>{t('fresh-{}', { value: t('recipes') })}</SectionTitle>
                  <p>
                    {t('fresh-{}', { value: t(Recipe[dog.plan.recipe1].toLowerCase()) })}
                    {dog.plan.recipe2 && (
                      <>
                        {t('comma')}
                        {t('fresh-{}', { value: t(Recipe[dog.plan.recipe2].toLowerCase()) })}
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
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
          <SectionHr />
          <SectionTitle>{t('billing')}</SectionTitle>
          <p>[20/F, Golden Star Building, 20-24 Lockhart Road, Wanchai, Hong Kong]</p>
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
              value: t('{}-weeks', { value: user?.orderSize === OrderSize.OneWeek ? 1 : 2 }),
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
                          {t('{}-colon', { value: t('recipes') })}
                        </div>
                        <div className="flex-1 text-right">
                          {t('fresh-{}', { value: t(Recipe[dog.plan.recipe1].toLowerCase()) })}
                          {dog.plan.recipe2 && (
                            <>
                              {t('comma')}
                              {t('fresh-{}', { value: t(Recipe[dog.plan.recipe2].toLowerCase()) })}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="my-2 flex items-center">
                        <div className="min-w-[150px] text-xl font-bold capitalize text-brown">
                          {t('{}-colon', { value: t('days-of-food') })}
                        </div>
                        <div className="flex-1 text-right">
                          {t('{}-days', { value: user?.orderSize === OrderSize.OneWeek ? 7 : 14 })}
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
