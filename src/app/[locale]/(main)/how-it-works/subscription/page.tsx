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
  return (
    <main>
      <div className="bg-[#EFE9DD] bg-[url('./subscription-bg.jpg')] bg-[length:auto_100%] bg-[calc(50%_+_50px)_center] bg-no-repeat max-lg:bg-[#E8E4DB] max-lg:bg-[url('./subscription-bg-mb.jpg')] max-lg:bg-[length:100%_auto] max-lg:bg-top max-lg:pt-[68%]">
        <Container>
          <div className="-mx-4 flex flex-wrap items-center max-lg:flex-col-reverse max-lg:items-center">
            <div className="w-2/5 px-4 py-[5vw] text-xl text-primary max-lg:w-full max-lg:pb-12">
              <h1 className="heading-headline font-bold">Get Personal With An Expert</h1>
              <div className="mt-5"></div>
              <p className="body-1 font-bold italic">
                Nutrition is not a one-size-fits-all affair!
              </p>
              <div className="mt-4"></div>
              <p className="body-1">
                Our unique, customised recipes are crafted by our Vet Nutritionist and tailored to
                your dog&apos;s health goals and ongoing needs.
              </p>
              <div className="mt-8 max-lg:flex max-lg:justify-center">
                <Button href="/get-started">{b('get-started')}</Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Block className="bg-[#EEEEEE]">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gray">How OCELLE Works</h2>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 text-center font-bold text-dark-green">
            Choose A Plan That Suits <br className="max-sm:hidden" />
            Your Dog And You
          </h2>
          <div className="mt-3 flex flex-wrap justify-center">
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full max-sm:px-0">
              <div className="relative h-full w-full rounded-[40px] border border-dark-green bg-white p-10 pt-16 text-center max-xs:px-4">
                <div className="absolute left-0 top-4 w-full text-center">
                  <div className="inline-block rounded-[30px] bg-secondary px-7 py-0.5 text-center font-open-sans text-xl uppercase italic text-white">
                    {t('recommended')}
                  </div>
                </div>
                <div className="relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
                  <Image alt="Full Plan Meal" src="/meal-plan/full-plan.jpg" fill />
                </div>
                <div className="mt-6"></div>
                <h3 className="heading-4 font-bold text-dark-green">FRESH FULL PLAN</h3>
                <div className="mt-2"></div>
                <p className="body-1">
                  Everything needed in one simple serving. Reap the full benefits of fresh,
                  nutritious meals for your dog, meticulously crafted and portioned by experts.
                </p>
              </div>
            </div>
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full max-sm:px-0">
              <div className="relative h-full w-full rounded-[40px] border border-dark-green bg-white p-10 pt-16 text-center max-xs:px-4">
                <div className="relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
                  <Image alt="Full Plan Meal" src="/meal-plan/half-plan.jpg" fill />
                </div>
                <div className="mt-6"></div>
                <h3 className="heading-4 font-bold text-dark-green">FRESH HALF PLAN</h3>
                <div className="mt-2"></div>
                <p className="body-1">
                  Everything needed to supplement your dog’s current diet! Reinvigorate your
                  dog&apos;s current meals with a fresh, nutrient-packed addition.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Button href="/get-started">{b('see-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <ImageContentBlock
        image="/dogs/favourite-dog.jpeg"
        alt="three of dogs"
        reverse
        breakpoint="sm"
        className={{
          block: 'bg-primary bg-opacity-10',
        }}
      >
        <div className="max-sm:px-7">
          <h2 className="heading-1 font-bold text-gold max-lg:text-center">
            All The Flavour <br />
            They Desire!
          </h2>
          <div className="mt-5"></div>
          <p className="body-1">
            Choose from five protein-rich fresh recipes, meticulously crafted with whole foods,
            slow-cooked to enhance both nutrition and taste. Mix-and-match according to your dog’s
            needs. After all, you know your dog best of all!
          </p>
          <div className="mt-5 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('see-my-recipes')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <ImageContentBlock image="/dogs/three-dogs.jpeg" alt="three of dogs" breakpoint="sm">
        <div className="max-sm:px-7">
          <h2 className="heading-1 font-bold text-primary max-lg:text-center">
            A Lifetime Of &nbsp;
            <br className="max-[360px]:hidden min-[632px]:hidden" />
            Tailored Nutrition!
          </h2>
          <div className="mt-5"></div>
          <p className="body-1 max-lg:text-center">
            From puppy food to senior dog food – we’re with you every step of the way. Our meals
            evolve with your dog, delivering maximum benefits at every bowl.
          </p>
          <div className="mt-5 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('build-my-plan')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <ImageContentBlock
        image="/dogs/eating-dog.jpeg"
        alt="eating dog"
        breakpoint="sm"
        reverse
        className={{
          block: 'bg-primary bg-opacity-10',
        }}
        startAdornment={
          <div className="mb-10">
            <h2 className="heading-1 text-center font-bold text-primary">When OCELLE Arrives</h2>
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
          <div className="mt-5"></div>
          <p className="body-1">Get ready for some serious tail-wagging!</p>
          <div className="mt-5"></div>
          <p className="body-1">
            Pop your fresh food in the freezer, then defrost in the fridge 24 hours before mealtime.
            Dinner is served!
          </p>
          <div className="mt-5 max-lg:flex max-lg:justify-center">
            <Button href="/get-started">{b('get-started')}</Button>
          </div>
        </div>
      </ImageContentBlock>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">
            Your Dog. Your Plan. Your Schedule.
          </h2>
          <div className="mx-auto mt-10 max-w-[820px] rounded-[30px] bg-white p-12 max-sm:p-8">
            <div className="flex items-center max-sm:block">
              <h3 className="body-1 w-[190px] min-w-[190px] text-center font-bold text-primary max-sm:w-full">
                Fancy A Change?
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-lg:mt-1">
                <p className="body-1 max-lg:text-center">
                  Easily tweak your delivery timings or choose new recipes based on what&apos;s
                  perfect for you and your dog.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <h3 className="body-1 w-[190px] min-w-[190px] text-center font-bold text-primary max-sm:w-full">
                More Dogs?
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-lg:mt-1">
                <p className="body-1 max-lg:text-center">
                  No problem! Add them to your account for easy fresh meal management.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <h3 className="body-1 w-[190px] min-w-[190px] text-center font-bold text-primary max-sm:w-full">
                A <i>Paws-itively</i> Simple Subscription
              </h3>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="max-lg:mt-1">
                <p className="body-1 max-lg:text-center">
                  Skip deliveries, cancel, and come back any time!
                </p>
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
