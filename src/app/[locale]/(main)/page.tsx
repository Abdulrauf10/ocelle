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
import { Link } from '@/navigation';

export default function Home() {
  const t = useTranslations('Home');
  const b = useTranslations('Button');
  return (
    <main className="overflow-x-hidden">
      <Picture />
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 font-bold">
            {t('block-2-title-1')}
            <br className="md:hidden" />
            {t('block-2-title-2')}
          </h1>
          <p className="body-1 mt-8">
            {t('blcok-2-content-1')}
            <br className="max-lg:hidden" />
            {t('blcok-2-content-2')}
          </p>
        </Container>
      </Block>
      <div className="flex flex-wrap">
        <div className="min-h-[300px] w-1/2 bg-[url('./gofresh-img.jpg')] bg-cover bg-[center_right] max-md:w-full"></div>
        <div className="w-1/2 pl-[2vw] pr-[1vw] text-xl max-md:w-full">
          <Block>
            <h2 className="heading-1 font-bold text-primary">
              {t.rich('block-3-title-1')}
              <br />
              {t('block-3-title-2')}
            </h2>
            <div className="mt-[2vw]">
              <List
                picture={<Tickbox className="mr-4 mt-1 h-5 w-5" />}
                className={{ listItem: 'py-0.5' }}
                items={[
                  t('block-3-content-1'),
                  t('block-3-content-2'),
                  t('block-3-content-3'),
                  t('block-3-content-4'),
                  t('block-3-content-5'),
                ]}
              />
            </div>
            <div className="mb-5 mt-[2vw]"></div>
            <div className="flex justify-center md:justify-start">
              <Button href="/why-fresh">{b('learn-more')}</Button>
            </div>
          </Block>
        </div>
      </div>
      <Block className="bg-primary bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-primary">
            {t('block-4-title-1')}
            <br className="hidden lg:block" />
            {t('block-4-title-2')}
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
                <h3 className="heading-4 mt-2 text-primary">{t.rich('block-4-item-1-title')}</h3>
                <p className="body-1 mt-2 xl:max-w-[320px]">{t('block-4-item-1-content')}</p>
              </div>
              <div className="mt-[6%] md:w-1/2 xl:w-full">
                <Image
                  className="h-20 w-20"
                  alt="good food"
                  src="/meal-plan/icon-2.svg"
                  width={74}
                  height={70}
                />
                <h3 className="heading-4 mt-2 text-primary">{t('block-4-item-2-title')}</h3>
                <p className="body-1 mt-2 xl:max-w-[320px]">{t('block-4-item-2-content')}</p>
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
                    <h3 className="heading-4 mt-2 text-primary">{t('block-4-item-3-title')}</h3>
                    <p className="body-1 mt-2">{t.rich('block-4-item-3-content')}</p>
                  </div>
                  <div className="w-full max-xl:mt-0 max-xl:p-3 md:w-1/2 xl:ml-[11%] xl:mt-[12%] xl:w-full xl:max-w-[320px]">
                    <Image
                      className="h-20 w-20"
                      alt="good food"
                      src="/meal-plan/icon-4.svg"
                      width={67}
                      height={70}
                    />
                    <h3 className="heading-4 mt-2 text-primary">{t('block-4-item-4-title')}</h3>
                    <p className="body-1 mt-2">{t('block-4-item-4-content')}</p>
                  </div>
                  <div className="ml-[6%] mt-[21%] text-center max-xl:hidden">
                    <Button href="/get-started">{b('see-your-recipes')}</Button>
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
            <Button href="/get-started">{b('see-your-recipes')}</Button>
          </div>
        </Container>
      </Block>
      <Marquee
        items={[
          {
            icon: '/feature/icon-1.svg',
            alt: t('real-good-food'),
            width: 50,
            height: 50,
            title: t('real-good-food'),
          },
          {
            icon: '/feature/icon-2.svg',
            alt: t('vet-approved'),
            width: 50,
            height: 50,
            title: t('vet-approved'),
          },
          {
            icon: '/feature/icon-3.svg',
            alt: t('human-grade'),
            width: 50,
            height: 50,
            title: t('human-grade'),
          },
          {
            icon: '/feature/icon-4.svg',
            alt: t('made-fresh'),
            width: 50,
            height: 50,
            title: t('made-fresh'),
          },
          {
            icon: '/feature/icon-5.svg',
            alt: t('high-quality-ingredients'),
            width: 50,
            height: 50,
            title: t('high-quality-ingredients'),
          },
          {
            icon: '/feature/icon-6.svg',
            alt: t('no-fillers'),
            width: 50,
            height: 50,
            title: t('no-fillers'),
          },
          {
            icon: '/feature/icon-7.svg',
            alt: t('no-preservatives'),
            width: 50,
            height: 50,
            title: t('no-preservatives'),
          },
          {
            icon: '/feature/icon-8.svg',
            alt: t('no-artificial-flavours'),
            width: 50,
            height: 50,
            title: t('no-artificial-flavours'),
          },
        ]}
      />
      <Block className="bg-gray bg-opacity-20">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gray">{t('block-5-title')}</h2>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
          <p className="mt-[2.5vw] text-center text-[32px] font-normal text-gray max-md:text-[32px] max-sm:mt-8">
            {t.rich('block-5-content', {
              link: (chunks) => {
                return (
                  <Link
                    href="/how-it-works/individual-pack"
                    className="font-normal text-secondary underline hover:underline"
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
          <h2 className="heading-1 text-center font-black text-gold">{t('block-6-title')}</h2>
          <p className="body-1 mx-auto mt-5 max-w-screen-md text-center text-gold"></p>
          <CaseSwiper />
          <div className="mt-8 text-center">
            <Button href="/get-started">{b('see-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <div className="bg-[url('./recommended-plan-bg.jpg')] bg-cover bg-center py-40 max-md:py-16">
        <Container>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white p-8 py-12 text-center sm:p-16 md:px-[140px]">
            <strong className="heading-3 text-primary">{t('block-7-title')}</strong>
            <p className="body-1 mt-5">{t('block-7-content')}</p>
            <div className="mt-8 text-center">
              <Button href="/get-started">{b('create-your-plan')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <Newsletter />
    </main>
  );
}
