import React from 'react';
import clsx from 'clsx';
import Container from '@/components/Container';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';
import Image from 'next/image';
import DogSwitch from '../DogSwitch';
import Headings from '@/components/Headings';
import { Dog, SaleorUser } from '@/entities';
import AppThemeProvider from '@/components/AppThemeProvider';
import { getTranslations } from 'next-intl/server';
import { MealPlan, OrderSize } from '@/enums';
import { getStoreMe } from '@/storeUserProvider';
import { executeQuery } from '@/helpers/queryRunner';

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
      },
    });
    return { dogs, user, me };
  });
}

export default async function Plan({ searchParams }: { searchParams: { current?: string } }) {
  const t = await getTranslations();
  const mbBoxClassName = clsx(
    'max-md:border-brown max-md:rounded-[30px] max-md:border max-md:bg-white max-md:p-6 max-md:shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] mx-auto'
  );
  const { dogs, user, me } = await getData();
  const dog = searchParams.current
    ? dogs.find((dog) => dog.id === parseInt(searchParams.current!)) || dogs[0]
    : dogs[0];

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <div className="item-center -mx-4 -my-3 flex max-sm:flex-col-reverse">
            <div className="flex-1 px-4 py-3 max-sm:text-center">
              <Headings tag="h1" styles="h2" className="text-primary">
                {t('welcome-back-{}', { name: me.firstName })}
              </Headings>
              <p className="mt-4">
                {t('keep-tabs-on-your-subscription-and-edit-{}-information', {
                  name: dog.name,
                })}
              </p>
            </div>
            <div className="px-4 py-3">
              <DogSwitch dogs={dogs.map((dog) => ({ id: dog.id, name: dog.name }))} />
            </div>
          </div>
          <div className="py-6"></div>
          <Headings tag="h2" styles="h2" className="text-primary max-md:text-center">
            {t('{}-colon', { value: t('your-dog') })}
          </Headings>
          <div className="mx-auto mt-4 rounded-[30px] border border-brown bg-white px-4 py-2 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] max-md:text-center">
            <div className="flex flex-wrap items-center">
              <div className="flex-1 px-3 py-3">
                <div className="text-xl font-bold text-brown">{dog.name}</div>
                <div className="mt-2">[Poodle]</div>
                <div className="mt-3">
                  [7 years and 7 months old, 8 kg, mellow, is spayed, and has no allergies / food
                  sensitivities.]
                </div>
                <div className="mt-3">
                  <UnderlineButton label={t('view-{}-feeding-guidelines', { name: dog.name })} />
                </div>
              </div>
              <div className="px-3 py-3 max-md:w-full">
                <Button theme="primary" href="/account/dog/1">
                  {t('edit-{}', { value: t('dogs-details') })}
                </Button>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <Headings tag="h2" styles="h2" className="text-primary max-md:text-center">
            {t('{}-colon', { value: t('{}-box', { name: dog.name }) })}
          </Headings>
          <div className="mt-4 rounded-[30px] border border-brown bg-white px-8 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:border-none max-md:bg-transparent max-md:p-0 max-md:shadow-none">
            <div className="-mx-3 flex max-md:block">
              <div className="px-3 text-center">
                <div
                  className={clsx(
                    'max-md:flex max-md:flex-col max-md:items-center',
                    mbBoxClassName
                  )}
                >
                  <Image
                    src="/ocelle-box.jpg"
                    alt="Ocelle Box"
                    width={280}
                    height={274}
                    className="rounded-2xl"
                  />
                  <div className="max-w-[280px]">
                    <p className="mt-3">
                      {t.rich('upcoming-box-arrives-by-the-{}', {
                        date: '[15th of December 2023]',
                        span: (chunks) => (
                          <span className="whitespace-nowrap font-bold text-brown">{chunks}</span>
                        ),
                      })}
                    </p>
                    <div className="mt-3">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('delivery-date') })}
                        href="/account/plan/delivery-date"
                      />
                    </div>
                    <p className="mt-3">
                      {t.rich('you-can-make-changes-until-the-{}', {
                        date: '10th of December 2023',
                        strong: (chunks) => (
                          <strong className="whitespace-nowrap text-brown">{chunks}</strong>
                        ),
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-3">
                <div className="h-full w-px border-l border-gray"></div>
              </div>
              <div className="flex-1 px-3">
                <div
                  className={clsx(
                    'flex h-full flex-col justify-between max-md:mt-6 max-sm:text-center',
                    mbBoxClassName
                  )}
                >
                  <div className="text-lg font-bold text-brown">
                    {t('{}-colon', { value: t('whats-included-in-this-box') })}
                  </div>
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between">
                    <span className="flex-1 px-1 py-2 lowercase">
                      {t('{}-supply-of-fresh-healthy-food', {
                        value: t('{}-weeks', {
                          value: user?.orderSize === OrderSize.OneWeek ? 1 : 2,
                        }),
                      })}
                    </span>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('order-size') })}
                        href="/account/plan/often"
                      />
                    </div>
                  </div>
                  <hr className="my-3 border-gray max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between max-sm:mb-2">
                    <div className="flex-1 px-1 py-2 text-lg font-bold text-brown">
                      {dog.plan.recipe2 == null ? 1 : 2} {t('fresh-{}', { value: t('recipes') })}
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('recipes') })}
                        href="/account/plan/recipe"
                      />
                    </div>
                  </div>
                  <div className="mb-4 mt-2 max-sm:mx-auto">
                    <div className="-mx-2 -my-4 flex justify-between max-sm:flex-col">
                      <div className="px-2 py-4">
                        <Image
                          src="/meal-plan/chicken.jpg"
                          alt="Chicken Recipe"
                          width={195}
                          height={195}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">Fresh Chicken Recipe</p>
                      </div>
                      <div className="px-2 py-4">
                        <div className="h-full w-px border-l border-gray max-sm:w-full max-sm:border-b"></div>
                      </div>
                      <div className="px-2 py-4">
                        <Image
                          src="/meal-plan/lamb.jpg"
                          alt="Lamb Recipe"
                          width={195}
                          height={195}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">Fresh Lamb Recipe</p>
                      </div>
                    </div>
                  </div>
                  <hr className="my-3 border-gray max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between">
                    <div className="flex-1 px-1 py-2 text-lg font-bold text-brown">
                      {dog.plan.mealPlan === MealPlan.Full
                        ? t('fresh-full-plan')
                        : t('fresh-half-plan')}
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('meal-plan') })}
                        href="/account/plan/meal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <div className="rounded-[30px] bg-primary px-3 py-6 text-white max-md:py-8">
            <div className="flex items-center max-md:flex-col">
              <div className="px-4">
                <Image src="/referral-box.svg" alt="Referral Box" width={300} height={300} />
              </div>
              <div className="px-4 max-md:text-center">
                <Headings tag="h2" styles="h2">
                  {t.rich('know-more-dog-people-refer-a-friend-earn-{}', {
                    value: '[$50]',
                    strong: (chunks) => <strong className="text-[1.1em]">{chunks}</strong>,
                  })}
                </Headings>
                <p className="mt-3">
                  {t.rich(
                    'refer-your-friends-to-try-ocelle-with-a-special-discount-code-and-get-{}-off-your-next-box',
                    {
                      value: '[$50]',
                      strong: (chunks) => <strong className="text-[1.4em]">{chunks}</strong>,
                    }
                  )}
                </p>
                <Button className="mt-6">{t('refer-a-friend')}</Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
