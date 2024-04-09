import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Image from 'next/image';
import CaseSwiper from './CaseSwiper';
import HowPlanWorks from './HowPlanWorks';
import Block from '@/components/layouts/Block';
import Picture from './Picture';
import List from '@/components/List';
import Tickbox from '@/components/icons/Tickbox';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Marquee from '@/components/Marquee';

export default function Home() {
  const t = useTranslations();

  return (
    <main>
      <Picture />
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 font-bold">
            {t('they-re-my-dogs')}
            <br className="md:hidden" />
            {t('they-re-my-family')}
          </h1>
          <p className="body-1 mt-8">
            {t(
              'trade-guesswork-for-peace-of-mind-relax-knowing-that-your-dog-is-getting-the-highest-quality'
            )}
            <br className="max-lg:hidden" />
            {t('nutrition-for-a-longer-and-more-vibrant-life-it-s-science-and-it-s-delicious')}
          </p>
        </Container>
      </Block>
      <div className="flex flex-wrap">
        <div className="min-h-[300px] w-1/2 bg-[url('./gofresh-img.jpg')] bg-cover bg-[center_right] max-md:w-full"></div>
        <div className="w-1/2 px-[4vw] text-xl max-md:w-full">
          <Block>
            <h2 className="heading-1 font-bold text-primary">
              {t.rich('more-years-happier-years')}
              <br />
              {t('it-s-time-to-go-fresh')}
            </h2>
            <div className="mt-[2vw]">
              <List
                picture={<Tickbox className="mr-4 mt-1 h-5 w-5" />}
                className={{ listItem: 'py-0.5' }}
                items={[
                  t('increased-lifespan'),
                  t('delayed-onset-of-chronic-disease'),
                  t('reduced-likelihood-of-obesity'),
                  t('increased-bio-health-and-food-safety'),
                  t('increased-vitality-and-happiness'),
                ]}
              />
            </div>
            <div className="mb-5 mt-[2vw]"></div>
            <div className="flex justify-center md:justify-start">
              <Button href="/why-fresh">{t('learn-more')}</Button>
            </div>
          </Block>
        </div>
      </div>
      <Block className="bg-primary bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-primary">
            {t('we-re-powered-by-science')}
            <br className="hidden lg:block" />
            {t('customised-meal-plans-for-your-dogs')}
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
                <h3 className="heading-4 mt-2 text-primary">
                  {t.rich('real-good-food-freshly-made')}
                </h3>
                <p className="body-1 mt-2 xl:max-w-[320px]">
                  {t('real-good-food-freshly-made-content')}
                </p>
              </div>
              <div className="mt-[6%] md:w-1/2 xl:w-full">
                <Image
                  className="h-20 w-20"
                  alt="good food"
                  src="/meal-plan/icon-2.svg"
                  width={74}
                  height={70}
                />
                <h3 className="heading-4 mt-2 text-primary">{t('customised-meal-plans')}</h3>
                <p className="body-1 mt-2 xl:max-w-[320px]">{t('customised-meal-plans-content')}</p>
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
                    <h3 className="heading-4 mt-2 text-primary">{t('delivered-within-days')}</h3>
                    <p className="body-1 mt-2">{t.rich('delivered-within-days-content')}</p>
                  </div>
                  <div className="w-full max-xl:mt-0 max-xl:p-3 md:w-1/2 xl:ml-[11%] xl:mt-[12%] xl:w-full xl:max-w-[320px]">
                    <Image
                      className="h-20 w-20"
                      alt="good food"
                      src="/meal-plan/icon-4.svg"
                      width={67}
                      height={70}
                    />
                    <h3 className="heading-4 mt-2 text-primary">{t('vet-approved')}</h3>
                    <p className="body-1 mt-2">{t('vet-approved-content')}</p>
                  </div>
                  <div className="ml-[6%] mt-[21%] text-center max-xl:hidden">
                    <Button href="/get-started">{t('see-your-recipes')}</Button>
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
            <Button href="/get-started">{t('see-your-recipes')}</Button>
          </div>
        </Container>
      </Block>
      <Marquee
        items={[
          {
            icon: '/feature/icon-1.svg',
            alt: t('real-good-food'),
            width: 53,
            height: 46,
            title: t('real-good-food'),
          },
          {
            icon: '/feature/icon-2.svg',
            alt: t('vet-approved'),
            width: 43,
            height: 46,
            title: t('vet-approved'),
          },
          {
            icon: '/feature/icon-3.svg',
            alt: t('human-grade'),
            width: 38,
            height: 46,
            title: t('human-grade'),
          },
          {
            icon: '/feature/icon-4.svg',
            alt: t('made-fresh'),
            width: 38,
            height: 46,
            title: t('made-fresh'),
          },
          {
            icon: '/feature/icon-5.svg',
            alt: t('high-quality-ingredients'),
            width: 36,
            height: 46,
            title: t('high-quality-ingredients'),
          },
          {
            icon: '/feature/icon-6.svg',
            alt: t('no-fillers'),
            width: 40,
            height: 46,
            title: t('no-fillers'),
          },
          {
            icon: '/feature/icon-7.svg',
            alt: t('no-preservatives'),
            width: 40,
            height: 46,
            title: t('no-preservatives'),
          },
          {
            icon: '/feature/icon-8.svg',
            alt: t('no-artificial-flavours'),
            width: 40,
            height: 46,
            title: t('no-artificial-flavours'),
          },
        ]}
      />
      <Block className="bg-gray bg-opacity-20">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gray">How Your Plan Works</h2>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button href="/get-started">{t('build-my-plan')}</Button>
          </div>
          <p className="mt-[2.5vw] text-center text-[32px] font-normal text-gray max-md:text-[32px] max-sm:mt-8">
            {t.rich('not-ready-for-a-subscription-no-problem-try-our', {
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
          <h2 className="heading-1 text-center font-black text-gold">Proof Is In The Eating</h2>
          <p className="body-1 mx-auto mt-5 max-w-screen-md text-center text-gold">
            Choose OCELLE and watch your dog thrive – from better gut health (cleaner poops!) and
            luxurious fur, to optimised energy for life. But you don&apos;t have to take our word
            for it:
          </p>
          <CaseSwiper />
          <div className="mt-8 text-center">
            <Button href="/get-started">{t('see-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <div className="bg-[url('./recommended-plan-bg.jpg')] bg-cover bg-center py-40 max-md:py-16">
        <Container>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white p-8 py-12 text-center sm:p-16 md:px-[140px]">
            <strong className="heading-3 text-primary">See Your Dog’s Recommended Plan!</strong>
            <p className="body-1 mt-5">
              Get fresh food conveniently delivered with our customised meal plans.
            </p>
            <div className="mt-8 text-center">
              <Button href="/get-started">{t('create-your-plan')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <Newsletter />
    </main>
  );
}
