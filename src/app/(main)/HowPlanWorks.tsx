import Image from 'next/image';
import Container from '../../components/Container';
import Button from '../../components/Button';
import H2 from '@/components/Heading/H2';
import Block from '@/components/Block';

export default function HowPlanWorks() {
  return (
    <Block className="bg-[#ebeae7]">
      <Container>
        <H2 className="text-center text-[#9a9486]">How Your Plan Works</H2>
        <div className="mt-6 flex flex-row flex-wrap">
          <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
            <Image
              src="/plan-works/icon-1.png"
              alt="your furry friend"
              width={110}
              height={110}
              className="inline-block"
            />
            <div className="font-open-sans mx-auto mt-5 h-9 w-9 rounded-full bg-[#9a9486] text-center text-2xl font-bold leading-9 text-white">
              1
            </div>
            <div className="mt-2 text-2xl text-[#9a9486]">Tell us about your dog</div>
            <p className="mt-2">
              Take our quick quiz to help us understand your furry friend. Based on their
              preferences and needs, we&apos;ll formulate a personalised meal plan just for them.
            </p>
          </div>
          <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
            <Image
              src="/plan-works/icon-2.png"
              alt="starter box"
              width={110}
              height={110}
              className="inline-block"
            />
            <div className="font-open-sans mx-auto mt-5 h-9 w-9 rounded-full bg-[#9a9486] text-center text-2xl font-bold leading-9 text-white">
              2
            </div>
            <div className="mt-2 text-2xl text-[#9a9486]">Get your starter box</div>
            <p className="mt-2">
              We’ll send you two weeks’ worth of freshly crafted meals. It’s the ideal intro for
              your dog’s discerning palate!
            </p>
          </div>
          <div className="w-1/3 px-8 py-5 text-center max-md:w-full">
            <Image
              src="/plan-works/icon-3.png"
              alt="deliver"
              width={165}
              height={110}
              className="inline-block"
            />
            <div className="font-open-sans mx-auto mt-5 h-9 w-9 rounded-full bg-[#9a9486] text-center text-2xl font-bold leading-9 text-white">
              3
            </div>
            <div className="mt-2 text-2xl text-[#9a9486]">Real, good food, regularly delivered</div>
            <p className="mt-2">
              If our meals win your hearts, sit back and relax. Your dog&apos;s food will arrive at
              your door like clockwork. If you need to make changes, simply adjust your subscription
              at any time.
            </p>
          </div>
        </div>
        <div className="mt-2 text-center">
          <Button>Build My Plan</Button>
        </div>
      </Container>
    </Block>
  );
}
