'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { EffectCreative, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Container from '@/components/Container';
import List from '@/components/List';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DogFoot from '@/components/icons/DogFoot';
import Block from '@/components/layouts/Block';
import Toggler from '@/components/layouts/Toggler';
import { Link } from '@/navigation';

function Hightlight({ theme, children }: React.PropsWithChildren<{ theme: 'light' | 'dark' }>) {
  return (
    <span
      className={clsx(theme === 'dark' ? 'bg-white text-[#0D889D]' : 'bg-[#FFFF6C] text-[#231815]')}
    >
      {children}
    </span>
  );
}

function ConcernTitle({
  width,
  height,
  icon,
  title,
}: {
  width: number;
  height: number;
  icon: string;
  title: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center text-center max-sm:flex-col sm:pl-[80px]">
      <div className="sm:py-3">
        <div className="relative sm:inline">
          <Image
            src={`/why-fresh/${icon}`}
            alt=""
            width={width}
            height={height}
            className="mr-5 inline-block max-sm:mr-0 sm:absolute sm:right-[100%] sm:top-1/2 sm:-translate-y-1/2"
          />
          <div className="pt-3 sm:hidden"></div>
          <p className="heading-4 font-bold text-primary sm:inline">{title}</p>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  theme,
  source,
  icon,
  children,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  theme: 'light' | 'dark';
  icon: React.ReactNode;
  source: React.ReactNode;
}>) {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'relative mx-auto flex h-full max-w-2xl flex-col rounded-3xl px-8 py-8 max-md:px-4',
        theme === 'dark'
          ? 'bg-[#00616A] bg-[url("/dog-foot-bg.png")] bg-[length:156px_126px]'
          : 'bg-white'
      )}
    >
      <h3
        className={clsx(
          'heading-4 text-center font-bold',
          theme === 'dark' ? 'text-white' : 'text-[#555]'
        )}
      >
        {title}
      </h3>
      <div
        className={clsx(
          'my-6 rounded-3xl border p-6 max-md:px-4',
          theme === 'dark' ? 'bg-[#00616A] text-white' : 'bg-white text-black'
        )}
      >
        {children}
      </div>
      <div className="flex-1"></div>
      <div className="-mx-2 flex items-center justify-between">
        <div className="px-2">{icon}</div>
        <div className="px-2">
          <p
            className={clsx(
              'body-1 text-right font-bold',
              theme === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            {t('{}-colon', { value: t('source') })}
            {source}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ItsTimeToRethinkKibble() {
  const t = useTranslations();
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-ItsTimeToRethinkKibble');

  return (
    <main>
      <Block className="bg-[#f6ece1] bg-[url('/its-time-to-rethink-kibble-bg.jpg')] bg-[length:auto_100%] bg-center bg-no-repeat max-sm:bg-[53%_bottom] max-xs:bg-[length:auto_88%] max-xs:bg-[53%_bottom]">
        <Container className="pb-[clamp(420px,30%,650px)] max-xs:pb-[340px]">
          <h1 className="heading-headline heading-weight-1 text-center text-brown">
            {i.rich('block-1-title')}
          </h1>
          <div className="mt-4"></div>
          <p className="body-1 text-center">
            {i.rich('block-1-content-1', {
              br: () => <br className="max-md:hidden" />,
            })}
          </p>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold lang-zh:!font-bold">
            {i.rich('block-2-title')}
          </h2>
          <div className="pt-10"></div>
          <div className="-mx-4 flex items-center max-md:flex-col">
            <div className="mx-4 flex-1">
              <List
                className={{
                  list: '-my-3',
                  row: 'py-3',
                  icon: 'mr-4',
                }}
                picture={<DogFoot className="-mt-2 w-10 min-w-10 fill-gold" />}
                items={[
                  <p key="block-2-mark-1" className="body-1">
                    <span className="font-bold text-gold">
                      {t('{}-colon', { value: i('block-2-mark-1-title') })}
                    </span>
                    <span>{i.rich('block-2-mark-1-content')}</span>
                  </p>,
                  <p key="block-2-mark-2" className="body-1">
                    <span className="font-bold text-gold">
                      {t('{}-colon', { value: i('block-2-mark-2-title') })}
                    </span>
                    <span>{i.rich('block-2-mark-2-content')}</span>
                  </p>,
                  <p key="block-2-mark-3" className="body-1">
                    <span className="font-bold text-gold">
                      {t('{}-colon', { value: i('block-2-mark-3-title') })}
                    </span>
                    <span>{i.rich('block-2-mark-3-content')}</span>
                  </p>,
                  <p key="block-2-mark-4" className="body-1">
                    <span className="font-bold text-gold">
                      {t('{}-colon', { value: i('block-2-mark-4-title') })}
                    </span>
                    <span>{i.rich('block-2-mark-4-content')}</span>
                  </p>,
                ]}
              />
            </div>
            <div className="mx-4 flex-1 max-md:mt-8">
              <div className="ml-4 rounded-[40px] border-[3px] border-gold bg-white px-12 py-10 max-md:ml-0 max-md:px-6">
                <p className="heading-4 text-center italic text-gold">{i.rich('block-2-quota')}</p>
                <div className="mt-4"></div>
                <p className="body-1 text-center text-gold">{i.rich('block-2-quota-person')}</p>
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <Block styles="tight" className="bg-primary">
        <Container className="!max-w-6xl">
          <p className="heading-3 text-center font-bold text-white">
            {i.rich('block-3-content-1')}
          </p>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 text-center font-bold text-why-fresh-dark-green">
            {i.rich('block-4-title')}
          </h2>
          <Swiper
            slidesPerView={1}
            centeredSlides
            spaceBetween={50}
            modules={[Pagination, EffectCreative]}
            pagination={{
              dynamicBullets: false,
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !border-why-fresh-dark-green',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-why-fresh-dark-green',
            }}
            className="mt-10"
            wrapperClass="pb-20"
            effect="creative"
            creativeEffect={{
              limitProgress: 2,
              prev: {
                scale: 0.8,
                translate: ['-95%', 0, 0],
              },
              next: {
                scale: 0.8,
                translate: ['95%', 0, 0],
              },
            }}
            breakpoints={{
              1280: {
                slidesPerView: 2,
              },
            }}
          >
            <SwiperSlide className="!h-auto">
              <Card
                theme="dark"
                title={i.rich('block-4-mark-1-title')}
                icon={<Image src="/why-fresh/aafco-dark.jpg" alt="" width={210} height={66} />}
                source={
                  <>
                    AAFCO<sup>6</sup>
                  </>
                }
              >
                <p className="body-1">
                  {i.rich('block-4-mark-1-content-1', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-1-content-2', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <Card
                theme="light"
                title={i.rich('block-4-mark-2-title')}
                icon={<Image src="/why-fresh/aafco-light.jpg" alt="" width={210} height={66} />}
                source={
                  <>
                    AAFCO<sup>7</sup>
                  </>
                }
              >
                <p className="body-1">
                  {i.rich('block-4-mark-2-content-1', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-2-content-2', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <Card
                theme="dark"
                title={i.rich('block-4-mark-3-title')}
                icon={<Image src="/why-fresh/aafco-dark.jpg" alt="" width={210} height={66} />}
                source={
                  <>
                    AAFCO<sup>8</sup>
                  </>
                }
              >
                <p className="body-1">
                  {i.rich('block-4-mark-3-content-1', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <Card
                theme="light"
                title={i.rich('block-4-mark-4-title')}
                icon={<Image src="/why-fresh/aafco-light.jpg" alt="" width={210} height={66} />}
                source={
                  <>
                    AAFCO<sup>6</sup>
                  </>
                }
              >
                <p className="body-1 body-weight-1">
                  {i.rich('block-4-mark-4-content-1', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-4-content-2', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-4-content-3', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1 body-weight-1">
                  {i.rich('block-4-mark-4-content-4', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-4-content-5', {
                    h: (chunks) => <Hightlight theme="light">{chunks}</Hightlight>,
                  })}
                </p>
              </Card>
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <Card
                theme="dark"
                title={i.rich('block-4-mark-5-title')}
                icon={<Image src="/why-fresh/cdc.png" alt="" width={109.5} height={66} />}
                source={
                  <>
                    CDC<sup>9</sup>
                  </>
                }
              >
                <p className="body-1">
                  {i.rich('block-4-mark-5-content-1', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-5-content-2', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-5-content-3', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
                <div className="mt-4"></div>
                <p className="body-1">
                  {i.rich('block-4-mark-5-content-4', {
                    h: (chunks) => <Hightlight theme="dark">{chunks}</Hightlight>,
                  })}
                </p>
              </Card>
            </SwiperSlide>
          </Swiper>
        </Container>
      </Block>
      <Block className="bg-primary bg-opacity-10">
        <Container className="!max-w-5xl">
          <h2 className="heading-1 text-center font-bold text-primary">
            {i.rich('block-5-title')}
          </h2>
          <Toggler
            className={{ root: 'mt-6' }}
            title={
              <ConcernTitle
                width={60}
                height={53}
                icon="concern-1.svg"
                title={i.rich('block-5-mark-1-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-5-mark-1-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-1-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-1-content-3')}</p>
          </Toggler>
          <Toggler
            className={{ root: 'mt-6' }}
            title={
              <ConcernTitle
                width={65}
                height={39}
                icon="concern-2.svg"
                title={i.rich('block-5-mark-2-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-5-mark-2-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-2-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-2-content-3')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-2-content-4')}</p>
          </Toggler>
          <Toggler
            className={{ root: 'mt-6' }}
            title={
              <ConcernTitle
                width={58}
                height={52}
                icon="concern-3.svg"
                title={i.rich('block-5-mark-3-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-5-mark-3-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-3-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-3-content-3')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-3-content-4')}</p>
          </Toggler>
          <Toggler
            className={{ root: 'mt-6' }}
            title={
              <ConcernTitle
                width={38}
                height={52}
                icon="concern-4.svg"
                title={i.rich('block-5-mark-4-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-5-mark-4-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">
              {i.rich('block-5-mark-4-content-2', {
                h: (chunks) => <span className="text-secondary">{chunks}</span>,
              })}
            </p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-5-mark-4-content-3')}</p>
          </Toggler>
        </Container>
      </Block>
      <Block>
        <Container className="!max-w-5xl">
          <div className="relative">
            <div className="absolute inset-0 max-xl:hidden">
              <Image
                src="/why-fresh/chicken-kibble.png"
                alt=""
                width={50}
                height={50}
                className="absolute -left-24 top-1"
              />
              <Image
                src="/why-fresh/turkey-kibble.png"
                alt=""
                width={50}
                height={50}
                className="absolute -right-24 top-1/2 -translate-y-20"
              />
              <Image
                src="/why-fresh/beef-kibble.png"
                alt=""
                width={50}
                height={50}
                className="absolute -left-12 bottom-1"
              />
            </div>
            <h2 className="heading-1 relative text-center font-bold text-brown">
              {i.rich('block-6-title')}
            </h2>
            <hr className="my-10 border-brown" />
            <div className="relative mx-auto !max-w-4xl">
              <p className="body-1 text-center">{i.rich('block-6-content-1')}</p>
              <div className="mt-6"></div>
              <p className="body-1 text-center">{i.rich('block-6-content-2')}</p>
              <div className="mt-6"></div>
              <p className="body-1 text-center">{i.rich('block-6-content-3')}</p>
            </div>
          </div>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center">
          <h2 className="heading-1 font-bold text-white">{i.rich('block-7-title')}</h2>
          <div className="mt-6"></div>
          <p className="body-1 text-white">{i.rich('block-7-content-1')}</p>
          <div className="mt-1 max-md:mt-4"></div>
          <p className="body-1 text-white">{i.rich('block-7-content-2')}</p>
          <Button className="mt-8" href="/get-started">
            {b('try-it-today')}
          </Button>
        </Container>
      </Block>
      <Block className="overflow-hidden bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{w.rich('block-1-title')}</h2>
          <div className="pt-4"></div>
          <p className="body-1 text-center">
            {w.rich('block-1-content-1', {
              button: (chunks) => (
                <UnderlineButton
                  label={chunks}
                  href="/why-fresh/reference#its-time-to-rethink-kibble"
                />
              ),
            })}
          </p>
          <div className="pt-normal"></div>
          <div className="-mx-6 flex flex-wrap items-stretch max-lg:-mx-3">
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/benefits-of-fresh-dog-food"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 drop-shadow-style-1 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/benefits-of-fresh-dog-food.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('benefits-of-fresh-dog-food')}</span>
                </div>
              </Link>
            </div>
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full max-md:pt-normal">
              <Link
                href="/why-fresh/raw-dog-food-vs-gently-cooked"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 drop-shadow-style-1 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/raw-vs-gently-cooked-diets.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('raw-vs-gently-cooked-diets')}</span>
                </div>
              </Link>
            </div>
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full max-md:pt-normal">
              <Link
                href="/why-fresh/challenges-with-home-cooking-for-your-dog"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 drop-shadow-style-1 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image
                    src="/why-fresh/challenges-with-home-cooking-for-your-dog.jpg"
                    alt=""
                    fill
                  />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">
                    {w.rich('challenges-with-home-cooking-for-your-dog')}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
