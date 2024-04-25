import Block from '@/components/layouts/Block';
import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Sound from '@/components/icons/Sound';
import Newsletter from '@/components/Newsletter';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function OurStory() {
  const t = useTranslations('AboutUs');
  return (
    <main>
      <Block styles="normal" className="bg-gold bg-opacity-10 py-[92.5px] max-xl:pt-5">
        <Container>
          <h1 className="heading-1 text-center font-bold text-primary">{t('we-do-it-for-them')}</h1>
          <div className="mx-auto mt-10 rounded-[30px] border border-primary bg-white p-12 text-[1.6vw] leading-[1.2] max-3xl:text-[2.4vw] max-2xl:text-[2.8vw] max-xl:mt-5 max-xl:p-10 max-xl:text-[3.4vw] max-lg:text-[3.8vw] max-md:p-8 max-md:text-[4.8vw] max-sm:text-[36px] max-xs:p-6 max-xs:text-[32px]">
            <strong className="flex items-center text-[1em] leading-[1.5em] text-primary">
              <span>Ocelle | oh-chell-i |</span>
              <Sound className="ml-[.8vw] inline-block w-[.8em] max-md:hidden" />
            </strong>
            <p className="mt-[.6em] text-[.73em] text-primary">
              <Sound className="mr-3 inline-block w-[1.2em] md:hidden" />
              noun。Latin
            </p>
            <div className="mt-[.1em]">
              <strong className="text-[.6em] font-bold text-primary ">
                1. {t('block-1-title-1')}:
              </strong>
              <p className="ml-[22px] mt-3 flex text-[.5em]">
                <strong className="mr-2">a.</strong>
                {t.rich('block-1-content-1')}
                <br />
                {t.rich('block-1-content-2')}
              </p>
              <p className="ml-[1.2vw] mt-3 flex text-[.5em] max-3xl:ml-[1.75vw] max-xl:ml-[2.5vw] max-md:ml-[3.2vw] max-sm:ml-6">
                <strong className="mr-2">b.</strong>
                {t.rich('block-1-content-3')}
              </p>
            </div>
            <div className="mt-[.1em]">
              <strong className="text-[.6em] font-bold text-primary">
                2. {t('block-1-title-2')}:
              </strong>
              &nbsp;<span className="text-[.5em]"> {t.rich('block-1-content-4')}</span>
            </div>
          </div>
        </Container>
      </Block>
      <div className="flex flex-wrap md:flex-row-reverse xl:h-[655px]">
        <div className="min-h-[380px] w-1/2 bg-[url('./charlie.jpg')] bg-[length:auto_100%] bg-[center_left] max-md:w-full"></div>
        <div className="w-1/2 bg-brown pl-[8vw] pr-[4vw] text-white max-md:w-full max-md:px-4">
          <Block>
            <h2 className="heading-1 font-bold">
              {t.rich('block-2-title-1-1')}
              <span className="block"> {t.rich('block-2-title-1-2')}</span>
            </h2>
            <p className="body-1 mt-8">{t('block-2-content-1')}</p>
            <p className="body-1 mt-4">{t('block-2-content-2')}</p>
            <p className="body-1 mt-4">{t('block-2-content-3')}</p>
          </Block>
        </div>
      </div>
      <div className="flex items-center bg-primary bg-[url('./about-us-bg.svg')] bg-cover bg-center bg-repeat-x max-md:flex-col-reverse xl:h-[680px] ">
        <div className="flex w-1/2 justify-end max-md:w-full max-md:justify-center">
          <div className="mr-8 w-full max-w-[380px] pt-10 max-md:mx-4">
            <div className="relative pt-[168%]">
              <Image src="/dog-with-owner.png" alt="Dog with owner" fill />
            </div>
          </div>
        </div>
        <div className="relative -left-6 w-1/2 text-white max-md:left-0 max-md:w-full max-md:px-4">
          <div className="absolute left-16 -translate-y-full max-md:static max-md:mt-8 max-md:translate-y-0">
            <Image
              src="/inspire.svg"
              alt="Inspire"
              width={130}
              height={140}
              className="max-md:mx-auto"
            />
          </div>
          <h2 className="heading-1 pt-6 font-bold max-md:text-center">{t('block-3-title-1')}</h2>
          <p className="body-1 mt-4 w-2/3 max-xl:w-full">{t('block-3-content-1')}</p>
        </div>
      </div>
      <div className="flex flex-wrap xl:h-[794px]">
        <div className="w-1/2 bg-secondary bg-opacity-20 pl-[8vw] pr-[4vw] max-lg:w-full max-lg:px-4">
          <Block>
            <h2 className="heading-1 font-bold text-secondary">
              {t('block-4-title-1-1')}
              <br />
              {t.rich('block-4-title-1-2')}
            </h2>
            <p className="body-1 mt-8">{t('block-4-content-1')}</p>
            <p className="body-1 mt-4">{t('block-4-content-2')}</p>
            <p className="body-1 mt-4">{t('block-4-content-3')}</p>
            <p className="body-1 mt-4">{t('block-4-content-4')}</p>
            <p className="body-1 mt-4">{t('block-4-content-5')}</p>
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
      <Block styles="normal" className="h-[280px] bg-dark-green py-10">
        <Container className="text-center text-white" screen>
          <h2 className="heading-1 font-bold">
            {t('block-5-title-1-1')}
            <br />
            {t('block-5-title-1-2')}
          </h2>
          <div className="mb-1 mt-10">
            <Button href="/get-started">Start Your Fresh Journey</Button>
          </div>
        </Container>
      </Block>
      <Block>
        <Container className="text-center text-primary">
          <h2 className="heading-1 font-bold">Our Community</h2>
          <p className="body-1 mx-auto mt-6 max-w-4xl">
            {t('block-6-content-1-1')}
            <Link href="/affiliate-program" className="text-secondary hover:underline">
              {t('block-6-content-1-2')}
            </Link>
            {t('block-6-content-1-3')}
          </p>
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
