'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';
import CloseCircle from '../icons/CloseCircle';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

function Hr() {
  return <hr className="my-10 border-t-2 border-primary"></hr>;
}

function DialogBlock({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <strong className="block text-center text-5xl text-primary">{title}</strong>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function RecipeIngredientsDialog({
  recipe,
  recipePicture,
  ingredients,
  calorie,
  analysis,
  children,
}: React.PropsWithChildren<{
  recipe: string;
  recipePicture: string;
  ingredients: Array<{
    spacing?: number;
    picture: string;
    title: string;
    description: string;
  }>;
  calorie: number;
  analysis: {
    protein: number;
    fat: number;
    fibre: number;
    moisture: number;
  };
}>) {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[1100px] p-3">
        <div className="relative w-full rounded-[40px] border-[6px] border-primary bg-white px-12 py-10 text-left shadow-[7px_7px_15px_rgba(0,0,0,0.05)] max-md:px-6 max-md:pt-9 md:border-8">
          <div className="md:px-6">
            <div className="-m-3 flex items-center max-md:flex-wrap">
              <div className="p-3 text-[90px] font-bold leading-none text-primary max-lg:text-[70px] max-md:text-[85px] max-xs:text-[60px]">
                {recipe}
              </div>
              <div className="w-full p-3">
                <div className="w-full min-w-[420px] max-lg:min-w-[340px] max-sm:min-w-0">
                  <div className="relative overflow-hidden rounded-[30px] pt-[100%]">
                    <Image src={recipePicture} alt={recipe} fill />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <DialogBlock title={t('whats-inside')}>
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
                    <p className="body-1 mt-2 text-center max-md:mb-3">{ingredient.description}</p>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </DialogBlock>
          <Hr />
          <DialogBlock title={t('whats-not-inside')}>
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
          </DialogBlock>
          <Hr />
          <DialogBlock title={t('nutrition-profile')}>
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
                    <span>{t('{}-pct-min', { value: analysis.protein })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('crude-fat')}</span>
                    <span>{t('{}-pct-min', { value: analysis.fat })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('crude-firbe')}</span>
                    <span>{t('{}-pct-max', { value: analysis.fibre })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{t('moisture')}</span>
                    <span>{t('{}-pct-max', { value: analysis.moisture })}</span>
                  </div>
                </div>
              </div>
              <div className="w-1/2 px-6 py-3 max-md:w-full">
                <div className="body-1 flex h-full items-center rounded-3xl border-[3px] p-4 text-primary">
                  {t('our-{}-for-dogs-is-formulated-to-meet-the-nutritional-levels', {
                    name: recipe,
                  })}
                </div>
              </div>
            </div>
          </DialogBlock>
          <DialogClose className="absolute right-5 top-4 cursor-pointer">
            <CloseCircle className="h-7 w-7 md:h-8 md:w-8" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
