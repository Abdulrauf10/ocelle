import Block from '@/components/Block';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Headings from '@/components/Headings';
import Sound from '@/components/icons/Sound';
import Newsletter from '@/components/Newsletter';
import { Link } from '@/navigation';
import Image from 'next/image';

export default function OurStory() {
  return (
    <main>
      <Block className="bg-gold bg-opacity-10">
        <Container>
          <Headings tag="h1" styles="h1" className="text-center text-primary">
            We Do It For Them
          </Headings>
          <div className="mx-auto mt-10 rounded-[30px] border border-primary bg-white p-12 text-[1.6vw] leading-[1.2] max-3xl:text-[2.4vw] max-2xl:text-[2.8vw] max-xl:p-10 max-xl:text-[3.4vw] max-lg:text-[3.8vw] max-md:p-8 max-md:text-[4.8vw] max-sm:text-[36px] max-xs:p-6 max-xs:text-[32px]">
            <strong className="flex items-center text-[1em] leading-[1.5em] text-primary">
              <span>Ocelle | oh-chell-i |</span>
              <Sound className="ml-[.8vw] inline-block w-[.8em]" />
            </strong>
            <p className="mt-[.6em] text-[.73em] text-primary">noun。Latin</p>
            <div className="mt-[.1em]">
              <strong className="text-[.6em] font-bold text-primary">1. Figurative:</strong>
              <p className="ml-[1.6vw] mt-3 flex text-[.5em]">
                <strong className="mr-2">a.</strong>Term of endearment: &quot;My little eye,&quot;
                &quot;my dearest,&quot; &quot;my precious one,&quot; or “apple of my eye.” Used
                affectionately to address a loved one.
              </p>
              <p className="ml-[1.6vw] mt-3 flex text-[.5em]">
                <strong className="mr-2">b.</strong>Treasured object or person: Something or someone
                held in high regard and considered valuable.
              </p>
            </div>
            <div className="mt-[.1em]">
              <strong className="text-[.6em] font-bold text-primary">2. Literal:</strong>
              &nbsp;<span className="text-[.5em]">Little eye.</span>
            </div>
          </div>
        </Container>
      </Block>
      <div className="flex flex-wrap">
        <div className="w-1/2 bg-brown pl-[8vw] pr-[4vw] text-xl text-white max-md:w-full max-md:px-4">
          <Block>
            <Headings tag="h2" styles="h1">
              A <i>Tail</i> Of&nbsp;
              <br className="max-md:hidden" />
              Transformation
            </Headings>
            <p className="mt-8">
              OCELLE starts not in a lab, but in a loving home. Our founder, Kevan, faced a
              challenge many pet parents know only too well – a beloved furry family member with
              unique needs. Kevan’s dog, Charlie, wasn&apos;t just picky; he struggled with
              allergies, making mealtimes a constant battle.
            </p>
            <p className="mt-4">
              Despite trying an array of regular brands and diets, nothing suited Charlie. The
              breakthrough came with a simple suggestion from his Vet: Why not try homemade meals?
              Sceptical but determined, Kevan swapped processed foods for real, home-cooked meals.
            </p>
            <p className="mt-4">
              The transformation was nothing short of miraculous. Charlie, previously lethargic and
              uninterested, began to thrive. His allergies subsided, his energy returned, and his
              tail wouldn&apos;t stop wagging.
            </p>
          </Block>
        </div>
        <div className="min-h-[380px] w-1/2 bg-[url('./charlie.jpg')] bg-[length:auto_100%] bg-[center_left] max-md:w-full"></div>
      </div>
      <div className="flex items-center bg-primary bg-[url('./about-us-bg.svg')] bg-cover bg-center bg-repeat-x max-md:flex-col-reverse">
        <div className="flex w-1/2 justify-end max-md:w-full max-md:justify-center">
          <div className="mr-5 w-full max-w-[380px] pt-10 max-md:mx-4">
            <div className="relative pt-[172%]">
              <Image src="/dog-with-owner.png" alt="Dog with owner" fill />
            </div>
          </div>
        </div>
        <div className="relative -left-8 w-1/2 text-white max-md:left-0 max-md:w-full max-md:px-4">
          <div className="absolute left-16 -translate-y-full max-md:static max-md:mt-8 max-md:translate-y-0">
            <Image
              src="/inspire.svg"
              alt="Inspire"
              width={130}
              height={140}
              className="max-md:mx-auto"
            />
          </div>
          <Headings tag="h2" styles="h1" className="pt-6">
            A Fresh Perspective
          </Headings>
          <p className="mt-4 w-2/3 text-xl max-xl:w-full">
            This personal journey sparked an idea: What if I could extend this increase in health
            and happiness to all dogs? Why should real food be an exception rather than the norm for
            our beloved pets?
          </p>
        </div>
      </div>
      <div className="flex flex-wrap max-lg:flex-col-reverse">
        <div className="w-1/2 bg-secondary bg-opacity-20 pl-[8vw] pr-[4vw] text-xl max-lg:w-full max-lg:px-4">
          <Block>
            <Headings tag="h2" styles="h1" className="text-secondary">
              Healthier. Happier.
              <br />
              Waggier.
            </Headings>
            <p className="mt-8">
              That&apos;s how OCELLE was born. Our philosophy is straightforward: Real, nourishing
              food isn&apos;t a pet&apos;s privilege; it&apos;s their right. We believe in the
              connection between diet and well-being, mirroring the importance of food in all our
              lives. No one should have to rely on the same processed foods, day in, day out, all
              year round.
            </p>
            <p className="mt-4">
              OCELLE isn&apos;t just about providing dog food; we&apos;re redefining what pet
              nutrition actually means, and how we can all apply it in our homes, with ease.
            </p>
            <p className="mt-4">
              After extensive research into pet nutrition, with insights from leading Vet
              Nutritionists, we’ve developed a range of fresh, convenient pet food solutions, that
              are both innovative and ground-breaking!
            </p>
            <p className="mt-4">
              Our recipes aren&apos;t just human-grade in quality; they&apos;re meticulously crafted
              to promote your dog&apos;s health and happiness, with the same love and care you’d put
              into creating a family meal.
            </p>
            <p className="mt-4">
              Welcome to OCELLE, where your dog’s well-being isn&apos;t just our business—it&apos;s
              our heartfelt commitment.
            </p>
          </Block>
        </div>
        <div className="flex min-h-[380px] w-1/2 items-end bg-secondary bg-opacity-80 max-lg:w-full">
          <div className="ml-[12%] w-full max-w-[620px] max-lg:mx-auto max-lg:px-4">
            <div className="relative pt-[117.2%]">
              <Image src="/about-us-food.png" alt="foods" fill className="select-none" />
            </div>
          </div>
        </div>
      </div>
      <Block className="bg-dark-green">
        <Container className="text-center text-white" screen>
          <Headings tag="h2" styles="h1">
            Powered By Science, <br />
            We Turn Love Into Uncomplicated Care!
          </Headings>
          <div className="mt-10">
            <Button href="/get-started">Start Your Fresh Journey</Button>
          </div>
        </Container>
      </Block>
      <Block>
        <Container className="text-center text-primary">
          <Headings tag="h2" styles="h1">
            Our Community
          </Headings>
          <p className="mx-auto mt-6 max-w-4xl text-xl">
            Are you as passionate as we are about giving your dog(s) the best? We&apos;re firm
            believers in the strength of community to bring about real transformation. If
            you&apos;re interested in helping us spread our mission to make a paws-itive impact on
            canine lives,{' '}
            <Link href="/affiliate-program" className="text-secondary hover:underline">
              apply here
            </Link>{' '}
            to become an OCELLE Affiliate.
          </p>
          <div className="relative -z-10 -mx-32 -mt-[5%] max-2xl:mx-0">
            <div className="relative pt-[76.9%]">
              <Image src="/dog-circle.jpg" alt="dogs" fill />
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
