import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Benefits from './Benefits';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';
import { Link } from '@/navigation';

export default function BenefitsOfFreshDogFood() {
  const t = useTranslations();
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-BenefitsOfFreshDogFood');

  return (
    <main>
      <Block className="overflow-hidden bg-[#f6ece1]">
        <Container>
          <h1 className="heading-headline heading-weight-1 text-center text-brown">
            {i.rich('block-1-title')}
          </h1>
          <div className="pt-8"></div>
          <p className="body-1 text-center">{i.rich('block-1-content-1')}</p>
          <div className="pt-8"></div>
          <div className="mx-auto -mb-[3%] max-w-[1200px]">
            <div className="relative pt-[56%] max-md:mt-[8%] max-md:scale-[1.25]">
              <Image src="/benefits-of-fresh-dog-food/a-running-dog.jpg" alt="running dog" fill />
            </div>
          </div>
        </Container>
      </Block>
      <TwoToneBlock
        className={{
          bgLeft: 'bg-dark-green',
          bgRight: 'bg-[#DCEDEE]',
          container: 'py-tight',
          mbLeft: 'px-4 py-tight',
          mbRight: 'py-6',
          separator: 'max-lg:px-4',
        }}
        left={
          <div className="text-white">
            <h2 className="heading-1 font-bold lang-zh:font-normal max-md:text-center">
              {i.rich('block-2-title')}
            </h2>
            <div className="pt-8"></div>
            <p className="body-1">{i.rich('block-2-content-1')}</p>
            <div className="pt-5"></div>
            <p className="body-1">{i.rich('block-2-content-2')}</p>
          </div>
        }
        right={
          <div className="relative mx-auto max-w-[480px] max-md:mx-auto">
            <div className="pt-[100%]">
              <Image
                src="/benefits-of-fresh-dog-food/fresh-food-diet.png"
                alt=""
                fill
                className="object-contain object-[16px_13px]"
              />
            </div>
          </div>
        }
      />
      <Block className="bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold lang-zh:font-normal">
            {i.rich('block-3-title')}
          </h2>
          <div className="-mx-4 flex items-center pt-normal max-md:flex-col">
            <div className="mx-4 flex-1">
              <div className="max-sm ml-4 mr-10 rounded-[40px] border-[3px] border-gold bg-white px-12 py-10 max-xl:ml-0 max-xl:mr-4 max-md:mr-0 max-md:max-w-xl max-md:px-6">
                <p className="heading-4 text-center italic text-gold md:-mx-4">
                  {i.rich('block-3-quota')}
                </p>
                <div className="mt-4"></div>
                <p className="font-baskerville"></p>
                <p className="body-1 text-center text-gold">{i.rich('block-3-quota-person')}</p>
                <div className="mt-6 flex">
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-chicken')}</div>
                    <Image
                      src="/benefits-of-fresh-dog-food/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-fish')}</div>
                    <Image
                      src="/benefits-of-fresh-dog-food/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-beef')}</div>
                    <Image
                      src="/benefits-of-fresh-dog-food/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-4 flex-1 max-md:mt-normal max-md:text-center">
              <p className="body-1">{i.rich('block-3-content-1')}</p>
              <div className="pt-8"></div>
              <Button href="/why-fresh/its-time-to-rethink-kibble">{b('learn-more')}</Button>
            </div>
          </div>
        </Container>
      </Block>
      <Benefits></Benefits>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center">
          <h2 className="heading-1 font-bold text-white lang-zh:font-normal">
            {i.rich('block-5-title')}
          </h2>
          <Button className="mt-8" href="/get-started">
            {b('try-it-today')}
          </Button>
        </Container>
      </Block>
      <Block className="overflow-hidden bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold lang-zh:font-normal">
            {w.rich('block-1-title')}
          </h2>
          <div className="pt-4"></div>
          <p className="body-1 text-center">
            {w.rich('block-1-content-1', {
              button: (chunks) => (
                <UnderlineButton
                  className="lang-zh:font-normal"
                  label={chunks}
                  href="/why-fresh/reference#benefits-of-fresh-dog-food"
                />
              ),
            })}
          </p>
          <div className="pt-normal"></div>
          <div className="-mx-6 flex flex-wrap items-stretch max-lg:-mx-3">
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/its-time-to-rethink-kibble"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 drop-shadow-style-1 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/its-time-to-rethink-kibble.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center lang-zh:font-normal">
                    {w.rich('its-time-to-rethink-kibble')}
                  </span>
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
                  <span className="body-1 text-center lang-zh:font-normal">
                    {w.rich('raw-vs-gently-cooked-diets')}
                  </span>
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
                  <span className="body-1 text-center lang-zh:font-normal">
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
