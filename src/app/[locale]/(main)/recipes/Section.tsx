'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Block from '@/components/Block';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/Dialog';
import Close from '@/components/icons/Close';

import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslations } from 'next-intl';

interface SectionProps {
  secionImage: string;
  dialogImage: string;
  alt: string;
  className?: string;
  reverse?: boolean;
  title: string;
  description: string;
  ingredientDescription: string;
  ingredients: Array<{
    spacing?: number;
    picture: string;
    title: string;
    description: string;
  }>;
  calorie: number;
  protein: number;
  fat: number;
  fibre: number;
  moisture: number;
}

function Hr() {
  return <hr className="my-10 border-t-2 border-primary"></hr>;
}

interface DialogSectionProps {
  title: string;
}

function DialogSection({ title, children }: React.PropsWithChildren<DialogSectionProps>) {
  return (
    <div>
      <strong className="block text-center text-5xl text-primary">{title}</strong>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function Section({
  secionImage,
  dialogImage,
  alt,
  reverse,
  className,
  title,
  description,
  ingredientDescription,
  ingredients,
  calorie,
  protein,
  fat,
  fibre,
  moisture,
}: React.PropsWithChildren<SectionProps>) {
  const t = useTranslations();

  return (
    <Block className={className}>
      <Container className="lg:px-20">
        <div
          className={clsx(
            'flex flex-wrap items-center',
            reverse && 'flex-row-reverse max-md:flex-col'
          )}
        >
          <div className="w-1/2 max-md:w-full">
            <div className="relative overflow-hidden rounded-[30px] pt-[80.6%] shadow-[7px_7px_15px_rgba(0,0,0,0.05)]">
              <Image alt={alt} src={secionImage} fill />
            </div>
          </div>
          <div className="w-1/2 px-[4vw] max-md:w-full max-md:px-2 max-md:pt-[30px]">
            <h2 className="heading-3 font-bold text-primary">{title}</h2>
            <p className="body-1 mt-4">{description}</p>
            <p className="heading-4 mt-6 font-bold text-brown">
              {t('{}-colon', { value: t('ingredients') })}
            </p>
            <p className="body-1">{ingredientDescription}</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[480px]">
          <div className="-m-2 flex flex-wrap">
            <div className="w-1/2 p-2 text-center max-xs:w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-[232px]" reverse>
                    {t('learn-more')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[1100px] p-3">
                  <div className="relative w-full rounded-[40px] border-[6px] border-primary bg-white px-12 py-10 text-left shadow-[7px_7px_15px_rgba(0,0,0,0.05)] max-md:px-6 max-md:pt-9 md:border-8">
                    <div className="md:px-6">
                      <div className="-m-3 flex items-center max-md:flex-wrap">
                        <div className="p-3 text-[90px] font-bold leading-none text-primary max-lg:text-[70px] max-md:text-[85px] max-xs:text-[60px]">
                          {title}
                        </div>
                        <div className="w-full p-3">
                          <div className="w-full min-w-[420px] max-lg:min-w-[340px] max-sm:min-w-0">
                            <div className="relative overflow-hidden rounded-[30px] pt-[100%]">
                              <Image src={dialogImage} alt={alt} fill />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Hr />
                    <DialogSection title={t('whats-inside')}>
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={50}
                        modules={[Pagination]}
                        pagination={{ enabled: true, clickable: true }}
                        wrapperClass="mb-16"
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                          },
                          1024: {
                            slidesPerView: 3,
                          },
                        }}
                      >
                        {ingredients.map((ingredient, idx) => {
                          return (
                            <SwiperSlide key={idx}>
                              <div className="mx-auto flex h-32 w-32 min-w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary">
                                <Image
                                  src={ingredient.picture}
                                  alt={ingredient.title}
                                  width={124 - (ingredient.spacing ?? 0)}
                                  height={124 - (ingredient.spacing ?? 0)}
                                  className="absolute"
                                />
                              </div>
                              <strong className="heading-4 mt-6 block text-center text-primary">
                                {ingredient.title}
                              </strong>
                              <p className="body-1 mt-2 text-center max-md:mb-3">
                                {ingredient.description}
                              </p>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </DialogSection>
                    <Hr />
                    <DialogSection title={t('whats-not-inside')}>
                      <div className="flex flex-wrap justify-evenly max-lg:justify-start">
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/colours.svg"
                            alt={t('no-colours')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-colours')}
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/filters.svg"
                            alt={t('no-fillers')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-fillers')}
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/flavourings.svg"
                            alt={t('no-flavourings')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-flavourings')}
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/preservatives.svg"
                            alt={t('no-preservatives')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-preservatives')}
                          </strong>
                        </div>
                        <div className="w-full max-lg:hidden"></div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/additives.svg"
                            alt={t('no-additives')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-additives')}
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/artificial-ingredients.svg"
                            alt={t('no-artificial-flavours')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-artificial-flavours')}
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/hormones.svg"
                            alt={t('no-hormones')}
                            width={80}
                            height={80}
                          />
                          <strong className="heading-4 mt-2 block text-center font-bold text-primary">
                            {t('no-hormones')}
                          </strong>
                        </div>
                      </div>
                    </DialogSection>
                    <Hr />
                    <DialogSection title={t('nutrition-profile')}>
                      <div className="-mx-6 -my-3 flex flex-wrap">
                        <div className="w-1/2 px-6 py-3 max-md:w-full">
                          <div className="body-1 mt-2 flex flex-wrap justify-between">
                            <strong className="uppercase">
                              {t('{}-colon', { value: t('calorie-content') })}
                            </strong>
                            <span>{t('{}-kcal-per-kg', { value: calorie })}</span>
                          </div>
                          <div className="body-1 mt-2">
                            <strong className="uppercase">
                              {t('{}-colon', { value: t('guarenteed-analysis') })}
                            </strong>
                            <div className="mt-2 flex flex-wrap justify-between">
                              <span>{t('crude-protein')}</span>
                              <span>{t('{}-pct-min', { value: protein })}</span>
                            </div>
                            <div className="my-1">
                              <div className="dotted dotted-black" />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('crude-fat')}</span>
                              <span>{t('{}-pct-min', { value: fat })}</span>
                            </div>
                            <div className="my-1">
                              <div className="dotted dotted-black" />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('crude-firbe')}</span>
                              <span>{t('{}-pct-max', { value: fibre })}</span>
                            </div>
                            <div className="my-1">
                              <div className="dotted dotted-black" />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('moisture')}</span>
                              <span>{t('{}-pct-max', { value: moisture })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2 px-6 py-3 max-md:w-full">
                          <div className="body-1 flex h-full items-center rounded-3xl border-[3px] p-4 text-primary">
                            {t('our-{}-for-dogs-is-formulated-to-meet-the-nutritional-levels', {
                              name: title,
                            })}
                          </div>
                        </div>
                      </div>
                    </DialogSection>
                    <DialogClose className="absolute right-5 top-4 cursor-pointer">
                      <Close className="h-7 w-7 md:h-8 md:w-8" />
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-1/2 p-2 text-center max-xs:w-full">
              <Button className="w-[232px]" href="/get-started">
                {t('build-my-plan')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Block>
  );
}
