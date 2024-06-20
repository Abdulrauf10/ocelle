import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import List from '@/components/List';
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
        <div className="absolute -inset-full flex rotate-[10deg] max-md:-rotate-[8deg] max-md:flex-col">
          <div className="flex-1 bg-primary"></div>
          <div className="flex-1 bg-dark-green bg-opacity-25"></div>
        </div>
        <Container className="py-normal">
          <div className="relative flex items-center max-md:flex-col">
            <div className="flex-1">
              <div className="max-md:flex max-md:flex-row max-md:items-center">
                <h2 className="heading-headline heading-weight-1 text-center text-white max-md:text-left">
                  {i.rich('block-1-title-1')}
                </h2>
                <div className="mx-auto max-w-[480px] flex-1 max-md:relative max-md:left-4 max-md:w-[250px] max-sm:w-[155px] max-sm:min-w-[155px]">
                  <div className="relative pt-[100%] max-md:-my-3 md:-mb-9">
                    <Image
                      src="/why-fresh/raw-dog-food.png"
                      alt=""
                      fill
                      className="object-contain object-[calc(50%_+_8px)_calc(50%_+_15px)] max-md:object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-[8%] py-[55px]"></div>
            <div className="flex-1">
              <div className="max-md:flex max-md:flex-row max-md:items-center">
                <h2 className="heading-headline heading-weight-1 text-center text-dark-green max-md:text-left">
                  {i.rich('block-1-title-2')}
                </h2>
                <div className="mx-auto max-w-[480px] flex-1 max-md:relative max-md:left-4 max-md:w-[250px] max-sm:w-[155px] max-sm:min-w-[155px]">
                  <div className="relative pt-[100%] max-md:-my-3 md:-mb-9">
                    <Image
                      src="/why-fresh/gently-cooked.png"
                      alt=""
                      fill
                      className="object-contain object-[calc(50%_+_8px)_calc(50%_+_15px)] max-md:object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <div className="drop-shadow-style-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-6 shadow-black/40">
          <span className="heading-headline heading-weight-1 relative -top-1.5 text-center text-primary">
            vs.
          </span>
        </div>
      </div>
      <Block className="bg-primary bg-opacity-[12%]">
        <Container>
          <div className="-mx-4 flex items-center max-md:flex-col">
            <div className="mx-4 flex-1 max-md:mb-6">
              <p className="body-1">{i.rich('block-2-content-1')}</p>
              <div className="mt-6"></div>
              <p className="body-1">{i.rich('block-2-content-2')}</p>
              <div className="mt-6"></div>
              <p className="body-1">{i.rich('block-2-content-3')}</p>
            </div>
            <div className="mx-4 flex-1">
              <div className="ml-10 mr-4 rounded-[40px] border-[3px] border-primary bg-white px-12 py-10 max-xl:ml-4 max-xl:mr-0 max-md:ml-0 max-md:max-w-xl max-md:px-6">
                <p className="heading-4 text-center italic text-primary">
                  {i.rich('block-2-quota')}
                </p>
                <div className="mt-4"></div>
                <p className="body-1 text-center text-primary">{i.rich('block-2-quota-person')}</p>
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <TwoToneBlock
        breakpoint="lg"
        className={{
          bg: 'inset-0',
          bgLeft: 'bg-secondary bg-opacity-[12%]',
          bgRight:
            'bg-[#c8d4d0] bg-[url("./why-fresh-food-roulette.jpg")] bg-[length:auto_100%] bg-no-repeat max-md:bg-[url("./why-fresh-food-roulette-mb.jpg")]',
          container: 'py-10',
          mbLeft: 'px-4 py-10',
          mbRight: 'py-6 max-lg:pt-[98%]',
        }}
        left={
          <div className="py-24 max-lg:py-0">
            <h2 className="heading-headline heading-weight-1 text-gold max-lg:text-center">
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
          <div className="pt-10"></div>
          <div className="mx-auto max-w-6xl">
            <List
              className={{
                list: '-my-5',
                row: 'py-5',
                icon: 'mr-4',
              }}
              picture={<DogFoot className="-mt-2 w-10 min-w-10 fill-primary" />}
              items={[
                <p key="block-4-content-1" className="body-1">
                  {i.rich('block-4-content-1')}
                </p>,
                <p key="block-4-content-2" className="body-1">
                  {i.rich('block-4-content-2')}
                </p>,
                <p key="block-4-content-3" className="body-1">
                  {i.rich('block-4-content-3')}
                </p>,
              ]}
            />
          </div>
        </Container>
      </Block>
      <Block className="bg-brown bg-opacity-[12%]">
        <Container className="!max-w-6xl">
          <p className="heading-4 text-center text-gold">{i.rich('block-5-content-1')}</p>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 font-bold">{i.rich('block-6-title')}</h1>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-6-content-1')}</p>
          <Button className="mt-6" href="/get-started">
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
                  href="/why-fresh/reference#raw-dog-food-vs-gently-cooked"
                />
              ),
            })}
          </p>
          <div className="pt-normal"></div>
          <div className="-mx-6 flex flex-wrap items-stretch max-lg:-mx-3">
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/benefits-of-fresh-dog-food"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
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
                href="/why-fresh/its-time-to-rethink-kibble"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/its-time-to-rethink-kibble.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('its-time-to-rethink-kibble')}</span>
                </div>
              </Link>
            </div>
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full max-md:pt-normal">
              <Link
                href="/why-fresh/challenges-with-home-cooking-for-your-dog"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
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
