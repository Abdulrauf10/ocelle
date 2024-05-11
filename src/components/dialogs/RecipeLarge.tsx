'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../Dialog';
import CloseCircle from '../icons/CloseCircle';

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

export default function RecipeLargeDialog({
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
    className?: string;
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
  const m = useTranslations('Marquee');
  const r = useTranslations('Recipes');
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-3">
        <div className="relative w-full max-w-[1076px] rounded-[40px] border-[6px] border-primary bg-white px-12 py-10 text-left shadow-[7px_7px_15px_rgba(0,0,0,0.05)] max-md:px-6 max-md:pt-9 md:border-8">
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
          <DialogBlock title={r('whats-inside')}>
            <Swiper
              slidesPerView={1}
              spaceBetween={50}
              modules={[Pagination]}
              pagination={{
                enabled: true,
                clickable: true,
              }}
              wrapperClass="mb-16"
              loop={true}
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
                        className={clsx('absolute', ingredient.className)}
                      />
                    </div>
                    <div className="mt-6"></div>
                    <strong className="heading-4 block text-center text-primary">
                      {ingredient.title}
                    </strong>
                    <div className="mt-2"></div>
                    <p className="body-1 text-center">{ingredient.description}</p>
                    <div className="max-md:mb-3"></div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </DialogBlock>
          <Hr />
          <DialogBlock title={r('whats-not-inside')}>
            <div className="pt-2"></div>
            <div className="-mx-3 -my-4 flex flex-wrap justify-evenly max-lg:justify-start">
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 max-[420px]:w-full ">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/colours.svg"
                  alt={m('no-colours')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-colours')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/filters.svg"
                  alt={m('no-fillers')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-fillers')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/flavourings.svg"
                  alt={m('no-flavourings')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-flavourings')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/preservatives.svg"
                  alt={m('no-preservatives')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-preservatives')}
                </strong>
              </div>
              <div className="w-full max-lg:hidden"></div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/additives.svg"
                  alt={m('no-additives')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-additives')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/artificial-ingredients.svg"
                  alt={m('no-artificial-flavours')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-artificial-flavours')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/recipes/not-inside/hormones.svg"
                  alt={m('no-hormones')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary">
                  {m('no-hormones')}
                </strong>
              </div>
            </div>
          </DialogBlock>
          <Hr />
          <DialogBlock title={r('nutrition-profile')}>
            <div className="-mx-6 -my-3 flex flex-wrap">
              <div className="w-1/2 px-6 py-3 max-md:w-full">
                <div className="mt-2"></div>
                <div className="body-1 flex flex-wrap justify-between">
                  <strong className="mr-2 uppercase">
                    {t('{}-colon', { value: r('calorie-content') })}
                  </strong>
                  <span>{t('{}-kcal-per-kg', { value: calorie })}</span>
                </div>
                <div className="mt-2"></div>
                <div className="body-1">
                  <strong className="uppercase">
                    {t('{}-colon', { value: r('guarenteed-analysis') })}
                  </strong>
                  <div className="mt-2 flex flex-wrap justify-between">
                    <span>{r('crude-protein')}</span>
                    <span>{r('{}-pct-min', { value: analysis.protein })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{r('crude-fat')}</span>
                    <span>{r('{}-pct-min', { value: analysis.fat })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{r('crude-firbe')}</span>
                    <span>{r('{}-pct-max', { value: analysis.fibre })}</span>
                  </div>
                  <div className="my-1">
                    <div className="dotted dotted-black" />
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <span>{r('moisture')}</span>
                    <span>{r('{}-pct-max', { value: analysis.moisture })}</span>
                  </div>
                </div>
              </div>
              <div className="w-1/2 px-6 py-3 max-md:w-full">
                <div className="body-1 flex h-full items-center rounded-3xl border-[3px] p-4 text-primary">
                  {r('our-{}-for-dogs-is-formulated-to-meet-the-nutritional-levels', {
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
