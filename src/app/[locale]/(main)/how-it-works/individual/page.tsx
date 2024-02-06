import Block from '@/components/Block';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface SectionProps {
  picture: string;
  title: string;
  description: React.ReactNode;
  price: number;
  reverse?: boolean;
  theme?: 'primary' | 'secondary' | 'red' | 'yellow' | 'green';
  className: {
    root?: string;
    title?: string;
    content?: string;
  };
}

function Section({ picture, title, description, price, reverse, className, theme }: SectionProps) {
  return (
    <Block className={className.root}>
      <Container className="max-w-screen-lg overflow-hidden">
        <div
          className={clsx(
            '-mx-6 -my-4 flex max-md:flex-col max-md:items-center max-md:text-center',
            reverse && 'flex-row-reverse'
          )}
        >
          <div className="w-[480px] min-w-[480px] px-6 py-4 max-lg:w-[420px] max-lg:min-w-[420px] max-xs:w-full max-xs:min-w-0">
            <div className="relative pt-[100%]">
              <Image
                src={picture}
                alt={title}
                fill
                className="rounded-[40px] shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
              />
            </div>
          </div>
          <div className="w-full px-6 py-4">
            <h2 className={clsx('text-3xl font-bold', className.title)}>{title}</h2>
            <p className={clsx('mt-4 text-2xl', className.title)}>${price}</p>
            <p className={clsx('mt-4', className.content)}>{description}</p>
            <div className="mt-6">
              <span className={clsx('mr-3 inline-block font-bold', className.content)}>
                Quantity:
              </span>
              <input
                type="number"
                name="quantity"
                className="w-20 rounded-lg border border-brown px-3 py-2 text-center"
                defaultValue={1}
                step={1}
                min={1}
              />
            </div>
            <div className="mt-6">
              <Button theme={theme}>Add To Cart</Button>
            </div>
          </div>
        </div>
      </Container>
    </Block>
  );
}

export default function HowItWorksIndividual() {
  const t = useTranslations();

  return (
    <main>
      <Block className="bg-primary bg-opacity-10 text-center">
        <Container>
          <Headings tag="h1" styles="h1" className="text-primary">
            Feeding Fresh Is Easy With OCELLE
          </Headings>
          <p className="mt-4 text-secondary">
            If you’re not ready for a subscription, our individual packs come in set weights and can
            be ordered anytime.
          </p>
        </Container>
      </Block>
      <Section
        picture="/recipes/individual/bundle.jpg"
        title="Taster Bundle – 500g"
        description={
          <>
            A complete assortment of nutrient-packed, freshly made food for your dog to sample.
            <br />
            <br />5 Fresh Recipes: Chicken (100g), Beef (100g), Pork (100g), Lamb (100g), Duck
            (100g).
          </>
        }
        price={250}
        className={{
          root: 'bg-[#A98D72]',
          title: 'text-white',
          content: 'text-white',
        }}
      />
      <Section
        picture="/recipes/individual/chicken.jpg"
        title="Fresh Chicken Recipe – 200g"
        description="A gentle yet satisfying combination for dogs with sensitive stomachs. The perfect blend of lean protein, whole grains, and antioxidant-rich superfoods for health, energy, and a shiny coat."
        price={100}
        theme="yellow"
        className={{
          root: 'bg-how-it-works-yellow bg-opacity-[8%]',
          title: 'text-how-it-works-yellow',
        }}
        reverse
      />
      <Section
        picture="/recipes/individual/beef.jpg"
        title="Fresh Beef Recipe – 200g"
        description="This hearty meal delivers high-quality beef for strength, a rainbow of veggies for antioxidant power, and superfoods to boost immunity. Hit the ground running with every bowl!"
        price={100}
        theme="red"
        className={{
          root: 'bg-how-it-works-red bg-opacity-[8%]',
          title: 'text-how-it-works-red',
        }}
      />
      <Section
        picture="/recipes/individual/pork.jpg"
        title="Fresh Pork Recipe – 200g"
        description="Embrace gentle nutrition with this hypoallergenic feast. It combines novel proteins with leafy greens for digestive ease, immune strength, and a coat that shines. Perfect for dogs with sensitive stomachs or allergies!"
        price={100}
        theme="primary"
        className={{
          root: 'bg-primary bg-opacity-[8%]',
          title: 'text-primary',
        }}
        reverse
      />
      <Section
        picture="/recipes/individual/lamb.jpg"
        title="Fresh Lamb Recipe – 200g"
        description="A flavour and nutrient powerhouse, capable of satisfying even the pickiest of eaters. Crafted for muscle strength, immune support, radiant health, and a shiny coat!"
        price={100}
        theme="green"
        className={{
          root: 'bg-how-it-works-green bg-opacity-[8%]',
          title: 'text-how-it-works-green',
        }}
      />
      <Section
        picture="/recipes/individual/duck.jpg"
        title="Fresh Duck Recipe – 200g"
        description="A wholesome feast, tailored for digestive health, luxurious coats, and improved vitality! Perfect for dogs seeking a unique and hypoallergenic dining experience without compromising on taste and health."
        price={100}
        className={{
          root: 'bg-secondary bg-opacity-[8%]',
          title: 'text-secondary',
        }}
        reverse
      />
      <Block className="bg-gray bg-opacity-20">
        <Container className="max-w-screen-xl text-center">
          <Headings tag="h2" styles="h1" className="text-gray">
            Your Dog Deserves A Fresh Start
          </Headings>
          <div className="mt-10">
            <div className="-mx-4 -my-4 flex flex-wrap">
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="relative pt-[89.4%]">
                  <Image
                    src="/fresh-start-1.jpg"
                    alt="dog 1"
                    fill
                    className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                  />
                </div>
                <p className="mt-6 text-xl font-bold text-gray">Developed By Vet Nutritionists</p>
                <p className="mt-3">
                  Many of the health issues dogs face are related to diet. That’s why our team is
                  devoted to determining exactly what dogs need to live happier, healthier lives.
                </p>
              </div>
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="relative pt-[89.4%]">
                  <Image
                    src="/fresh-start-2.jpg"
                    alt="dog 2"
                    fill
                    className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                  />
                </div>
                <p className="mt-6 text-xl font-bold text-gray">Crafted With Premium Ingredients</p>
                <p className="mt-3">
                  No heat-blasted ingredients. No preservatives. No fillers. No nonsense. Just real
                  ingredients you can see, nutrition dogs need, and the flavours they crave.
                </p>
              </div>
              <div className="mx-auto w-1/3 max-w-screen-xs px-4 py-4 max-md:w-full">
                <div className="relative pt-[89.4%]">
                  <Image
                    src="/fresh-start-3.jpg"
                    alt="dog 3"
                    fill
                    className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                  />
                </div>
                <p className="mt-6 text-xl font-bold text-gray">
                  Freshly Made To Lock In Nutrients
                </p>
                <p className="mt-3">
                  Our ingredients are gently cooked to maximize digestibility and preserve vital
                  nutrients, texture, and taste.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Button>{t('learn-more')}</Button>
          </div>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center text-white">
          <Headings tag="h2" styles="h1">
            Easier For You. Better For Them.
          </Headings>
          <p className="mt-2 text-xl">
            Get fresh food conveniently delivered with our customised meal plans.
          </p>
          <div className="mt-8">
            <Button>Try It Today</Button>
          </div>
        </Container>
      </Block>
    </main>
  );
}
