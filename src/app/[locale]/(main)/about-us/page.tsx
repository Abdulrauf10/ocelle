import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Sound from '@/components/icons/Sound';
import Block from '@/components/layouts/Block';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';

export default function OurStory() {
  const b = useTranslations('Button');
  const a = useTranslations('AboutUs');

  return (
    <main className="overflow-x-hidden">
      <Block
        styles="normal"
        className=" flex min-h-[600px] flex-col justify-center bg-gold bg-opacity-10 py-4"
      >
        <Container>
          <h1 className="heading-headline heading-weight-1 text-center text-primary">
            {a('we-do-it-for-them')}
          </h1>
          <div className="mx-auto mt-10 rounded-[30px] border border-primary bg-white p-12 text-[1.6vw] leading-[1.2] max-3xl:text-[2.4vw] max-2xl:text-[2.8vw] max-xl:mt-5 max-xl:p-10 max-xl:text-[3.4vw] max-lg:text-[3.8vw] max-md:p-8 max-md:text-[4.8vw] max-sm:text-[36px] max-xs:p-6 max-xs:text-[32px]">
            <strong className="flex flex-col text-left text-[1em]  text-primary xs:flex-row xs:items-center">
              <div className="inline-block">Ocelle |&nbsp;</div>
              <div className="inline-block min-w-[240px]">
                oh-chell-i | <Sound className="ml-[.8vw] inline-block w-[.8em] pb-1" />
              </div>
            </strong>
            <p className="text-[.73em] text-primary">
              {/* <Sound className="mr-3 inline-block w-[1.2em] max-sm:hidden" /> */}
              noun。Latin
            </p>
            <table className=" text-left">
              <tbody>
                <tr>
                  <th>
                    <strong className="text-[.6em] font-bold text-primary ">1.</strong>
                  </th>
                  <th>
                    <strong className="text-[.6em] font-bold text-primary ">
                      {a('block-1-title-1')}:
                    </strong>
                  </th>
                </tr>
                <tr>
                  <th></th>
                  <th>
                    <p className="mt-3 flex text-[.5em] ">
                      <span className="mr-2 font-medium">a.</span>
                      <span className="font-normal">{a.rich('block-1-content-1')}</span>
                    </p>
                    <p className="mt-3 flex text-[.5em] ">
                      <span className="mr-2 font-medium">b.</span>
                      <span className="font-normal">{a.rich('block-1-content-3')}</span>
                    </p>
                  </th>
                </tr>
                <tr>
                  <th>
                    <div>
                      <strong className="text-[.6em] font-bold text-primary">2. </strong>
                    </div>
                  </th>
                  <th>
                    <strong className="text-[.6em] font-bold text-primary">
                      {a('block-1-title-2')}:
                    </strong>
                    <span className="text-[.5em] font-normal"> {a.rich('block-1-content-4')}</span>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </Block>
      <div className="m-0 bg-[#d8b99a] p-0">
        <TwoToneBlock
          breakpoint="lg"
          className={{
            bgLeft: 'bg-brown',
            bgRight:
              "min-h-[520px] bg-[length:auto_100%] bg-[5%] bg-no-repeat max-lg:min-h-[50vw] max-lg:bg-[url('./charlie-center.jpg')] max-lg:bg-[center] lg:bg-[url('./charlie.jpg')]",
            // "min-h-[520px] bg-[url('./charlie.jpg')] bg-[length:auto_100%] bg-no-repeat max-lg:min-h-[60vw] max-lg:bg-[]",
            mbLeft: 'px-4',
          }}
          left={
            <div className="py-[clamp(20px,3.5vw,60px)] text-white">
              <h2 className="heading-1 font-bold lg:hidden">{a.rich('block-2-title-1')}</h2>
              <h2 className="heading-1 font-bold max-lg:hidden">{a.rich('block-2-title-1-lg')}</h2>
              <div className="mt-8"></div>
              <p className="body-1">{a('block-2-content-1')}</p>
              <div className="mt-4"></div>
              <p className="body-1">{a('block-2-content-2')}</p>
              <div className="mt-4"></div>
              <p className="body-1">{a('block-2-content-3')}</p>
            </div>
          }
        />
      </div>
      <div className="relative z-0 flex items-center bg-primary bg-cover bg-center bg-repeat-x max-md:flex-col-reverse lg:bg-[url('./about-us-bg.svg')] xl:h-[680px]">
        <Image
          src="/food-1.png"
          alt="food-1"
          width={300}
          height={250}
          className="absolute -left-[50px] bottom-[10%] lg:hidden"
        />
        <Image
          src="/food-2.png"
          alt="food-2"
          width={320}
          height={220}
          className="left-30 clip-path: insea(0 40% 0 0) min-lg:hidden absolute -right-[60px] bottom-[15%] max-md:block max-[450px]:hidden lg:hidden"
        />
        <Image
          src="/food-3.png"
          alt="food-3"
          width={220}
          height={220}
          className="left-30 absolute -right-[40px] -top-[40px] lg:hidden"
          loading="eager"
        />
        <div className="z-40 flex w-1/2 justify-end max-md:w-full max-md:justify-center">
          <div className="mr-8 w-full max-w-[380px] pt-10 max-md:mx-4">
            <div className="relative pt-[168%]">
              <Image src="/dog-with-owner.png" alt="Dog with owner" fill loading="eager" />
            </div>
          </div>
        </div>
        <div className="relative -left-6 w-1/2 text-white max-md:left-0 max-md:w-full max-md:px-4">
          <div className="absolute left-16 -translate-y-full max-md:static max-md:mt-12 max-md:translate-y-0 md:top-[-56px]">
            <Image
              src="/inspire.svg"
              alt="Inspire"
              width={130}
              height={140}
              className="max-md:mx-auto"
              loading="eager"
            />
          </div>
          <div className="mt-6"></div>
          <h2 className="heading-1 font-bold max-md:text-center">{a('block-3-title-1')}</h2>
          <div className="mt-4"></div>
          <div className="w-2/3 max-xl:w-full">
            <p className="body-1">{a('block-3-content-1')}</p>
          </div>
        </div>
      </div>
      <TwoToneBlock
        breakpoint="lg"
        className={{
          bgLeft: 'bg-secondary bg-opacity-20',
          bgRight: 'flex items-end bg-secondary bg-opacity-80',
          mbLeft: 'px-4 py-6',
        }}
        bgRight={
          <div className="ml-[12%] w-full max-w-[620px] max-lg:mx-auto max-lg:px-4">
            <div className="relative pt-[117.2%]">
              <Image
                src="/about-us-food.png"
                alt="foods"
                fill
                className="select-none object-contain object-bottom"
              />
            </div>
          </div>
        }
        left={
          <div className="py-[clamp(20px,3.5vw,60px)]">
            <h2 className="heading-1 inline-block font-bold text-secondary max-[300px]:block">
              <span className="max-lg:hidden">{a.rich('block-4-title')}</span>
              <span className="lg:hidden">{a.rich('block-4-title-lg')}</span>
            </h2>
            <div className="mt-8"></div>
            <p className="body-1">{a('block-4-content-1')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a('block-4-content-2')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a('block-4-content-3')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a('block-4-content-4')}</p>
            <div className="mt-4"></div>
            <p className="body-1">{a('block-4-content-5')}</p>
          </div>
        }
        right={
          <div className="relative w-full max-w-[600px] max-lg:mx-auto max-lg:max-w-[450px] lg:ml-[6%]">
            <div className="pt-[117.2%]">
              <Image
                src="/about-us-food.png"
                alt="foods"
                fill
                className="select-none object-contain object-bottom lg:hidden"
              />
            </div>
          </div>
        }
      />
      <Block styles="normal" className="bg-dark-green py-10">
        <Container className="text-center text-white" screen>
          <h2 className="heading-1 font-bold">{a.rich('block-5-title-1')}</h2>
          <div className="mb-1 mt-10">
            <Button href="/get-started">{b('start-your-fresh-journey')}</Button>
          </div>
        </Container>
      </Block>
      <Block>
        <Container className="text-center text-primary">
          <h2 className="heading-1 font-bold">{a('block-6-title-1')}</h2>
          <div className="mt-6"></div>
          <div className="mx-auto max-w-4xl">
            <p className="body-1">
              {a.rich('block-6-content-1', {
                link: (chunks) => <UnderlineButton label={chunks} href="/affiliate-program" />,
              })}
            </p>
          </div>
          <div className="relative -z-10 -mx-32 -mt-[5%] flex justify-center overflow-hidden max-2xl:mx-0">
            <div className="w-full max-md:min-w-[110%]">
              <div className="relative pt-[76.9%]">
                <Image src="/dog-circle.jpg" alt="dogs" fill />
              </div>
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
