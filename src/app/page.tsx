import Button from '@/components/Button';
import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Image from 'next/image';
import CaseSwiper from './CaseSwiper';
import MarqueeContent from './MarqueeContent';

export default function Home() {
  return (
    <main>
      <div className="bg-[url('./banner-bg.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x">
        <div className="flex flex-wrap items-center max-md:flex-col-reverse">
          <div className="text-primary max-md:border-primary relative w-3/5 p-[2vw] pr-0 max-md:w-full max-md:border-t-[10px] max-md:p-[30px]">
            <h1 className="text-[5vw] font-bold leading-[6.2vw] max-sm:text-[40px] max-sm:leading-[46px]">
              Good Health Begins <br className="max-md:hidden" />
              With Healthy Food.
            </h1>
            <p className="my-[20px] text-[20px]">
              Fresh, deliciously good food. Approved by our Vet Nutritionist. Delivered to your
              door.
            </p>
            <Button>Get Started</Button>
          </div>
          <div className="w-2/5 max-md:w-full">
            <div className="w-3/4 max-md:m-auto">
              <div className="relative pt-[158%]">
                <Image alt="dog" src="/home-banner-dog.png" fill />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#51B1B1] py-[20px]">
        <Container>
          <div className="flex flex-nowrap items-center justify-center text-[26px] italic text-white max-sm:text-[20px]">
            <Image alt="solid dog" src="/dog-icon.png" width={50} height={50} />
            <div className="ml-[10px]">
              “I’m loving that @Ocelle has real, human-grade dog food.”
            </div>
          </div>
        </Container>
      </div>
      <div className="flex flex-wrap">
        <div className="min-h-[300px] w-1/2 bg-[url('./gofresh-img.jpg')] bg-cover bg-[center_right] max-md:w-full"></div>
        <div className="w-1/2 px-[4vw] py-[6vw] text-[20px] max-md:w-full">
          <h2 className="text-primary text-[3vw] font-bold leading-[3.25vw]">
            It’s Time To Go Fresh.
          </h2>
          <div className="mt-[2vw] w-3/4 max-md:w-full">
            At Ocelle, your pet&apos;s health is our priority. That&apos;s why we deliver meals that
            are not only fresh and balanced, but also custom-made to suit your furry friend&apos;s
            unique needs. No heat-blasted ingredients. No preservatives. No fillers. No non sense.
          </div>
          <div className="mt-[10px] w-3/4 max-md:w-full">
            Just wholesome food that&apos;s as appetizing as it looks.
          </div>
          <div className="mb-[20px] mt-[2vw]"></div>
          <Button>
            Learn More About
            <br />
            The Importance Of Fresh Food
          </Button>
        </div>
      </div>
      <div className="bg-[#E5EDF3] py-[3.5vw]">
        <Container>
          <h2 className="text-primary text-center text-[3vw] font-bold leading-[3.25vw] max-md:text-[32px] max-md:leading-[38px]">
            Customised Meal Plans Tailored <br className="max-md:hidden" />
            For Your Dog – <span className="whitespace-nowrap">Powered By Science</span>
          </h2>
          <div className="relative mt-[40px] flex-col-reverse items-center max-xl:flex">
            <div className="pb-0 max-xl:flex max-xl:flex-wrap [&>*]:max-xl:m-0 [&>*]:max-xl:mt-[10px] [&>*]:max-xl:w-1/2 [&>*]:max-xl:max-w-none [&>*]:max-xl:px-[15px] [&>*]:max-xl:py-[10px] [&>*]:max-xl:text-center [&_img]:max-xl:inline">
              <div className="ml-[50px] mt-[20px] max-w-[450px]">
                <Image alt="good food" src="/meal-plan/icon-1.png" width={81} height={70} />
                <h3 className="text-primary mt-[10px] text-[24px]">
                  Real, Good Food – Freshly Made
                </h3>
                <p>
                  Fresh, human-grade ingredients cooked slowly to maintain nutritional integrity and
                  maximise flavour. Crafted with minimal processing and maximum safety in mind –
                  it’s food even you could eat.
                </p>
              </div>
              <div className="mt-[30px] max-w-[450px]">
                <Image alt="good food" src="/meal-plan/icon-2.png" width={74} height={70} />
                <h3 className="text-primary mt-[10px] text-[24px]">Customised Meal Plans</h3>
                <p>
                  Each pre-made, pre-portioned meal is aligned with your pet’s unique health goals,
                  right down to the last calorie, as determined by the profile you create.
                </p>
              </div>
              <div className="ml-[90px] mt-[30px] max-w-[420px]">
                <Image alt="good food" src="/meal-plan/icon-3.png" width={102} height={70} />
                <h3 className="text-primary mt-[10px] text-[24px]">Delivered Within Days</h3>
                <p>
                  From our kitchen to your fridge in days - that&apos;s how fresh we like it. We
                  oversee every facet of production to make sure only the best lands in your dog’s
                  bowl.
                </p>
              </div>
              <div className="ml-[150px] mt-[30px]">
                <Image alt="good food" src="/meal-plan/icon-4.png" width={67} height={70} />
                <h3 className="text-primary mt-[10px] text-[24px]">Vet-Approved</h3>
                <p>Nutrition that exceeds industry standards (AAFCO / FEDIAF).</p>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-[65%] max-xl:static">
              <div className="relative pt-[89%]">
                <Image alt="dog with variety of food" src="/mealplan-img.png" fill />
              </div>
            </div>
          </div>
          <div className="mt-[30px] text-center">
            <Button>See Your Recipes</Button>
          </div>
        </Container>
      </div>
      <div className="bg-primary overflow-hidden py-[15px]">
        <div className="animate-marquee flex flex-nowrap [&_img]:max-w-none">
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
      <div className="bg-[#ebeae7] py-[3.5vw]">
        <Container>
          <h2 className="text-center text-[3vw] font-bold leading-[3.25vw] text-[#9a9486] max-md:text-[32px] max-md:leading-[38px]">
            How Your Plan Works
          </h2>
          <div className="mt-[10px] flex flex-row flex-wrap">
            <div className="w-1/3 px-[30px] py-[20px] text-center max-md:w-full">
              <Image
                src="/plan-works/icon-1.png"
                alt="your furry friend"
                width={110}
                height={110}
                className="inline-block"
              />
              <div className="mx-auto mt-[20px] h-9 w-9 rounded-[18px] bg-[#9a9486] text-center font-['Open_Sans'] text-[26px] font-bold leading-9 text-white">
                1
              </div>
              <div className="mt-[10px] text-[24px] text-[#9a9486]">Tell us about your dog</div>
              <p className="mt-[10px]">
                Take our quick quiz to help us understand your furry friend. Based on their
                preferences and needs, we&apos;ll formulate a personalised meal plan just for them.
              </p>
            </div>
            <div className="w-1/3 px-[30px] py-[20px] text-center max-md:w-full">
              <Image
                src="/plan-works/icon-2.png"
                alt="starter box"
                width={110}
                height={110}
                className="inline-block"
              />
              <div className="mx-auto mt-[20px] h-9 w-9 rounded-[18px] bg-[#9a9486] text-center font-['Open_Sans'] text-[26px] font-bold leading-9 text-white">
                2
              </div>
              <div className="mt-[10px] text-[24px] text-[#9a9486]">Get your starter box</div>
              <p className="mt-[10px]">
                We’ll send you two weeks’ worth of freshly crafted meals. It’s the ideal intro for
                your dog’s discerning palate!
              </p>
            </div>
            <div className="w-1/3 px-[30px] py-[20px] text-center max-md:w-full">
              <Image
                src="/plan-works/icon-3.png"
                alt="deliver"
                width={165}
                height={110}
                className="inline-block"
              />
              <div className="mx-auto mt-[20px] h-9 w-9 rounded-[18px] bg-[#9a9486] text-center font-['Open_Sans'] text-[26px] font-bold leading-9 text-white">
                3
              </div>
              <div className="mt-[10px] text-[24px] text-[#9a9486]">
                Real, good food, regularly delivered
              </div>
              <p className="mt-[10px]">
                If our meals win your hearts, sit back and relax. Your dog&apos;s food will arrive
                at your door like clockwork. If you need to make changes, simply adjust your
                subscription at any time.
              </p>
            </div>
          </div>
          <div className="mt-[10px] text-center">
            <Button>Build My Plan</Button>
          </div>
        </Container>
      </div>
      <div className="bg-[#f8f3eb] py-[3.5vw]">
        <Container>
          <h2 className="text-center text-[3vw] font-bold leading-[3.25vw] text-[#be873b] max-md:text-[32px] max-md:leading-[38px]">
            Proof Is In The Eating
          </h2>
          <p className="mx-auto mt-[20px] max-w-screen-md text-center text-[20px] text-[#be873b]">
            Choose Ocelle and watch your dog thrive – from better gut health (cleaner poops!) and
            luxurious fur, to optimised energy for life. But you don&apos;t have to take our word
            for it:
          </p>
          <CaseSwiper />
          <div className="mt-[30px] text-center">
            <Button>Build My Plan</Button>
          </div>
        </Container>
      </div>
      <div className="bg-[url('./recommended-plan-bg.jpg')] bg-cover bg-center py-[200px] max-md:px-[25px] max-md:py-[60px]">
        <Container>
          <div className="mx-auto max-w-[600px] rounded-[30px] bg-white px-[150px] py-[50px] text-center max-md:p-[40px]">
            <strong className="text-primary text-[30px]">See Your Dog’s Recommended Plan!</strong>
            <p className="mt-[10px]">
              Get fresh food conveniently delivered with our customised meal plans.
            </p>
            <div className="mt-[30px] text-center">
              <Button>Create Your Plan</Button>
            </div>
          </div>
        </Container>
      </div>
      <Newsletter />
    </main>
  );
}
