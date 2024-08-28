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

function SwiperHr() {
  return <hr className="mb-10 mt-6 border-t-2 border-primary"></hr>;
}

function DialogBlock({ title, children }: React.PropsWithChildren<{ title: React.ReactNode }>) {
  return (
    <div>
      <strong className="block text-center text-5xl text-primary lang-zh:font-normal max-sm:lang-zh:-mx-[16px] max-sm:lang-zh:text-[40px]">
        {title}
      </strong>
      <div className="pt-2"></div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function SwiperDialogBlock({
  title,
  children,
}: React.PropsWithChildren<{ title: React.ReactNode }>) {
  return (
    <div>
      <strong className="block text-center text-5xl text-primary lang-zh:font-normal max-sm:pb-6 max-sm:lang-zh:text-[40px]">
        {title}
      </strong>
      <div className="pt-4 max-sm:pt-0"></div>
      <div className="-mx-4 sm:mt-6">{children}</div>
    </div>
  );
}

export default function RecipeLargeDialog({
  recipe,
  picture,
  ingredients,
  calorie,
  analysis,
  children,
}: React.PropsWithChildren<{
  recipe: string;
  picture: React.ReactNode;
  ingredients: Array<{
    spacing?: number;
    picture: string;
    title: string;
    description: React.ReactNode;
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
        <div className="relative mt-10 w-full max-w-[1076px] rounded-[40px] border-[6px] border-primary bg-white px-12 py-10 text-left shadow-[7px_7px_15px_rgba(0,0,0,0.05)] max-md:px-6 max-md:pt-10 md:border-8">
          <div className="md:px-6">
            <div className="-m-3 flex items-center max-md:flex-wrap">
              <div className="p-3 text-[90px] font-bold leading-none text-primary lang-zh:font-normal max-lg:lang-en:text-[70px] max-lg:lang-zh:text-[64px] max-md:text-[85px] max-xs:lang-en:text-[60px] max-xs:lang-zh:text-5xl">
                {recipe}
              </div>
              <div className="w-full p-3">
                <div className="w-full min-w-[420px] max-lg:min-w-[340px] max-sm:min-w-0">
                  {picture}
                </div>
              </div>
            </div>
          </div>
          <Hr />
          <SwiperDialogBlock title={r.rich('whats-inside')}>
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
                    <strong className="heading-4 block text-center text-primary lang-zh:font-normal">
                      {ingredient.title}
                    </strong>
                    <div className="mt-2"></div>
                    <p className="body-1 text-center">{ingredient.description}</p>
                    <div className="max-md:mb-3"></div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </SwiperDialogBlock>
          <SwiperHr />
          <DialogBlock title={r.rich('whats-not-inside')}>
            <div className="pt-2"></div>
            <div className="-mx-3 -my-4 flex flex-wrap justify-evenly max-lg:justify-start">
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0 max-[420px]:w-full md:lang-zh:px-0 ">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/colours.svg"
                  alt={m('no-colours')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-colours')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/filters.svg"
                  alt={m('no-fillers')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-fillers')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/flavourings.svg"
                  alt={m('no-flavourings')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-flavourings')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/preservatives.svg"
                  alt={m('no-preservatives')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-preservatives')}
                </strong>
              </div>
              <div className="w-full max-lg:hidden"></div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/additives.svg"
                  alt={m('no-additives')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-additives')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/artificial-ingredients.svg"
                  alt={m('no-artificial-flavours')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-artificial-flavours')}
                </strong>
              </div>
              <div className="min-w-[160px] px-3 py-4 max-lg:w-1/3 max-sm:w-1/2 max-xs:min-w-0  md:lang-zh:px-0 [@media(max-width:420px)]:w-full">
                <Image
                  className="mx-auto"
                  src="/whats-not-inside/hormones.svg"
                  alt={m('no-hormones')}
                  width={80}
                  height={80}
                />
                <div className="mt-3"></div>
                <strong className="heading-4 block text-center font-bold text-primary lang-zh:font-normal">
                  {m('no-hormones')}
                </strong>
              </div>
            </div>
          </DialogBlock>
          <Hr />
          <DialogBlock title={r('nutrition-profile')}>
            <div className="pt-2"></div>
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
                    {t('{}-colon', { value: r('guaranteed-analysis') })}
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
            <CloseCircle className="h-7 w-7 text-primary md:h-8 md:w-8" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
