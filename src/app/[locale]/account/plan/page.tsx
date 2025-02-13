import clsx from 'clsx';
import { startOfDay } from 'date-fns';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import React from 'react';
import { IsNull, Not } from 'typeorm';

import DogSwitch from '../DogSwitch';
import ReferAFriendButton from './ReferAFriendButton';

import { getCurrentSelectedDogIdCookie, getLoginedMe } from '@/actions';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import { RecurringBox, Shipment } from '@/entities';
import { Frequency, MealPlan, PadSpace } from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';
import RecipeHelper from '@/helpers/recipe';
import { isDeliveredRecurringBox } from '@/helpers/shipment';
import getSentence from '@/servers/getSentence';

const today = startOfDay(new Date());

export default async function Plan() {
  const locale = await getLocale();
  const t = await getTranslations();
  const b = await getTranslations('Button');
  const r = await getTranslations('Recipes');
  const sentence = await getSentence();
  const mbBoxClassName = clsx(
    'max-md:border-brown max-md:rounded-[30px] max-md:border max-md:bg-white max-md:p-6 max-md:shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] mx-auto'
  );
  const { dogs, firstName } = await getLoginedMe();
  const currentSelectedDogId = await getCurrentSelectedDogIdCookie(dogs[0].id);
  const dog = currentSelectedDogId
    ? dogs.find((dog) => dog.id === currentSelectedDogId) || dogs[0]
    : dogs[0];
  const shipments = await executeQuery(async (queryRunner) => {
    return await queryRunner.manager.find(Shipment, {
      where: {
        dog: { id: dog.id },
      },
      order: {
        deliveryDate: -1,
      },
      relations: {
        box: true,
      },
      take: 2,
    });
  });

  const editable = shipments.find((shipment) => shipment.editableDeadline >= today);

  const deadlinedShipable = shipments.find(
    (shipment) =>
      !isDeliveredRecurringBox(shipment.deliveryDate) && shipment.editableDeadline <= today
  );

  const shipable = deadlinedShipable || editable;

  const upcomingBoxInfo = deadlinedShipable?.box
    ? {
        frequency: deadlinedShipable.box.frequency,
        recipe1: deadlinedShipable.box.recipe1,
        recipe2: deadlinedShipable.box.recipe2,
        mealPlan: deadlinedShipable.box.mealPlan,
      }
    : {
        frequency: dog.plan.frequency,
        recipe1: dog.plan.recipe1,
        recipe2: dog.plan.recipe2,
        mealPlan: dog.plan.mealPlan,
      };

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
                  name: sentence.padSpace(PadSpace.Both, dog.name),
                })}
              </p>
            </div>
            <div className="px-4 py-3">
              <DogSwitch
                selectedDogId={dog.id}
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
                  <UnderlineButton
                    label={t('view-{}-feeding-guidelines', {
                      name: sentence.padSpace(PadSpace.Both, dog.name),
                    })}
                  />
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
            {t('{}-colon', {
              value: t('{}-box', { name: sentence.padSpace(PadSpace.Right, dog.name) }),
            })}
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
                    src="/account/upcoming_box_visual.png"
                    alt="Ocelle Box"
                    width={280}
                    height={274}
                    className="rounded-2xl"
                  />
                  <div className="max-w-[280px]">
                    {shipable && (
                      <p className="mt-3">
                        {t.rich('upcoming-box-arrives-by-the-{}', {
                          date: sentence.date(shipable.deliveryDate, true),
                          span: (chunks) => (
                            <span className="whitespace-nowrap font-bold text-brown">{chunks}</span>
                          ),
                        })}
                      </p>
                    )}
                    {deadlinedShipable?.trackingCode && (
                      <div className="mt-3">
                        <Button theme="secondary">{t('track-order')}</Button>
                      </div>
                    )}
                    {editable && (
                      <div className="mt-3">
                        <UnderlineButton
                          theme="primary"
                          label={t('manage-{}', { value: t('delivery-date') })}
                          href="/account/plan/delivery-date"
                        />
                      </div>
                    )}
                    {editable && !deadlinedShipable && (
                      <p className="mt-3">
                        {t.rich('you-can-make-changes-until-the-{}', {
                          date: sentence.datetime(editable.editableDeadline, true),
                          b: (chunks) => <b className="text-brown">{chunks}</b>,
                        })}
                      </p>
                    )}
                    {editable && deadlinedShipable && (
                      <p className="mt-3">
                        {t.rich('unfortunately-you-can-no-longer-make-changes-to-{}-upcoming-box', {
                          name: sentence.padSpace(PadSpace.Both, dog.name),
                        })}
                        {locale === 'en' ? ' ' : ''}
                        {t.rich('however-you-can-adjust-{}-next-box-scheduled-for-the-{}', {
                          sex: dog.sex,
                          date: sentence.date(editable!.deliveryDate, true),
                          b: (chunks) => <b className="text-brown">{chunks}</b>,
                        })}
                      </p>
                    )}
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
                  <div className="-mx-1 -my-1.5 flex items-center justify-between max-sm:flex-col">
                    <div className="flex flex-col">
                      <span className="flex-1 px-1 py-1.5 lowercase">
                        {t('{}-supply-of-fresh-healthy-food', {
                          value: t('{}-weeks', {
                            value: sentence.padSpace(
                              PadSpace.Right,
                              String(upcomingBoxInfo.frequency === Frequency.OneWeek ? 1 : 2)
                            ),
                          }),
                        })}
                      </span>
                      {deadlinedShipable?.box && (
                        <div className="px-1 py-1.5">
                          {t.rich('{}-next-box-will-contain-a-{}-supply-of-fresh-healthy-food', {
                            name: sentence.padSpace(PadSpace.Right, dog.name),
                            value: t('{}-weeks', {
                              value: sentence.padSpace(
                                PadSpace.Both,
                                String(dog.plan.frequency === Frequency.OneWeek ? 1 : 2)
                              ),
                            }),
                          })}
                        </div>
                      )}
                    </div>
                    <div className="whitespace-nowrap px-1 py-1.5 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('order-frequency') })}
                        href="/account/plan/often"
                      />
                    </div>
                  </div>
                  <hr className="my-3 border-gray max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between max-sm:mb-2">
                    <div className="flex-1 px-1 py-2 text-lg font-bold text-brown">
                      {t('{}-fresh-{}', {
                        value: b('recipes'),
                        num: upcomingBoxInfo.recipe2 == null ? 1 : 2,
                      })}
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: b('recipes') })}
                        href="/account/plan/recipe"
                      />
                    </div>
                  </div>
                  <div className="mb-1 mt-2 max-sm:mx-auto">
                    <div className="-mx-2 -my-4 flex justify-between max-sm:flex-col">
                      <div className="px-2 py-4">
                        <Image
                          src={`/meal-plan/${RecipeHelper.getSlug(upcomingBoxInfo.recipe1)}.jpg`}
                          alt={r('fresh-{}-recipe', {
                            value: t(RecipeHelper.getSlug(upcomingBoxInfo.recipe1)),
                          })}
                          width={195}
                          height={195}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">
                          {r('fresh-{}-recipe', {
                            value: t(RecipeHelper.getSlug(upcomingBoxInfo.recipe1)),
                          })}
                        </p>
                      </div>
                      {upcomingBoxInfo.recipe2 && (
                        <>
                          <div className="px-2 py-4">
                            <div className="h-full w-px border-l border-gray max-sm:w-full max-sm:border-b"></div>
                          </div>
                          <div className="px-2 py-4">
                            <Image
                              src={`/meal-plan/${RecipeHelper.getSlug(upcomingBoxInfo.recipe2)}.jpg`}
                              alt={r('fresh-{}-recipe', {
                                value: t(RecipeHelper.getSlug(upcomingBoxInfo.recipe2)),
                              })}
                              width={195}
                              height={195}
                              className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                            />
                            <p className="mt-2 text-center">
                              {r('fresh-{}-recipe', {
                                value: t(RecipeHelper.getSlug(upcomingBoxInfo.recipe2)),
                              })}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {deadlinedShipable?.box && (
                    <div className="mt-2">
                      {t.rich('{}-next-box-will-contain-{}', {
                        name: sentence.padSpace(PadSpace.Right, dog.name),
                        value: new Intl.ListFormat(locale === 'zh' ? 'zh-HK' : 'en-US').format(
                          dog.plan.recipe2
                            ? [
                                r('fresh-{}-recipe', {
                                  value: t(RecipeHelper.getSlug(dog.plan.recipe1)),
                                }),
                                r('fresh-{}-recipe', {
                                  value: t(RecipeHelper.getSlug(dog.plan.recipe2)),
                                }),
                              ]
                            : [
                                r('fresh-{}-recipe', {
                                  value: t(RecipeHelper.getSlug(dog.plan.recipe1)),
                                }),
                              ]
                        ),
                      })}
                    </div>
                  )}
                  <hr className="my-3 border-gray max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between">
                    <div className="flex-1 px-1 py-2 text-lg font-bold text-brown">
                      {upcomingBoxInfo.mealPlan === MealPlan.Full
                        ? t('fresh-full-plan')
                        : t('fresh-half-plan')}
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label={t('manage-{}', { value: t('order-plan') })}
                        href="/account/plan/meal"
                      />
                    </div>
                  </div>
                  {deadlinedShipable?.box && (
                    <div>
                      {t.rich('{}-will-be-on-the-{}-for-{}-next-box', {
                        name: sentence.padSpace(PadSpace.Right, dog.name),
                        sex: dog.sex,
                        value:
                          dog.plan.mealPlan === MealPlan.Full
                            ? t('fresh-full-plan')
                            : t('fresh-half-plan'),
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <div className="rounded-[30px] bg-primary px-3 py-6 text-white max-md:py-8">
            <div className="flex items-center max-md:flex-col">
              <div className="px-4">
                <Image
                  src="/account/referral-box.svg"
                  alt="Referral Box"
                  width={300}
                  height={300}
                />
              </div>
              <div className="px-4 max-md:text-center">
                <h2 className="heading-4 font-bold">
                  {t.rich('know-more-dog-people-refer-a-friend-earn-{}', {
                    value: '$50',
                    b: (chunks) => <b className="text-[1.1em]">{chunks}</b>,
                  })}
                </h2>
                <p className="mt-5">
                  <span className="body-3">
                    {t.rich(
                      'refer-your-friends-to-try-ocelle-with-a-special-discount-code-and-get-{}-off-your-next-box',
                      {
                        value: '$50',
                        b: (chunks) => <b className="text-[1.4em]">{chunks}</b>,
                      }
                    )}
                  </span>
                </p>
                <ReferAFriendButton />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </AppThemeProvider>
  );
}
