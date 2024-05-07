import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DogFoot from '@/components/icons/DogFoot';
import Block from '@/components/layouts/Block';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';
import { Link } from '@/navigation';

export default function RawDogFoodVsGentlyCooked() {
  const t = useTranslations();
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-RawVsGentlyCookedDiets');

  return (
    <main>
      <div className="relative overflow-hidden">
        <div className="absolute -inset-full flex rotate-[10deg] max-md:-rotate-[10deg] max-md:flex-col">
          <div className="flex-1 bg-primary"></div>
          <div className="flex-1 bg-dark-green bg-opacity-25"></div>
        </div>
        <Container className="py-10">
          <div className="relative flex items-center max-md:flex-col">
            <div className="flex-1">
              <div className="flex flex-col max-md:flex-row max-md:items-center">
                <h2 className="heading-headline text-center font-bold text-white max-md:text-left">
                  {i.rich('block-1-title-1')}
                </h2>
                <div className="relative min-h-[480px] flex-1 max-md:left-4 max-md:min-h-[155px] max-md:min-w-[155px]">
                  <Image
                    src="/why-fresh/raw-dog-food.png"
                    alt=""
                    fill
                    className="object-contain object-[calc(50%_+_15px)_calc(50%_+_15px)] max-md:object-center"
                  />
                </div>
              </div>
            </div>
            <div className="px-[5%] py-[65px]"></div>
            <div className="flex-1">
              <div className="flex flex-col max-md:flex-row max-md:items-center">
                <h2 className="heading-headline text-center font-bold text-dark-green max-md:text-left">
                  {i.rich('block-1-title-2')}
                </h2>
                <div className="relative min-h-[480px] flex-1 max-md:left-4 max-md:min-h-[155px] max-md:min-w-[155px]">
                  <Image
                    src="/why-fresh/gently-cooked.png"
                    alt=""
                    fill
                    className="object-contain object-[calc(50%_+_15px)_calc(50%_+_15px)] max-md:object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
        <div className="shadow-block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-6">
          <span className="heading-headline relative -top-1 text-center font-bold text-primary">
            vs.
          </span>
        </div>
      </div>
      <Block className="bg-primary bg-opacity-[12%]">
        <Container>
          <div className="-mx-4 flex items-center max-md:flex-col">
            <div className="mx-4 flex-1 max-md:mb-6">
              <p className="body-1">{i.rich('block-2-content-1')}</p>
              <p className="body-1 mt-6">{i.rich('block-2-content-2')}</p>
              <p className="body-1 mt-6">{i.rich('block-2-content-3')}</p>
            </div>
            <div className="mx-4 flex-1">
              <div className="ml-10 mr-4 rounded-[40px] border-[3px] border-primary bg-white px-12 py-8 max-xl:ml-4 max-xl:mr-0 max-md:max-w-xl">
                <p className="heading-4 text-center italic text-primary">
                  {i.rich('block-2-quota')}
                </p>
                <p className="body-1 mt-4 text-center text-primary">
                  {i.rich('block-2-quota-person')}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <TwoToneBlock
        className={{
          bg: 'inset-0',
          bgLeft: 'bg-secondary bg-opacity-[12%]',
          bgRight:
            'bg-[url("./why-fresh-food-roulette.jpg")] bg-[length:auto_100%] max-md:bg-[url("./why-fresh-food-roulette-mb.jpg")]',
          container: 'py-10',
          mbLeft: 'px-4 py-10',
          mbRight: 'py-6 max-md:pt-[98%]',
        }}
        left={
          <div className="py-24 max-md:py-0">
            <h2 className="heading-headline font-bold text-gold max-md:text-center">
              {i.rich('block-3-title')}
            </h2>
            <p className="body-1 pt-6">{i.rich('block-3-content-1')}</p>
          </div>
        }
      />
      <Block className="bg-primary bg-opacity-[12%]">
        <Container>
          <h2 className="heading-1 text-center font-bold text-primary">
            {i.rich('block-4-title')}
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="mt-10 flex items-center justify-center">
              <DogFoot className="mr-4 w-10 min-w-10 fill-primary" />
              <p className="body-1">{i.rich('block-4-content-1')}</p>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <DogFoot className="mr-4 w-10 min-w-10 fill-primary" />
              <p className="body-1">{i.rich('block-4-content-2')}</p>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <DogFoot className="mr-4 w-10 min-w-10 fill-primary" />
              <p className="body-1">{i.rich('block-4-content-3')}</p>
            </div>
          </div>
        </Container>
      </Block>
      <Block className="bg-brown bg-opacity-[12%]">
        <Container className="!max-w-4xl">
          <p className="heading-3 text-center text-gold">{i.rich('block-5-content-1')}</p>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 font-bold">{i.rich('block-6-title')}</h1>
          <p className="body-1 mt-6">{i.rich('block-6-content-1')}</p>
          <Button className="mt-6" href="/get-started">
            {b('try-it-today')}
          </Button>
        </Container>
      </Block>
      <Block className="overflow-hidden bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{w.rich('block-1-title')}</h2>
          <p className="body-1 mt-4 text-center">
            {w.rich('block-1-content-1', {
              button: (chunks) => <UnderlineButton label={chunks} href="/why-fresh/reference" />,
            })}
          </p>
          <div className="-mx-6 mb-10 mt-16 flex flex-wrap items-stretch max-md:mb-0 max-md:mt-6">
            <div className="w-1/3 p-6 max-md:w-full">
              <Link
                href="/why-fresh/benefits-of-fresh-dog-food"
                className="shadow-block mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/benefits-of-fresh-dog-food.jpg" alt="" fill />
                </div>
                <div className="body-1 flex h-full items-center justify-center px-4 py-6 text-center">
                  {w.rich('benefits-of-fresh-dog-food')}
                </div>
              </Link>
            </div>
            <div className="w-1/3 p-6 max-md:w-full">
              <Link
                href="/why-fresh/its-time-to-rethink-kibble"
                className="shadow-block mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/its-time-to-rethink-kibble.jpg" alt="" fill />
                </div>
                <div className="body-1 flex h-full items-center justify-center px-4 py-6 text-center">
                  {w.rich('its-time-to-rethink-kibble')}
                </div>
              </Link>
            </div>
            <div className="w-1/3 p-6 max-md:w-full">
              <Link
                href="/why-fresh/challenges-with-home-cooking-for-your-dog"
                className="shadow-block mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white"
              >
                <div className="relative pt-[68.5%]">
                  <Image
                    src="/why-fresh/challenges-with-home-cooking-for-your-dog.jpg"
                    alt=""
                    fill
                  />
                </div>
                <div className="body-1 flex h-full items-center justify-center px-4 py-6 text-center">
                  {w.rich('challenges-with-home-cooking-for-your-dog')}
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
