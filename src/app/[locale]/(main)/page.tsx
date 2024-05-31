import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import CaseSwiper from './CaseSwiper';
import HowPlanWorks from './HowPlanWorks';
import Picture from './Picture';

import Container from '@/components/Container';
import List from '@/components/List';
import Marquee from '@/components/Marquee';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import Tickbox from '@/components/icons/Tickbox';
import Block from '@/components/layouts/Block';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';
import { Link } from '@/navigation';

export default function Home() {
  const t = useTranslations('Home');
  const b = useTranslations('Button');
  const m = useTranslations('Marquee');
  return (
    <main className="overflow-x-hidden">
      <Picture />
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 heading-weight-1">{t.rich('block-2-title')}</h1>
          <div className="mt-6"></div>
          <p className="body-1">
            {t.rich('blcok-2-content', {
              br: () => <br className="max-lg:hidden" />,
            })}
          </p>
        </Container>
      </Block>
      <TwoToneBlock
        breakpoint="lg"
        className={{
          bgLeft: clsx(
            'bg-[#f2f2f0] bg-[url("./homepage-go-fresh.jpg")] bg-[length:auto_100%] bg-[right_top] bg-no-repeat',
            'max-xl:bg-[right_12%_top]',
            'max-lg:bg-[url("./homepage-go-fresh-mb.jpg")] max-lg:bg-[length:100%_auto] max-lg:bg-[bottom_20%_center] max-lg:pt-[65%]',
            'max-xs:bg-[url("./homepage-go-fresh-xs.jpg")] max-xs:bg-cover max-xs:bg-center max-xs:pt-[100%]'
          ),
          bgRight: 'max-lg:px-4',
        }}
        right={
          <div className="py-tight">
            <h2 className="heading-1 heading-weight-1 text-primary">{t.rich('block-3-title')}</h2>
            <div className="mt-tight"></div>
            <List
              picture={<Tickbox className="mr-4 h-5 w-5" />}
              className={{ row: 'py-1.5', item: 'body-1' }}
              items={[
                t('block-3-content-1'),
                t('block-3-content-2'),
                t('block-3-content-3'),
                t('block-3-content-4'),
                t('block-3-content-5'),
              ]}
            />
            <div className="mt-tight"></div>
            <div className="flex justify-center lg:justify-start">
              <Button href="/why-fresh/benefits-of-fresh-dog-food">{b('learn-more')}</Button>
            </div>
          </div>
        }
      />
      <Block className="bg-primary bg-opacity-15">
        <Container>
          <h2 className="heading-1 heading-weight-1 text-center text-primary">
            {t.rich('block-4-title')}
          </h2>
          <div className="relative mt-10 flex-col-reverse items-center max-xl:flex">
            <div className="pb-0 max-xl:flex max-xl:flex-wrap [&>*]:max-xl:m-0 [&>*]:max-xl:mt-3 [&>*]:max-xl:max-w-none [&>*]:max-xl:px-4 [&>*]:max-xl:py-3 [&>*]:max-xl:text-center [&>*]:max-sm:w-full [&_img]:max-xl:inline">
              <div className="ml-14 mt-5 md:w-1/2 xl:w-full">
                <Image
                  alt="good food"
                  className="h-20 w-20"
                  src="/meal-plan/icon-1.svg"
                  width={81}
                  height={70}
                />
                <div className="mt-2"></div>
                <h3 className="heading-4 text-primary">{t.rich('block-4-item-1-title')}</h3>
                <div className="mt-3"></div>
                <p className="body-1 xl:max-w-[320px]">{t('block-4-item-1-content')}</p>
              </div>
              <div className="mt-[6%] md:w-1/2 xl:w-full">
                <Image
                  className="h-20 w-20"
                  alt="good food"
                  src="/meal-plan/icon-2.svg"
                  width={74}
                  height={70}
                />
                <div className="mt-2"></div>
                <h3 className="heading-4 text-primary">{t.rich('block-4-item-2-title')}</h3>
                <div className="mt-3"></div>
                <p className="body-1 xl:max-w-[320px]">{t('block-4-item-2-content')}</p>
              </div>
              <div className="ml-32 mt-[6%]">
                <div className="flex flex-1 flex-wrap max-xl:-m-3">
                  <div className="w-full max-xl:p-3 md:w-1/2 xl:w-full xl:max-w-[300px]">
                    <Image
                      className="h-20 w-[114px]"
                      alt="good food"
                      src="/meal-plan/icon-3.svg"
                      width={102}
                      height={70}
                    />
                    <div className="mt-2"></div>
                    <h3 className="heading-4 text-primary">{t.rich('block-4-item-3-title')}</h3>
                    <div className="mt-3"></div>
                    <p className="body-1">{t.rich('block-4-item-3-content')}</p>
                  </div>
                  <div className="w-full max-xl:mt-0 max-xl:p-3 md:w-1/2 xl:ml-[11%] xl:mt-[12%] xl:w-full xl:max-w-[320px]">
                    <Image
                      className="h-20 w-20"
                      alt="good food"
                      src="/meal-plan/icon-4.svg"
                      width={67}
                      height={70}
                    />
                    <div className="mt-2"></div>
                    <h3 className="heading-4 text-primary">{t.rich('block-4-item-4-title')}</h3>
                    <div className="mt-3"></div>
                    <p className="body-1">{t('block-4-item-4-content')}</p>
                  </div>
                  <div className="ml-[6%] mt-[21%] text-center max-xl:hidden">
                    <Button href="/get-started">{b('get-started')}</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-[75%] max-xl:static max-sm:w-full">
              <div className="relative pt-[89%]">
                <Image alt="dog with variety of food" src="/mealplan-img.png" fill />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center xl:hidden">
            <Button href="/get-started">{b('get-started')}</Button>
          </div>
        </Container>
      </Block>
      <Marquee
        items={[
          {
            icon: '/feature/icon-1.svg',
            alt: m('real-good-food'),
            width: 40,
            height: 35,
            title: m('real-good-food'),
          },
          {
            icon: '/feature/icon-2.svg',
            alt: m('vet-approved'),
            width: 36,
            height: 35,
            title: m('vet-approved'),
          },
          {
            icon: '/feature/icon-3.svg',
            alt: m('human-grade'),
            width: 34,
            height: 34,
            title: m('human-grade'),
          },
          {
            icon: '/feature/icon-4.svg',
            alt: m('made-fresh'),
            width: 35,
            height: 34,
            title: m('made-fresh'),
          },
          {
            icon: '/feature/icon-5.svg',
            alt: m('high-quality-ingredients'),
            width: 32,
            height: 35,
            title: m('high-quality-ingredients'),
          },
          {
            icon: '/feature/icon-6.svg',
            alt: m('no-fillers'),
            width: 35,
            height: 35,
            title: m('no-fillers'),
          },
          {
            icon: '/feature/icon-7.svg',
            alt: m('no-preservatives'),
            width: 35,
            height: 35,
            title: m('no-preservatives'),
          },
          {
            icon: '/feature/icon-8.svg',
            alt: m('no-artificial-flavours'),
            width: 35,
            height: 35,
            title: m('no-artificial-flavours'),
          },
        ]}
      />
      <Block className="bg-gray bg-opacity-20">
        <Container>
          <h2 className="heading-1 heading-weight-1 text-center text-gray">{t('block-5-title')}</h2>
          <div className="mt-6">
            <HowPlanWorks
              mark1={{
                title: t.rich('block-5-item-1-title'),
                content: t.rich('block-5-item-1-content'),
              }}
              mark2={{
                title: t.rich('block-5-item-2-title'),
                content: t.rich('block-5-item-2-content'),
              }}
              mark3={{
                title: t.rich('block-5-item-3-title'),
                content: t.rich('block-5-item-3-content'),
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
          <div className="mt-normal"></div>
          <p className="heading-3 lg-resize text-center text-gray">
            {t.rich('block-5-content', {
              link: (chunks) => {
                return (
                  <Link
                    href="/how-it-works/individual-pack"
                    className="text-secondary underline hover:underline"
                  >
                    {chunks}
                  </Link>
                );
              },
            })}
          </p>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 heading-weight-1 text-center text-gold">{t('block-6-title')}</h2>
          <div className="mt-5"></div>
          <div className="mx-auto max-w-screen-md">
            <p className="body-1 text-center text-gold">{t('block-6-content')}</p>
          </div>
          <CaseSwiper />
          <div className="mt-8 text-center">
            <Button href="/get-started">{b('see-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <div className="bg-[#f7e9de] bg-[url('./recommended-plan-bg.jpg')] bg-[length:auto_100%] bg-center bg-no-repeat py-[clamp(120px,10vw,230px)] max-md:bg-primary max-md:bg-opacity-10 max-md:bg-none max-md:px-4 max-md:py-16 max-xs:px-0">
        <Container>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white p-6 text-center shadow-backdrop max-md:shadow-block">
            <div className="heading-3 heading-weight-2 text-primary">{t('block-7-title')}</div>
            <div className="mt-5"></div>
            <p className="body-1">{t.rich('block-7-content')}</p>
            <div className="mt-8 text-center">
              <Button href="/get-started">{b('create-your-plan')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <div className="bg-[url('./recommended-plan-bg-mb.jpg')] bg-[size:auto_100%] bg-center bg-no-repeat pt-[75%] md:hidden"></div>
      <Newsletter />
    </main>
  );
}
