import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import PlayerButton from './PlayerButton';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';

export default function OurStory() {
  const b = useTranslations('Button');
  const a = useTranslations('AboutUs');

  return (
    <main className="overflow-x-hidden">
      <Block className="flex flex-col justify-center bg-gold bg-opacity-10">
        <Container>
          <h1 className="heading-headline heading-weight-1 text-center text-primary">
            {a('we-do-it-for-them')}
          </h1>
          <div className="pt-tight"></div>
          <div className="rounded-[30px] border border-primary bg-white p-12 max-xl:p-10 max-md:p-8 max-xs:p-6">
            <strong className="heading-2 text-left text-primary">
              <div className="inline-block">Ocelle&nbsp;</div>
              <div className="inline-block min-w-[240px]">
                | oh-chell-i | <PlayerButton />
              </div>
            </strong>
            <div className="mt-2">
              <p className="heading-3 text-primary">
                {/* <Sound className="mr-3 inline-block w-[1.2em] max-sm:hidden" /> */}
                {a('noun-latin')}
              </p>
            </div>
            <div className="pt-4"></div>
            <div className="table text-left">
              <div className="table-row-group">
                <div className="table-row">
                  <div className="table-cell">
                    <strong className="heading-4 text-primary">1.</strong>
                  </div>
                  <div className="table-cell">
                    <strong className="heading-4 text-primary lang-zh:font-normal">
                      {a('block-1-title-1')}
                    </strong>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell"></div>
                  <div className="table-cell pt-4">
                    <p className="body-1 flex">
                      <span className="mr-2 font-medium">a.</span>
                      <span>{a.rich('block-1-content-1')}</span>
                    </p>
                    <div className="pt-4"></div>
                    <p className="body-1 flex">
                      <span className="mr-2 font-medium">b.</span>
                      <span>{a.rich('block-1-content-3')}</span>
                    </p>
                  </div>
                </div>
                <div className="table-row">
                  <div className="table-cell pt-4"></div>
                </div>
                <div className="table-row">
                  <div className="table-cell">
                    <strong className="heading-4 relative -left-[3px] text-primary">2.</strong>
                  </div>
                  <div className="table-cell">
                    <strong className="heading-4 text-primary lang-zh:font-normal">
                      {a('block-1-title-2')}
                    </strong>
                    <span className="body-1"> {a.rich('block-1-content-4')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <div className="m-0 bg-[#d8b99a] p-0">
        <TwoToneBlock
          breakpoint="lg"
          className={{
            bgLeft: 'bg-brown',
            bgRight: clsx(
              "min-h-[520px] bg-[#e1bd98] bg-[url('/about-us/charlie.jpg')] bg-[length:auto_100%] bg-[-50px] bg-no-repeat max-2xl:bg-[-4vw] max-xl:bg-[calc(calc(650px-47vw)_*_-1)]",
              "max-lg:h-[50vw] max-lg:max-h-[520px] max-lg:min-h-[380px] max-lg:bg-[url('/about-us/charlie-center.jpg')] max-lg:bg-center"
            ),
            mbLeft: 'px-4',
          }}
          left={
            <div className="py-normal text-white">
              <h2 className="heading-1 font-bold lang-zh:font-normal lg:hidden">
                {a.rich('block-2-title-1')}
              </h2>
              <h2 className="heading-1 font-bold lang-zh:font-normal max-lg:hidden">
                {a.rich('block-2-title-1-lg')}
              </h2>
              <div className="mt-8"></div>
              <p className="body-1">{a('block-2-content-1')}</p>
              <div className="mt-4"></div>
              <p className="body-1">{a('block-2-content-2')}</p>
              <div className="mt-4"></div>
              <p className="body-1">{a('block-2-content-3')}</p>
            </div>
          }
        />
      </div>
      <div className="relative z-0 flex items-center bg-primary bg-cover bg-center bg-repeat-x max-md:flex-col-reverse lg:bg-[url('/about-us/about-us-bg.svg')] xl:h-[680px]">
        <Image
          src="/about-us/food-1.png"
          alt="food-1"
          width={300}
          height={250}
          className="absolute -left-[50px] bottom-[10%] lg:hidden"
        />
        <Image
          src="/about-us/food-2.png"
          alt="food-2"
          width={320}
          height={220}
          className="left-30 clip-path: insea(0 40% 0 0) min-lg:hidden absolute -right-[60px] bottom-[15%] max-md:block max-[450px]:hidden lg:hidden"
        />
        <Image
          src="/about-us/food-3.png"
          alt="food-3"
          width={220}
          height={220}
          className="left-30 absolute -right-[40px] -top-[40px] lg:hidden"
          loading="eager"
        />
        <div className="z-40 flex w-1/2 justify-end max-md:w-full max-md:justify-center">
          <div className="mr-8 w-full max-w-[350px] pt-10 max-md:mx-4 max-md:pt-4 md:max-lg:pl-1 xl:max-w-[380px]">
            <div className="relative pt-[168%]">
              <Image src="/about-us/dog-with-owner.png" alt="Dog with owner" fill loading="eager" />
            </div>
          </div>
        </div>
        <div className="relative -left-6 -top-[25px] w-1/2 text-white max-md:left-0 max-md:w-full max-md:px-4">
          <div className="mt-6"></div>
          <h2 className="heading-1 max-w-[650px] text-center font-bold lang-zh:font-normal max-md:text-center xl:pr-8">
            <div className="absolute flex w-full max-w-[650px] -translate-y-full flex-row max-md:static max-md:mt-12 max-md:translate-y-0 md:top-[0] lg:pl-[20%] xl:pr-8">
              <Image
                src="/about-us/inspire.svg"
                alt="Inspire"
                width={130}
                height={140}
                className="max-md:mx-auto"
                loading="eager"
              />
            </div>
            {a('block-3-title-1')}
          </h2>
          <div className="mt-4"></div>
          <div className="max-w-[650px] pr-0 md:min-h-[140px] xl:min-h-[112px] xl:pr-8">
            <p className="body-1">{a('block-3-content-1')}</p>
          </div>
        </div>
      </div>
      <TwoToneBlock
        breakpoint="lg"
        className={{
          bgLeft: 'bg-secondary bg-opacity-20',
          bgRight: 'bg-stop flex items-center bg-gradient-to-b from-[#f7c1b5] from-30% to-white',
          mbLeft: 'px-4 py-6',
        }}
        bgRight={
          <div className="ml-[80px] w-full max-w-[620px] max-2xl:mx-auto max-lg:mx-auto max-lg:px-4">
            <div className="relative pt-[117.2%]">
              <Image
                src="/about-us/about-us-food.gif"
                alt="foods"
                fill
                className="select-none object-contain"
                unoptimized
              />
            </div>
          </div>
        }
        left={
          <div className="py-[clamp(20px,3.5vw,60px)]">
            <h2 className="heading-1 inline-block font-bold text-secondary max-[300px]:block">
              <span className="lang-zh:font-normal max-lg:hidden">{a.rich('block-4-title')}</span>
              <span className="lang-zh:font-normal lg:hidden">{a.rich('block-4-title-lg')}</span>
            </h2>
            <div className="mt-8"></div>
            <p className="body-1">{a.rich('block-4-content-1')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a.rich('block-4-content-2')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a.rich('block-4-content-3')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a.rich('block-4-content-4')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a.rich('block-4-content-5')}</p>
          </div>
        }
        right={
          <div className="relative w-full max-w-[600px] max-lg:mx-auto max-lg:max-w-[450px] max-lg:pt-4 lg:ml-[6%]">
            <div className="pt-[117.2%]">
              <Image
                src="/about-us/about-us-food.gif"
                alt="foods"
                fill
                className="select-none object-contain lg:hidden"
                unoptimized
              />
            </div>
          </div>
        }
      />
      <Block styles="normal" className="bg-dark-green py-10">
        <Container className="text-center text-white" screen>
          <h2 className="heading-1 font-bold lang-zh:font-normal">{a.rich('block-5-title-1')}</h2>
          <div className="mb-1 mt-10">
            <Button href="/get-started">{b('start-your-fresh-journey')}</Button>
          </div>
        </Container>
      </Block>
      <Block>
        <Container className="text-center text-primary">
          <h2 className="heading-1 font-bold lang-zh:font-normal">{a('block-6-title-1')}</h2>
          <div className="mt-6"></div>
          <div className="mx-auto max-w-4xl">
            <p className="body-1">
              {a.rich('block-6-content-1', {
                link: (chunks) => <UnderlineButton label={chunks} href="/affiliate-program" />,
              })}
            </p>
          </div>
          <div className="relative -z-10 -mx-32 -mt-[5%] flex justify-center overflow-hidden max-2xl:mx-0">
            <div className="w-full max-md:min-w-[110%]">
              <div className="relative pt-[76.9%]">
                <Image src="/about-us/dog-circle.jpg" alt="dogs" fill />
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
