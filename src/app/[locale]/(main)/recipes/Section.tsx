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
  return <hr className="my-10 border-primary"></hr>;
}

function Dotted() {
  return (
    <div className="after:text-md relative h-0.5 w-full overflow-hidden whitespace-nowrap font-sans after:absolute after:-top-4 after:left-0 after:inline-block after:align-[3px] after:tracking-[6px] after:text-black after:content-dotted"></div>
  );
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
  const t = useTranslations('general');

  return (
    <Block className={clsx('py-20', className)}>
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
          <div className="w-1/2 px-[4vw] max-md:w-full max-md:px-[30px] max-md:pt-[30px]">
            <strong className="text-3xl text-primary">{title}</strong>
            <p className="mt-4 text-lg">{description}</p>
            <strong className="mt-6 block text-xl text-brown">{t('ingredients')}: </strong>
            <p className="text-lg">{ingredientDescription}</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[480px]">
          <div className="-m-2 flex flex-wrap">
            <div className="w-1/2 p-2 max-xs:w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button fullWidth reverse>
                    {t('learn-more')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-lg p-3">
                  <div className="relative w-full rounded-[30px] border-4 border-primary bg-white px-12 py-10 text-left max-md:px-6 max-md:pt-9">
                    <div className="-m-3 flex items-center max-md:flex-wrap">
                      <div className="p-3 text-[100px] font-bold leading-none text-primary max-lg:text-[70px] max-md:text-[85px] max-xs:text-[60px]">
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
                    <Hr />
                    <DialogSection title="What’s Inside?">
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
                              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-primary">
                                <Image
                                  src={ingredient.picture}
                                  alt={ingredient.title}
                                  width={130}
                                  height={130}
                                />
                              </div>
                              <strong className="mt-6 block text-center text-xl text-primary">
                                {ingredient.title}
                              </strong>
                              <p className="mt-2 text-center">{ingredient.description}</p>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    </DialogSection>
                    <Hr />
                    <DialogSection title="What’s Not Inside?">
                      <div className="flex flex-wrap justify-evenly max-lg:justify-start">
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/colours.svg"
                            alt="No Colours"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Colours
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/filters.svg"
                            alt="No Filters"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Filters
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/flavourings.svg"
                            alt="No Flavourings"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Flavourings
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/preservatives.svg"
                            alt="No Preservatives"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Preservatives
                          </strong>
                        </div>
                        <div className="w-full max-lg:hidden"></div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/additives.svg"
                            alt="No Additives"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Additives
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/artificial-ingredients.svg"
                            alt="No Artificial Ingredients"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Artificial Ingredients
                          </strong>
                        </div>
                        <div className="min-w-[160px] p-3 max-lg:w-1/3 max-sm:w-1/2">
                          <Image
                            className="mx-auto"
                            src="/recipes/not-inside/hormones.svg"
                            alt="No Hormones"
                            width={80}
                            height={80}
                          />
                          <strong className="mt-2 block text-center text-xl font-bold text-primary">
                            No Hormones
                          </strong>
                        </div>
                      </div>
                    </DialogSection>
                    <Hr />
                    <DialogSection title="Nutrition Profile">
                      <div className="-mx-6 -my-3 flex flex-wrap">
                        <div className="w-1/2 px-6 py-3 max-md:w-full">
                          <div className="mt-2 flex flex-wrap justify-between">
                            <strong>{t('calorie-content')}:</strong>
                            <span>{t('kcal-per-kg', { value: calorie })}</span>
                          </div>
                          <div className="mt-2">
                            <strong>{t('guarenteed-analysis')}:</strong>
                            <div className="mt-2 flex flex-wrap justify-between">
                              <span>{t('crude-protein')}</span>
                              <span>{t('pct-min', { value: protein })}</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('crude-fat')}</span>
                              <span>{t('pct-min', { value: fat })}</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('crude-firbe')}</span>
                              <span>{t('pct-min', { value: fibre })}</span>
                            </div>
                            <div className="my-1">
                              <Dotted />
                            </div>
                            <div className="flex flex-wrap justify-between">
                              <span>{t('moisture')}</span>
                              <span>{t('pct-min', { value: moisture })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2 px-6 py-3 max-md:w-full">
                          <div className="flex h-full items-center rounded-3xl border-2 p-4 text-primary">
                            Our Fresh Chicken Recipe for Dogs is formulated to meet the nutritional
                            levels established by the AAFCO Dog Food Nutrient Profiles for all life
                            stages, including growth of large sized dogs (70 lbs. or more as an
                            adult).
                          </div>
                        </div>
                      </div>
                    </DialogSection>
                    <DialogClose className="absolute right-4 top-3 cursor-pointer">
                      <Close className="h-6 w-6" />
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-1/2 p-2 max-xs:w-full">
              <Button fullWidth href="/get-started">
                {t('get-started')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Block>
  );
}
