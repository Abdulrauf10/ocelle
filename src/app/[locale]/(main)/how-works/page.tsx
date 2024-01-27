import Button from '@/components/Button';
import Image from 'next/image';
import HowPlanWorks from '../HowPlanWorks';
import Section from './Section';
import H2 from '@/components/headings/H2';
import Container from '@/components/Container';
import Block from '@/components/Block';
import { useTranslations } from 'next-intl';

export default function HowWorks() {
  const t = useTranslations('general');

  return (
    <main>
      <div className="bg-[#E8E4DB]">
        <div className="flex flex-wrap items-center max-lg:flex-col-reverse">
          <div className="w-2/5 py-[4vw] pl-[2vw] text-xl text-primary max-lg:w-full">
            <h1 className="text-[5vw] font-bold leading-[6.2vw]">Get Personal With An Expert</h1>
            <p className="mt-5 font-bold italic">Nutrition is not a one-size-fits-all affair!</p>
            <p className="mt-3">
              Our unique, customised recipes are crafted by our Vet Nutritionist and tailored to
              your dog&apos;s health goals and ongoing needs.
            </p>
            <div className="mt-5">
              <Button href="/get-started">{t('get-started')}</Button>
            </div>
          </div>
          <div className="w-3/5 self-start pb-[2vw] max-lg:w-full">
            <div className="relative pt-[54.8%]">
              <Image src="/how-it-works-banner-img.png" alt="feed dog" fill />
            </div>
          </div>
        </div>
      </div>
      <Block className="bg-[#EEEEEE]">
        <Container>
          <H2 className="text-center text-gray">How Your Plan Works</H2>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button>{t('build-my-plan')}</Button>
          </div>
        </Container>
      </Block>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <H2 className="text-center text-dark-green">
            A Customised Plan To Suit <br className="max-sm:hidden" />
            Your Dog And You
          </H2>
          <div className="mt-3 flex flex-wrap justify-center">
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full max-sm:px-0">
              <div className="relative h-full w-full rounded-[40px] border border-dark-green bg-white p-10 pt-16 text-center max-xs:px-4">
                <div className="absolute left-0 top-4 w-full text-center">
                  <div className="inline-block rounded-[30px] bg-secondary px-7 py-0.5 text-center font-open-sans text-xl italic text-white">
                    RECOMMENDED
                  </div>
                </div>
                <div className="relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
                  <Image alt="Full Plan Meal" src="/meal-plan/full-plan.jpg" fill />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-dark-green">FRESH FULL PLAN</h3>
                <p className="mt-2">
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
                <h3 className="mt-6 text-2xl font-bold text-dark-green">FRESH HALF PLAN</h3>
                <p className="mt-2">
                  Everything needed to supplement your dog’s current diet! Reinvigorate your
                  dog&apos;s current meals with a fresh, nutrient-packed addition.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Button href="/get-started">{t('get-started')}</Button>
          </div>
        </Container>
      </Block>
      <Section
        image="/dogs/favourite-dog.jpeg"
        alt="three of dogs"
        reverse
        className="bg-primary bg-opacity-10"
      >
        <H2 className="text-gold">
          All The Flavour <br />
          They Desire!
        </H2>
        <p className="mt-5 text-xl">
          Choose from five protein-rich fresh recipes, meticulously crafted with whole foods,
          slow-cooked to enhance both nutrition and taste. Mix-and-match according to your dog’s
          needs. After all, you know your dog best of all!
        </p>
        <div className="mt-5">
          <Button href="/get-started">{t('get-started')}</Button>
        </div>
      </Section>
      <Section image="/dogs/three-dogs.jpeg" alt="three of dogs">
        <H2 className="text-primary">A Lifetime Of Tailored Nutrition!</H2>
        <p className="mt-5 text-xl">
          From puppy food to senior dog food – we’re with you every step of the way. Our meals
          evolve with your dog, delivering maximum benefits at every bowl.
        </p>
        <div className="mt-5">
          <Button href="/get-started">{t('build-my-plan')}</Button>
        </div>
      </Section>
      <Section
        image="/dogs/eating-dog.jpeg"
        alt="eating dog"
        heading={<H2 className="mb-10 text-center text-primary">When OCELLE Arrives</H2>}
        className="bg-primary bg-opacity-10"
        reverse
      >
        <Image
          src="/ocelle-truck.png"
          width={170}
          height={85}
          className="-ml-4"
          alt="ocelle truck"
        />
        <p className="mt-5 text-xl">Get ready for some serious tail-wagging!</p>
        <p className="mt-5 text-xl">
          Pop your fresh food in the freezer, then defrost in the fridge 24 hours before mealtime.
          Dinner is served!
        </p>
        <div className="mt-5">
          <Button>{t('get-started')}</Button>
        </div>
      </Section>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <H2 className="mb-10 text-center font-bold text-gold">
            Your Dog. Your Plan. Your Schedule.
          </H2>
          <div className="mx-auto max-w-[680px] rounded-[30px] bg-white p-12 max-sm:p-8">
            <div className="flex items-center max-sm:block">
              <div className="w-[150px] min-w-[150px] py-px text-center font-bold text-primary max-sm:w-full max-sm:text-left">
                Fancy A Change?
              </div>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="py-px">
                Easily tweak your delivery timings or choose new recipes based on what&apos;s
                perfect for you and your dog.
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <div className="w-[150px] min-w-[150px] py-px text-center font-bold text-primary max-sm:w-full max-sm:text-left">
                More Dogs?
              </div>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="py-px">
                No problem! Add them to your account for easy fresh meal management.
              </div>
            </div>
            <div className="mt-6 flex items-center max-sm:block">
              <div className="w-[150px] min-w-[150px] py-px text-center font-bold text-primary max-sm:w-full max-sm:text-left">
                A Paws-itively Simple Subscription
              </div>
              <div className="mx-5 w-px min-w-px self-stretch bg-primary max-sm:hidden"></div>
              <div className="py-px">Skip deliveries, cancel, and come back any time!</div>
            </div>
            <div className="text-center">
              <Button className="mt-8">Try It Today</Button>
            </div>
          </div>
        </Container>
      </Block>
    </main>
  );
}
