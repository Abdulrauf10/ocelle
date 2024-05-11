import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import DogFoot from '@/components/icons/DogFoot';
import Block from '@/components/layouts/Block';
import { Link } from '@/navigation';

function Arrow() {
  return (
    <svg viewBox="0 0 10.78 17.55" className="mx-2 inline-block w-3 align-middle">
      <polyline
        className="fill-none stroke-gold stroke-2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="1 1 9.78 8.78 1 16.55"
      />
    </svg>
  );
}

export default function ChallengesWithHomeCookingForYourDog() {
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-ChallengesWithHomeCookingForYourDog');

  return (
    <main>
      <Block className="bg-[url('./challenges-with-home-cooking-for-your-dog-bg.jpg')] bg-[length:auto_100%] bg-center">
        <Container className="pb-[clamp(420px,30%,650px)]">
          <h1 className="heading-headline text-center font-bold text-dark-green">
            {i.rich('block-1-title')}
          </h1>
        </Container>
      </Block>
      <Block styles="tight" className="bg-primary bg-opacity-[12%]">
        <Container className="!max-w-6xl">
          <p className="heading-4 text-center text-primary">{i.rich('block-2-content-1')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 text-center text-primary">{i.rich('block-2-content-2')}</p>
        </Container>
      </Block>
      <Block styles="tight" className="bg-secondary bg-opacity-[12%]">
        <Container className="!max-w-6xl">
          <h2 className="heading-1 text-center font-bold text-gold">{i.rich('block-3-title')}</h2>
          <div className="mt-12 flex">
            <DogFoot className="-mt-2 mr-4 w-10 min-w-10 self-start fill-gold" />
            <p className="body-1">
              <span className="font-bold text-gold">{i.rich('block-3-mark-1-title')}</span>
              <Arrow />
              <span>{i.rich('block-3-mark-1-content')}</span>
            </p>
          </div>
          <div className="mt-12 flex">
            <DogFoot className="-mt-2 mr-4 w-10 min-w-10 self-start fill-gold" />
            <p className="body-1">
              <span className="font-bold text-gold">{i.rich('block-3-mark-2-title')}</span>
              <Arrow />
              <span>{i.rich('block-3-mark-2-content')}</span>
            </p>
          </div>
          <div className="mt-12 flex">
            <DogFoot className="-mt-2 mr-4 w-10 min-w-10 self-start fill-gold" />
            <p className="body-1">
              <span className="font-bold text-gold">{i.rich('block-3-mark-3-title')}</span>
              <Arrow />
              <span>{i.rich('block-3-mark-3-content')}</span>
            </p>
          </div>
          <div className="mt-12 flex">
            <DogFoot className="-mt-2 mr-4 w-10 min-w-10 self-start fill-gold" />
            <p className="body-1">
              <span className="font-bold text-gold">{i.rich('block-3-mark-4-title')}</span>
              <Arrow />
              <span>
                {i.rich('block-3-mark-4-content', {
                  button: (chunks) => <UnderlineButton label={chunks} />,
                })}
              </span>
            </p>
          </div>
          <div className="mt-12 flex">
            <DogFoot className="-mt-2 mr-4 w-10 min-w-10 self-start fill-gold" />
            <p className="body-1">
              <span className="font-bold text-gold">{i.rich('block-3-mark-5-title')}</span>
              <Arrow />
              <span>{i.rich('block-3-mark-5-content')}</span>
            </p>
          </div>
        </Container>
      </Block>
      <Block styles="tight" className="bg-primary bg-opacity-[12%]">
        <Container className="!max-w-6xl">
          <p className="heading-4 text-center text-primary">{i.rich('block-4-content-1')}</p>
          <div className="mt-6"></div>
          <p className="heading-4 text-center text-primary">{i.rich('block-4-content-2')}</p>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <h1 className="heading-1 font-bold">{i.rich('block-5-title')}</h1>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-content-1')}</p>
          <Button className="mt-6" href="/get-started">
            {b('try-it-today')}
          </Button>
        </Container>
      </Block>
      <Block className="overflow-hidden bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{w.rich('block-1-title')}</h2>
          <div className="mt-4"></div>
          <p className="body-1 text-center">
            {w.rich('block-1-content-1', {
              button: (chunks) => <UnderlineButton label={chunks} href="/why-fresh/reference" />,
            })}
          </p>
          <div className="pt-normal -mx-6 flex flex-wrap items-stretch max-lg:-mx-3">
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/benefits-of-fresh-dog-food"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-block"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/benefits-of-fresh-dog-food.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('benefits-of-fresh-dog-food')}</span>
                </div>
              </Link>
            </div>
            <div className="max-md:pt-normal w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/raw-dog-food-vs-gently-cooked"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-block"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/raw-vs-gently-cooked-diets.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('raw-vs-gently-cooked-diets')}</span>
                </div>
              </Link>
            </div>
            <div className="max-md:pt-normal w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/its-time-to-rethink-kibble"
                className="mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-block"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/its-time-to-rethink-kibble.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('its-time-to-rethink-kibble')}</span>
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
