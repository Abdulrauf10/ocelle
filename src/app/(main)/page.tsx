import Button from '@/components/Button';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Image from 'next/image';
import CaseSwiper from './CaseSwiper';
import MarqueeContent from './MarqueeContent';
import HowPlanWorks from './HowPlanWorks';
import H2 from '@/components/Heading/H2';
import Block from '@/components/Block';
import Picture from './Picture';
import List from '@/components/List';
import Tickbox from '@/components/Icon/Tickbox';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Picture />
      <div className="bg-[#269D9E] py-[2vw] max-lg:py-8">
        <Container className="text-center text-white">
          <H2>They’re My Dogs. They’re My Family.</H2>
          <p className="mt-8 text-xl">
            Trade guesswork for peace of mind. Relax, knowing that your dog is getting the highest
            quality <br className="max-lg:hidden" />
            nutrition for a longer and more vibrant life! It’s science... and it’s delicious.
          </p>
        </Container>
      </div>
      <div className="flex flex-wrap">
        <div className="min-h-[300px] w-1/2 bg-[url('./gofresh-img.jpg')] bg-cover bg-[center_right] max-md:w-full"></div>
        <div className="w-1/2 px-[4vw] py-[6vw] text-xl max-md:w-full">
          <H2 className="text-primary">
            More Years, <br />
            Happier Years. <br />
            It’s Time To Go Fresh.
          </H2>
          <div className="mt-[2vw]">
            <List
              picture={<Tickbox className="mr-4 h-5 w-5" />}
              className={{ listItem: 'py-0.5' }}
              items={[
                'Increased Lifespan',
                'Delayed Onset of Chronic Disease',
                'Reduced Likelihood of Obesity',
                'Increased Bio-Health and Food Safety',
                'Increased Vitality and Happiness',
              ]}
            />
          </div>
          <div className="mb-5 mt-[2vw]"></div>
          <Button>Learn More</Button>
        </div>
      </div>
      <Block className="bg-[#E5EDF3]">
        <Container>
          <H2 className="text-center text-primary">
            We’re Powered By Science <br className="max-md:hidden" />
            Customised Meal Plans For Your Dogs.
          </H2>
          <div className="relative mt-10 flex-col-reverse items-center max-xl:flex">
            <div className="pb-0 max-xl:flex max-xl:flex-wrap [&>*]:max-xl:m-0 [&>*]:max-xl:mt-3 [&>*]:max-xl:w-1/2 [&>*]:max-xl:max-w-none [&>*]:max-xl:px-4 [&>*]:max-xl:py-3 [&>*]:max-xl:text-center [&>*]:max-sm:w-full [&_img]:max-xl:inline">
              <div className="ml-12 mt-5 max-w-[450px]">
                <Image alt="good food" src="/meal-plan/icon-1.png" width={81} height={70} />
                <h3 className="mt-2 text-2xl text-primary">Real, Good Food – Freshly Made</h3>
                <p className="mt-3">
                  Fresh, human-grade ingredients cooked slowly to maintain nutritional integrity and
                  maximise flavour. Crafted with minimal processing and maximum safety in mind –
                  it’s food even you could eat.
                </p>
              </div>
              <div className="mt-8 max-w-[450px]">
                <Image alt="good food" src="/meal-plan/icon-2.png" width={74} height={70} />
                <h3 className="mt-2 text-2xl text-primary">Customised Meal Plans</h3>
                <p className="mt-3">
                  Each pre-made, pre-portioned meal is aligned with your pet’s unique health goals,
                  right down to the last calorie, as determined by the profile you create.
                </p>
              </div>
              <div className="ml-[90px] mt-8 max-w-[420px]">
                <Image alt="good food" src="/meal-plan/icon-3.png" width={102} height={70} />
                <h3 className="mt-2 text-2xl text-primary">Delivered Within Days</h3>
                <p className="mt-3">
                  From our kitchen to your fridge in days - that&apos;s how fresh we like it. We
                  oversee every facet of production to make sure only the best lands in your dog’s
                  bowl.
                </p>
              </div>
              <div className="ml-[150px] mt-8">
                <Image alt="good food" src="/meal-plan/icon-4.png" width={67} height={70} />
                <h3 className="mt-2 text-2xl text-primary">Vet-Approved</h3>
                <p className="mt-3">Nutrition that exceeds industry standards (AAFCO / FEDIAF).</p>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-[65%] max-xl:static">
              <div className="relative pt-[89%]">
                <Image alt="dog with variety of food" src="/mealplan-img.png" fill />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button>See Your Recipes</Button>
          </div>
        </Container>
      </Block>
      <div className="overflow-hidden bg-primary py-4">
        <div className="flex animate-marquee flex-nowrap [&_img]:max-w-none">
          <MarqueeContent icon="icon-1.png" alt="Food" width={53} height={46}>
            Real, Good Food
          </MarqueeContent>
          <MarqueeContent icon="icon-2.png" alt="Approved" width={43} height={46}>
            Vet Approved
          </MarqueeContent>
          <MarqueeContent icon="icon-3.png" alt="Human-Grade" width={38} height={46}>
            Human-Grade
          </MarqueeContent>
          <MarqueeContent icon="icon-4.png" alt="Fresh" width={38} height={48}>
            Made Fresh
          </MarqueeContent>
          <MarqueeContent icon="icon-5.png" alt="High-Quality" width={36} height={48}>
            High-Quality Ingredients
          </MarqueeContent>
          <MarqueeContent icon="icon-6.png" alt="No Fillers" width={40} height={46}>
            No Fillers
          </MarqueeContent>
          <MarqueeContent icon="icon-7.png" alt="No Preservatives" width={40} height={46}>
            No Preservatives
          </MarqueeContent>
          <MarqueeContent icon="icon-8.png" alt="No Artificial Flavours" width={40} height={46}>
            No Artificial Flavours
          </MarqueeContent>
          <MarqueeContent icon="icon-1.png" alt="Food" width={53} height={46}>
            Real, Good Food
          </MarqueeContent>
          <MarqueeContent icon="icon-2.png" alt="Approved" width={43} height={46}>
            Vet Approved
          </MarqueeContent>
          <MarqueeContent icon="icon-3.png" alt="Human-Grade" width={38} height={46}>
            Human-Grade
          </MarqueeContent>
          <MarqueeContent icon="icon-4.png" alt="Fresh" width={38} height={48}>
            Made Fresh
          </MarqueeContent>
          <MarqueeContent icon="icon-5.png" alt="High-Quality" width={36} height={48}>
            High-Quality Ingredients
          </MarqueeContent>
          <MarqueeContent icon="icon-6.png" alt="No Fillers" width={40} height={46}>
            No Fillers
          </MarqueeContent>
          <MarqueeContent icon="icon-7.png" alt="No Preservatives" width={40} height={46}>
            No Preservatives
          </MarqueeContent>
          <MarqueeContent icon="icon-8.png" alt="No Artificial Flavours" width={40} height={46}>
            No Artificial Flavours
          </MarqueeContent>
        </div>
      </div>
      <Block className="bg-[#ebeae7]">
        <Container>
          <H2 className="text-center text-[#9a9486]">How Your Plan Works</H2>
          <div className="mt-6">
            <HowPlanWorks />
          </div>
          <div className="mt-2 text-center">
            <Button>Build My Plan</Button>
          </div>
          <p className="mt-[2.5vw] text-center text-2xl font-bold text-[#9a9486] max-md:text-xl max-sm:mt-8">
            Not ready for a subscription? No problem! Try our{' '}
            <span className="whitespace-nowrap">
              <Link href="#" className="text-secondary hover:underline">
                individual packs first
              </Link>
              .
            </span>
          </p>
        </Container>
      </Block>
      <Block className="bg-[#f8f3eb]">
        <Container>
          <H2 className="text-center text-[#be873b]">Proof Is In The Eating</H2>
          <p className="mx-auto mt-5 max-w-screen-md text-center text-xl text-[#be873b]">
            Choose Ocelle and watch your dog thrive – from better gut health (cleaner poops!) and
            luxurious fur, to optimised energy for life. But you don&apos;t have to take our word
            for it:
          </p>
          <CaseSwiper />
          <div className="mt-8 text-center">
            <Button>Build My Plan</Button>
          </div>
        </Container>
      </Block>
      <div className="bg-[url('./recommended-plan-bg.jpg')] bg-cover bg-center py-40 max-md:px-6 max-md:py-16">
        <Container>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white px-[150px] py-12 text-center max-md:p-10">
            <strong className="text-3xl text-primary">See Your Dog’s Recommended Plan!</strong>
            <p className="mt-5">
              Get fresh food conveniently delivered with our customised meal plans.
            </p>
            <div className="mt-8 text-center">
              <Button>Create Your Plan</Button>
            </div>
          </div>
        </Container>
      </div>
      <Newsletter />
    </main>
  );
}
