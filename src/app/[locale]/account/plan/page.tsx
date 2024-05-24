import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';
import { IsNull, Not } from 'typeorm';

import DogSwitch from '../DogSwitch';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import { RecurringBox } from '@/entities';
import { Frequency, MealPlan } from '@/enums';
import { getRecipeSlug } from '@/helpers/dog';
import { executeQuery } from '@/helpers/queryRunner';
import { getEditableRecurringBoxDeadline } from '@/helpers/shipment';
import getSentence from '@/servers/getSentence';
import { getCalendarEvents } from '@/services/calendar';

export default async function Plan() {
  const t = await getTranslations();
  const b = await getTranslations('Button');
  const r = await getTranslations('Recipes');
  const sentence = await getSentence();
  const mbBoxClassName = clsx(
    'max-md:border-brown max-md:rounded-[30px] max-md:border max-md:bg-white max-md:p-6 max-md:shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] mx-auto'
  );
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie();
  const calendarEvents = await getCalendarEvents();
  const { dogs, firstName } = await getLoginedMe();
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === currentSelectedDogId) || dogs[0]
    : dogs[0];
  const { upcomingBox } = await executeQuery(async (queryRunner) => {
    return {
      upcomingBox: await queryRunner.manager.findOne(RecurringBox, {
        where: {
          dog: { id: dog.id },
          order: Not(IsNull()),
        },
        relations: {
          shipment: true,
          prevBox: true,
        },
      }),
    };
  });

  if (!upcomingBox) {
    throw new Error('upcoming box not found');
  }

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <div className="item-center -mx-4 -my-3 flex max-sm:flex-col-reverse">
            <div className="flex-1 px-4 py-3 max-sm:text-center">
              <h1 className="heading-4 font-bold text-primary">
                {t('welcome-back-{}', { name: firstName })}
              </h1>
              <div className="mt-5"></div>
              <p>
                {t('keep-tabs-on-your-subscription-and-edit-{}-information', {
                  name: dog.name,
                })}
              </p>
            </div>
            <div className="px-4 py-3">
              <DogSwitch
                selectedDogId={currentSelectedDogId ?? dogs[0].id}
                dogs={dogs.map((dog) => ({ id: dog.id, name: dog.name }))}
              />
            </div>
          </div>
          <div className="py-6"></div>
          <h2 className="heading-4 font-bold text-primary max-md:text-center">
            {t('{}-colon', { value: t('your-dog') })}
          </h2>
          <div className="mx-auto mt-4 rounded-[30px] border border-brown bg-white px-4 py-2 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] max-md:text-center">
            <div className="flex flex-wrap items-center">
              <div className="flex-1 px-3 py-3">
                <div className="text-xl font-bold text-brown">{dog.name}</div>
                {dog.breeds.length > 0 && (
                  <div className="mt-2">
                    {dog.breeds.map((breed, idx) => {
                      if (idx > 0) {
                        return t('comma') + breed.breed.name;
                      }
                      return breed.breed.name;
                    })}
                  </div>
                )}
                <div className="mt-3">{sentence.dog(dog)}</div>
                <div className="mt-3">
                  <UnderlineButton label={t('view-{}-feeding-guidelines', { name: dog.name })} />
                </div>
              </div>
              <div className="px-3 py-3 max-md:w-full">
                <Button theme="primary" href={`/account/dog/${dog.id}`}>
                  {t('edit-{}', { value: t('dogs-details') })}
                </Button>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <h2 className="heading-4 font-bold text-primary max-md:text-center">
            {t('{}-colon', { value: t('{}-box', { name: dog.name }) })}
          </h2>
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
                        date: sentence.date(upcomingBox.shipment.deliveryDate, true),
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
                        date: sentence.date(
                          getEditableRecurringBoxDeadline(
                            calendarEvents,
                            upcomingBox.shipment.deliveryDate,
                            !upcomingBox.prevBox
                          ),
                          true
                        ),
                        b: (chunks) => <b className="text-brown">{chunks}</b>,
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
                          value: dog.plan.frequency === Frequency.OneWeek ? 1 : 2,
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
                      {dog.plan.recipe2 == null ? 1 : 2} {t('fresh-{}', { value: b('recipes') })}
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: b('recipes') })}
                        href="/account/plan/recipe"
                      />
                    </div>
                  </div>
                  <div className="mb-4 mt-2 max-sm:mx-auto">
                    <div className="-mx-2 -my-4 flex justify-between max-sm:flex-col">
                      <div className="px-2 py-4">
                        <Image
                          src={`/meal-plan/${getRecipeSlug(dog.plan.recipe1)}.jpg`}
                          alt={r('fresh-{}-recipe', {
                            value: t(getRecipeSlug(dog.plan.recipe1)),
                          })}
                          width={195}
                          height={195}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">
                          {r('fresh-{}-recipe', {
                            value: t(getRecipeSlug(dog.plan.recipe1)),
                          })}
                        </p>
                      </div>
                      {dog.plan.recipe2 && (
                        <>
                          <div className="px-2 py-4">
                            <div className="h-full w-px border-l border-gray max-sm:w-full max-sm:border-b"></div>
                          </div>
                          <div className="px-2 py-4">
                            <Image
                              src={`/meal-plan/${getRecipeSlug(dog.plan.recipe2)}.jpg`}
                              alt={r('fresh-{}-recipe', {
                                value: t(getRecipeSlug(dog.plan.recipe2)),
                              })}
                              width={195}
                              height={195}
                              className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                            />
                            <p className="mt-2 text-center">
                              {r('fresh-{}-recipe', {
                                value: t(getRecipeSlug(dog.plan.recipe2)),
                              })}
                            </p>
                          </div>
                        </>
                      )}
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
                <h2 className="heading-4 font-bold">
                  {t.rich('know-more-dog-people-refer-a-friend-earn-{}', {
                    value: '[$50]',
                    b: (chunks) => <b className="text-[1.1em]">{chunks}</b>,
                  })}
                </h2>
                <p className="mt-5">
                  <span className="body-3">
                    {t.rich(
                      'refer-your-friends-to-try-ocelle-with-a-special-discount-code-and-get-{}-off-your-next-box',
                      {
                        value: '[$50]',
                        b: (chunks) => <b className="text-[1.4em]">{chunks}</b>,
                      }
                    )}
                  </span>
                </p>
                <Button className="mt-6">{b('refer-a-friend')}</Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
