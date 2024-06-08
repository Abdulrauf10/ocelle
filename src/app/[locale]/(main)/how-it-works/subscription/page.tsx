import { useTranslations } from 'next-intl';
import Image from 'next/image';

import HowPlanWorks from '../../HowPlanWorks';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import Block from '@/components/layouts/Block';
import ImageContentBlock from '@/components/layouts/ImageContentBlock';

export default function HowItWorksSubscription() {
  const t = useTranslations();
  const b = useTranslations('Button');
  const s = useTranslations('Subscription');
  return (
    <main>
      <div className="bg-[#EFE9DD] bg-[url('./subscription-bg.jpg')] bg-[length:auto_100%] bg-[calc(50%_+_50px)_center] bg-no-repeat max-lg:bg-[#E8E4DB] max-lg:bg-[url('./subscription-bg-mb.jpg')] max-lg:bg-[length:100%_auto] max-lg:bg-top max-lg:pt-[68%]">
        <Container>
          <div className="-mx-4 flex flex-wrap items-center max-lg:flex-col-reverse max-lg:items-center">
            <div className="w-2/5 px-4 py-[5vw] text-xl text-primary max-lg:w-full max-lg:pb-12">
              <h1 className="heading-headline heading-weight-1">{s.rich('block-1-title')}</h1>
              <div className="pt-6"></div>
              <p className="body-1 body-weight-1 italic">{s('block-1-subtitle')}</p>
              <div className="pt-5"></div>
              <p className="body-1">{s('block-1-content')}</p>
              <div className="pt-8 max-lg:flex max-lg:justify-center">
                <Button href="/get-started">{b('get-started')}</Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Block className="bg-[#EEEEEE]">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gray">{s('block-2-title')}</h2>
          <div className="pt-6"></div>
          <HowPlanWorks
            mark1={{
              title: s.rich('block-2-item-1-title'),
              content: s.rich('block-2-item-1-content'),
            }}
            mark2={{
              title: s.rich('block-2-item-2-title'),
              content: s.rich('block-2-item-2-content'),
            }}
            mark3={{
              title: s.rich('block-2-item-3-title'),
              content: s.rich('block-2-item-3-content'),
            }}
          />
          <div className="pt-3 text-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 text-center font-bold text-dark-green">
            {s.rich('block-3-title')}
          </h2>
          <div className="pt-3"></div>
          <div className="flex flex-wrap justify-center">
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full max-sm:px-0">
              <div className="relative h-full w-full rounded-[40px] border border-dark-green bg-white p-10 pt-16 text-center drop-shadow-[12px_12px_5px_rgba(0,0,0,0.2)] max-xs:px-4">
                <div className="absolute left-0 top-4 w-full text-center">
                  <div className="inline-block rounded-[30px] bg-secondary px-7 py-0.5 text-center font-open-sans text-xl uppercase italic text-white">
                    {t('recommended')}
                  </div>
                </div>
                <div className="drop-shadow-style-6 relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-black/20">
                  <Image alt="Full Plan Meal" src="/meal-plan/full-plan.jpg" fill />
                </div>
                <div className="pt-6"></div>
                <h3 className="heading-4 font-bold uppercase text-dark-green">
                  {t('fresh-full-plan')}
                </h3>
                <div className="pt-3"></div>
                <p className="body-1">{t('fresh-full-plan:description')}</p>
              </div>
            </div>
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full max-sm:px-0">
              <div className="relative h-full w-full rounded-[40px] border border-dark-green bg-white p-10 pt-16 text-center drop-shadow-[12px_12px_5px_rgba(0,0,0,0.2)] max-xs:px-4">
                <div className="drop-shadow-style-6 relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-black/20">
                  <Image alt="Full Plan Meal" src="/meal-plan/half-plan.jpg" fill />
                </div>
                <div className="pt-6"></div>
                <h3 className="heading-4 font-bold uppercase text-dark-green">
                  {t('fresh-half-plan')}
                </h3>
                <div className="pt-3"></div>
                <p className="body-1">{t('fresh-half-plan:description')}</p>
              </div>
            </div>
          </div>
          <div className="pt-5 text-center">
            <Button href="/get-started">{b('get-started')}</Button>
          </div>
        </Container>
      </Block>
      <ImageContentBlock
        image="/dogs/favourite-dog.jpg"
        alt="three of dogs"
        reverse
        breakpoint="sm"
        className={{
          block: 'bg-primary bg-opacity-10',
          image: 'drop-shadow-[12px_12px_5px_rgba(65,62,56,0.3)]',
        }}
      >
        <div className="max-sm:px-7">
          <h2 className="heading-1 font-bold text-gold">{s.rich('block-4-title')}</h2>
          <div className="pt-6"></div>
          <p className="body-1">{s('block-4-content')}</p>
          <div className="pt-6 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('see-my-recipes')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        image="/dogs/three-dogs.jpg"
        alt="three of dogs"
        breakpoint="sm"
        className={{
          image: 'drop-shadow-[12px_12px_5px_rgba(65,62,56,0.3)]',
        }}
      >
        <div className="max-sm:px-7">
          <h2 className="heading-1 font-bold text-primary">{s.rich('block-5-title')}</h2>
          <div className="pt-6"></div>
          <p className="body-1">{s.rich('block-5-content')}</p>
          <div className="pt-6 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        image="/dogs/eating-dog.jpg"
        alt="eating dog"
        breakpoint="sm"
        reverse
        className={{
          block: 'bg-primary bg-opacity-10',
          image: 'drop-shadow-[12px_12px_5px_rgba(65,62,56,0.3)]',
        }}
        startAdornment={
          <div className="mb-10">
            <h2 className="heading-1 text-center font-bold text-primary">{s('block-6-title')}</h2>
          </div>
        }
      >
        <div className="max-sm:px-7">
          <div className="max-lg:flex max-lg:justify-center">
            <Image
              src="/ocelle-truck.png"
              width={170}
              height={85}
              className="-ml-4"
              alt="ocelle truck"
            />
          </div>
          <div className="pt-6"></div>
          <p className="body-1">{s('block-6-content-1-title')}</p>
          <div className="pt-6"></div>
          <p className="body-1">{s('block-6-content-1-content')}</p>
          <div className="pt-6 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('get-started')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{s.rich('block-7-title')}</h2>
          <div className="mx-auto mt-10 max-w-[820px] rounded-[30px] bg-white p-12 max-sm:p-8">
            <div className="flex max-sm:block max-sm:items-center">
              <h3 className="inline-flex w-[190px] min-w-[190px] items-center justify-center max-sm:w-full">
                <span className="body-1 body-weight-1 text-center text-primary">
                  {s('block-7-content-1-title')}
                </span>
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-sm:mt-1">
                <p className="body-1 max-sm:text-center">{s('block-7-content-1-content')}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <h3 className="inline-flex w-[190px] min-w-[190px] items-center justify-center max-sm:w-full">
                <span className="body-1 body-weight-1 text-center text-primary">
                  {s('block-7-content-2-title')}
                </span>
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-sm:mt-1">
                <p className="body-1 max-sm:text-center">{s('block-7-content-2-content')}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <h3 className="inline-flex w-[190px] min-w-[190px] items-center justify-center max-sm:w-full">
                <span className="body-1 body-weight-1 text-center text-primary">
                  {s.rich('block-7-content-3-title')}
                </span>
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-sm:mt-1">
                <p className="body-1 max-sm:text-center">{s('block-7-content-3-content')}</p>
              </div>
            </div>
            <div className="text-center">
              <Button href="/get-started" className="mt-8">
                {b('try-it-today')}
              </Button>
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter></Newsletter>
    </main>
  );
}
