import Button from '@/components/Button';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Image from 'next/image';
import CaseSwiper from './CaseSwiper';
import HowPlanWorks from './HowPlanWorks';
import Block from '@/components/Block';
import Picture from './Picture';
import List from '@/components/List';
import Tickbox from '@/components/icons/Tickbox';
import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';
import Marquee from '@/components/Marquee';

export default function Home() {
  const t = useTranslations();

  return (
    <main>
      <Picture />
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <Headings tag="h1" styles="h1">
            {t('they-re-my-dogs')}
            <br className="md:hidden" />
            {t('they-re-my-family')}
          </Headings>
          <p className="mt-8 text-xl">
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
            <Headings tag="h2" styles="h1" className="text-primary">
              {t('more-years')}
              <br className="hidden md:block xl:hidden" />
              {t('happier-years')}
              <br />
              {t('it-s-time-to-go-fresh')}
            </Headings>
            <div className="mt-[2vw]">
              <List
                picture={<Tickbox className="mr-4 mt-1 h-5 w-5" />}
                className={{ listItem: 'py-0.5' }}
                items={[
                  'increased-lifespan',
                  'delayed-onset-of-chronic-disease',
                  'reduced-likelihood-of-obesity',
                  'increased-bio-health-and-food-safety',
                  'increased-vitality-and-happiness',
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
          <Headings tag="h2" styles="h1" className="text-center text-primary">
            {t('we-re-powered-by-science')}
            <br className="hidden lg:block" />
            {t('customised-meal-plans-for-your-dogs')}
          </Headings>
          <div className="relative mt-10 flex-col-reverse items-center max-xl:flex">
            <div className="pb-0 max-xl:flex max-xl:flex-wrap [&>*]:max-xl:m-0 [&>*]:max-xl:mt-3 [&>*]:max-xl:max-w-none [&>*]:max-xl:px-4 [&>*]:max-xl:py-3 [&>*]:max-xl:text-center [&>*]:max-sm:w-full [&_img]:max-xl:inline">
              <div className="ml-14 mt-5 md:w-1/2 xl:w-full">
                <Image alt="good food" src="/meal-plan/icon-1.svg" width={81} height={70} />
                <h3 className="mt-2 text-2xl text-primary">{t('real-good-food-freshly-made')}</h3>
                <p className="mt-3 text-xl xl:max-w-[320px]">
                  {t('real-good-food-freshly-made-content')}
                </p>
              </div>
              <div className="mt-[6%] md:w-1/2 xl:w-full">
                <Image alt="good food" src="/meal-plan/icon-2.svg" width={74} height={70} />
                <h3 className="mt-2 text-2xl text-primary">{t('customised-meal-plans')}</h3>
                <p className="mt-3 text-xl xl:max-w-[320px]">
                  {t('customised-meal-plans-content')}
                </p>
              </div>
              <div className="ml-32 mt-[6%] flex flex-1 flex-wrap max-xl:-my-3">
                <div className="w-full max-xl:py-3 md:w-1/2 xl:w-full xl:max-w-[300px]">
                  <Image alt="good food" src="/meal-plan/icon-3.svg" width={102} height={70} />
                  <h3 className="mt-2 text-2xl text-primary">{t('delivered-within-days')}</h3>
                  <p className="mt-3 text-xl">{t('delivered-within-days-content')}</p>
                </div>
                <div className="w-full max-xl:mt-3 max-xl:py-3 md:w-1/2 xl:ml-[11%] xl:mt-[12%] xl:w-full xl:max-w-[320px]">
                  <Image alt="good food" src="/meal-plan/icon-4.svg" width={67} height={70} />
                  <h3 className="mt-2 text-2xl text-primary">{t('vet-approved')}</h3>
                  <p className="mt-3 text-xl">{t('vet-approved-content')}</p>
                </div>
                <div className="ml-[6%] mt-[21%] text-center max-xl:hidden">
                  <Button href="/get-started">{t('see-your-recipes')}</Button>
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
          <Headings tag="h2" styles="h1" className="text-center text-gray">
            How Your Plan Works
          </Headings>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button href="/get-started">{t('build-my-plan')}</Button>
          </div>
          <p className="mt-[2.5vw] text-center text-3xl font-black text-gray max-md:text-3xl max-sm:mt-8">
            Not ready for a subscription?
            <br className="md:hidden" />
            No problem! Try our{' '}
            <span className="whitespace-nowrap">
              <Link
                href="/how-it-works/individual"
                className="font-normal text-secondary hover:underline"
              >
                individual packs first
              </Link>
              .
            </span>
          </p>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <Headings tag="h2" styles="h1" className="text-center font-black text-gold">
            Proof Is In The Eating
          </Headings>
          <p className="mx-auto mt-5 max-w-screen-md text-center text-xl text-gold">
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
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white px-[150px] py-12 text-center max-md:p-10">
            <strong className="text-3xl text-primary">See Your Dog’s Recommended Plan!</strong>
            <p className="mt-5 text-xl">
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
