import Button from '@/components/Button';
import Image from 'next/image';
import HowPlanWorks from '../HowPlanWorks';
import Section from './Section';
import H2 from '@/components/Heading/H2';
import Container from '@/components/Container';
import Block from '@/components/Block';

export default function HowWorks() {
  return (
    <main>
      <div className="bg-[#E8E4DB]">
        <div className="flex flex-wrap items-center max-lg:flex-col-reverse">
          <div className="w-2/5 py-[4vw] pl-[2vw] text-xl text-primary max-lg:w-full">
            <h1 className="text-[5vw] font-bold leading-[6.2vw]">Get Personal With An Expert</h1>
            <p className="mt-5">
              Nutrition is not a one-size-fits-all affair! At OCELLE, we&apos;ll tailor a meal plan
              centred on your dog&apos;s health goals and fine-tune it according to your dog&apos;s
              ongoing needs!
            </p>
            <p className="mt-3">
              Our unique, customised recipes are crafted with input from our Vet Nutritionist, to
              ensure your dog gets nothing less than the quality nutrition they deserve.
            </p>
            <div className="mt-5">
              <Button href="/get-started">Get Started</Button>
            </div>
          </div>
          <div className="w-3/5 self-start pb-[2vw] max-lg:w-full">
            <div className="relative pt-[54.8%]">
              <Image src="/how-it-works-banner-img.png" alt="feed dog" fill />
            </div>
          </div>
        </div>
      </div>
      <HowPlanWorks />
      <Section image="/dogs/three-dogs.jpeg" alt="three of dogs">
        <H2 className="text-primary">A Lifetime Of Tailored Nutrition!</H2>
        <p className="mt-5 text-xl">
          From puppy food to senior dog food – we’re with you every step of the way! Regardless of
          what life stage they’re in, we’ll help you keep their meal plan relevant, so they get the
          maximum benefits from their diet.
        </p>
        <div className="mt-5">
          <Button href="/get-started">Get Started</Button>
        </div>
      </Section>
      <Section
        image="/dogs/favourite-dog.jpeg"
        alt="three of dogs"
        reverse
        className="bg-[#E5EDF3]"
      >
        <H2 className="text-[#be873b]">All The Goodness They Need, All The Flavour They Desire!</H2>
        <p className="mt-5 text-xl">
          Choose from five protein-rich fresh recipes, meticulously crafted with whole foods,
          slow-cooked to enhance both nutrition and taste.
        </p>
        <p className="mt-5 text-xl">
          With an array of mouth-watering options, you can mix-and-match according to your
          dog&apos;s needs, as desired. After all, you know your dog best of all!
        </p>
        <div className="mt-5">
          <Button href="/get-started">Get Started</Button>
        </div>
      </Section>
      <Block className="bg-[#F8F3EB]">
        <Container>
          <H2 className="text-center text-[#269D9E]">A Customised Plan To Suit Your Dog And You</H2>
          <div className="mt-3 flex flex-wrap justify-center">
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full">
              <div className="relative h-full w-full rounded-[40px] border border-[#269D9E] bg-white p-10 pt-16 text-center">
                <div className="absolute left-0 top-4 w-full text-center">
                  <div className="font-open-sans inline-block rounded-[30px] bg-secondary px-7 py-0.5 text-center text-xl italic text-white">
                    RECOMMENDED
                  </div>
                </div>
                <div className="relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
                  <Image alt="Full Plan Meal" src="/meal-plan/full-plan.jpg" fill />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#269D9E]">FRESH FULL PLAN</h3>
                <p className="mt-2">
                  Everything needed in one simple serving. Reap the full benefits of fresh,
                  nutritious meals for your dog, meticulously crafted and portioned by experts.
                </p>
              </div>
            </div>
            <div className="w-[45%] max-w-[520px] self-stretch p-8 max-lg:w-full">
              <div className="relative h-full w-full rounded-[40px] border border-[#269D9E] bg-white p-10 pt-16 text-center">
                <div className="relative mx-auto h-[240px] w-[240px] overflow-hidden rounded-[30px] shadow-[7px_7px_10px_rgba(0,0,0,0.2)]">
                  <Image alt="Full Plan Meal" src="/meal-plan/half-plan.jpg" fill />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-[#269D9E]">FRESH HALF PLAN</h3>
                <p className="mt-2">
                  Everything needed to supplement your dog’s current diet! Reinvigorate your
                  dog&apos;s current meals with a fresh, nutrient-packed addition.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Button href="/get-started">Get Started</Button>
          </div>
        </Container>
      </Block>
      <Section
        image="/dogs/eating-dog.jpeg"
        alt="eating dog"
        heading={<H2 className="mb-10 text-center text-primary">When OCELLE Arrives</H2>}
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
          <Button>See My Recipes</Button>
        </div>
      </Section>
      <Block className="bg-[#F8F3EB]">
        <Container>
          <H2 className="mb-10 text-center font-bold text-[#be873b]">
            A Paws-itively Simple Subscription
          </H2>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white p-12 text-center">
            <p className="text-xl">
              Fancy a change? You can easily tweak your delivery timings or choose new recipes based
              on what&apos;s perfect for you and your dog. More dogs? No problem! Add them to your
              account for easy fresh meal management.
            </p>
            <Button className="mt-8">Create Your Plan</Button>
          </div>
        </Container>
      </Block>
    </main>
  );
}
