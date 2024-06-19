import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Container from '@/components/Container';
import Newsletter from '@/components/Newsletter';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Block from '@/components/layouts/Block';
import Toggler from '@/components/layouts/Toggler';
import TwoToneBlock from '@/components/layouts/TwoToneBlock';
import { Link } from '@/navigation';

function BenefitsTitle({
  className,
  width,
  height,
  icon,
  title,
}: {
  className?: {
    icon?: string;
  };
  width: number;
  height: number;
  icon: string;
  title: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center text-center max-sm:flex-col sm:pl-[80px]">
      <div className="sm:py-3">
        <div className="relative sm:inline">
          <Image
            src={`/why-fresh/${icon}`}
            alt=""
            width={width}
            height={height}
            className={clsx(
              'mr-5 inline-block max-sm:mb-2 max-sm:mr-0 sm:absolute sm:right-[100%] sm:top-1/2 sm:-translate-y-1/2',
              className?.icon
            )}
          />
          <div className="pt-3 sm:hidden"></div>
          <p className="heading-4 font-bold text-primary sm:inline">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function BenefitsOfFreshDogFood() {
  const t = useTranslations();
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-BenefitsOfFreshDogFood');

  return (
    <main>
      <Block className="overflow-hidden bg-[#f6ece1]">
        <Container>
          <h1 className="heading-headline heading-weight-1 text-center text-brown">
            {i.rich('block-1-title')}
          </h1>
          <div className="pt-8"></div>
          <p className="body-1 text-center">{i.rich('block-1-content-1')}</p>
          <div className="pt-8"></div>
          <div className="mx-auto -mb-[3%] max-w-[1200px]">
            <div className="relative pt-[56%] max-md:mt-[8%] max-md:scale-[1.25]">
              <Image src="/why-fresh/a-running-dog.jpg" alt="running dog" fill />
            </div>
          </div>
        </Container>
      </Block>
      <TwoToneBlock
        className={{
          bgLeft: 'bg-dark-green',
          bgRight: 'bg-[#DCEDEE]',
          container: 'py-tight',
          mbLeft: 'px-4 py-tight',
          mbRight: 'py-6',
          separator: 'max-lg:px-4',
        }}
        left={
          <div className="text-white">
            <h2 className="heading-1 font-bold max-md:text-center">{i.rich('block-2-title')}</h2>
            <div className="pt-8"></div>
            <p className="body-1">{i.rich('block-2-content-1')}</p>
            <div className="pt-5"></div>
            <p className="body-1">{i.rich('block-2-content-2')}</p>
          </div>
        }
        right={
          <div className="relative mx-auto max-w-[480px] max-md:mx-auto">
            <div className="pt-[100%]">
              <Image
                src="/why-fresh/fresh-food-diet.png"
                alt=""
                fill
                className="object-contain object-[16px_13px]"
              />
            </div>
          </div>
        }
      />
      <Block className="bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{i.rich('block-3-title')}</h2>
          <div className="-mx-4 flex items-center pt-normal max-md:flex-col">
            <div className="mx-4 flex-1">
              <div className="ml-4 mr-10 rounded-[40px] border-[3px] border-gold bg-white px-12 py-10 max-xl:ml-0 max-xl:mr-4 max-md:mr-0 max-md:max-w-xl max-md:px-6">
                <p className="heading-4 text-center italic text-gold">{i.rich('block-3-quota')}</p>
                <div className="mt-4"></div>
                <p className="font-baskerville"></p>
                <p className="body-1 text-center text-gold">{i.rich('block-3-quota-person')}</p>
                <div className="mt-6 flex">
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-chicken')}</div>
                    <Image
                      src="/why-fresh/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-fish')}</div>
                    <Image
                      src="/why-fresh/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="body-1 body-weight-1">{i.rich('block-3-beef')}</div>
                    <Image
                      src="/why-fresh/single-piece-of-dog-food.png"
                      alt=""
                      width={50}
                      height={50}
                      className="mt-2 inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-4 flex-1 max-md:mt-normal max-md:text-center">
              <p className="body-1">{i.rich('block-3-content-1')}</p>
              <div className="pt-8"></div>
              <Button href="/why-fresh/its-time-to-rethink-kibble">{t('learn-more')}</Button>
            </div>
          </div>
        </Container>
      </Block>
      <Block className="bg-primary bg-opacity-10">
        <h2 className="heading-1 text-center font-bold text-primary">{i.rich('block-4-title')}</h2>
        <div className="pt-6"></div>
        <Container className="!max-w-5xl">
          <p className="body-1 text-center text-primary">{i.rich('block-4-content-1')}</p>
          <div className="pt-10"></div>
          <Toggler
            title={
              <BenefitsTitle
                className={{ icon: '!top-[18%]' }}
                width={50}
                height={50}
                icon="benefits-1.svg"
                title={i.rich('block-4-benefits-1-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-1-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-1-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-1-content-3')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-1-content-4')}</p>
            <ul className="-mb-2 mt-2 list-item pl-7">
              <li className="relative flex items-center py-2">
                <div className="absolute -left-5 select-none text-[60px] text-primary">
                  <span className="relative top-1">•</span>
                </div>
                <p className="body-1">{i.rich('block-4-benefits-1-content-4-mark-1')}</p>
              </li>
              <li className="relative flex items-center py-2">
                <div className="absolute -left-5 select-none text-[60px] text-primary">
                  <span className="relative top-1">•</span>
                </div>
                <p className="body-1">{i.rich('block-4-benefits-1-content-4-mark-2')}</p>
              </li>
              <li className="relative flex items-center py-2">
                <div className="absolute -left-5 select-none text-[60px] text-primary">
                  <span className="relative top-1">•</span>
                </div>
                <p className="body-1">{i.rich('block-4-benefits-1-content-4-mark-3')}</p>
              </li>
            </ul>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={42}
                height={48}
                icon="benefits-2.svg"
                title={i.rich('block-4-benefits-2-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-2-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-2-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-2-content-3')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-2-content-4')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={47}
                height={48}
                icon="benefits-3.svg"
                title={i.rich('block-4-benefits-3-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-3-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-3-content-2')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={47}
                height={60}
                icon="benefits-4.svg"
                title={i.rich('block-4-benefits-4-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-4-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">
              {i.rich('block-4-benefits-4-content-2', {
                button: (chunks) => (
                  <UnderlineButton
                    className="inline"
                    label={chunks}
                    href="/why-fresh/its-time-to-rethink-kibble"
                    underline
                  />
                ),
              })}
            </p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-4-content-3')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={50}
                height={48}
                icon="benefits-5.svg"
                title={i.rich('block-4-benefits-5-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-5-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-5-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-5-content-3')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-5-content-4')}</p>
            <div className="-mx-4 -my-2 mt-6 flex flex-wrap justify-center">
              <p className="min-w-72 flex-1 px-4 py-2 sm:min-w-[520px]">
                <span className="body-1">{i.rich('block-4-benefits-5-content-5')}</span>
              </p>
              <div className="flex px-4 py-2">
                <div className="flex-1 text-center">
                  <Image
                    src="/why-fresh/chicken-recipe-light.png"
                    alt=""
                    width={112}
                    height={115.5}
                    className="inline-block min-w-28"
                  />
                  <div className="mt-1"></div>
                  <p className="body-4 font-bold text-primary">500 calories of OCELLE</p>
                </div>
                <div className="mx-6 mt-2 h-[115.5px] w-px bg-primary"></div>
                <div className="flex">
                  <div className="flex-1 text-center">
                    <Image
                      src="/why-fresh/kibble-half.png"
                      alt=""
                      width={115.5}
                      height={115.5}
                      className="inline-block min-w-28"
                    />
                    <div className="mt-1"></div>
                    <p className="body-4 font-bold text-brown">500 calories of kibble</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-5-content-6')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-5-content-7')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                className={{ icon: '!top-[20%]' }}
                width={90}
                height={46}
                icon="benefits-6.svg"
                title={i.rich('block-4-benefits-6-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-6-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-6-content-2')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-6-content-3')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={53}
                height={49}
                icon="benefits-7.svg"
                title={i.rich('block-4-benefits-7-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-7-content-1')}</p>
            <div className="mt-6"></div>
            <p className="body-1">{i.rich('block-4-benefits-7-content-2')}</p>
          </Toggler>
          <div className="mt-8"></div>
          <Toggler
            title={
              <BenefitsTitle
                width={59}
                height={60}
                icon="benefits-8.svg"
                title={i.rich('block-4-benefits-8-title')}
              />
            }
          >
            <p className="body-1">{i.rich('block-4-benefits-8-content-1')}</p>
          </Toggler>
        </Container>
      </Block>
      <Block styles="tight" className="bg-dark-green">
        <Container className="text-center">
          <h2 className="heading-1 font-bold text-white">{i.rich('block-5-title')}</h2>
          <Button className="mt-8" href="/get-started">
            {b('try-it-today')}
          </Button>
        </Container>
      </Block>
      <Block className="overflow-hidden bg-gold bg-opacity-15">
        <Container>
          <h2 className="heading-1 text-center font-bold text-gold">{w.rich('block-1-title')}</h2>
          <div className="pt-4"></div>
          <p className="body-1 text-center">
            {w.rich('block-1-content-1', {
              button: (chunks) => (
                <UnderlineButton
                  label={chunks}
                  href="/why-fresh/reference#benefits-of-fresh-dog-food"
                />
              ),
            })}
          </p>
          <div className="pt-normal"></div>
          <div className="-mx-6 flex flex-wrap items-stretch max-lg:-mx-3">
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full">
              <Link
                href="/why-fresh/its-time-to-rethink-kibble"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/its-time-to-rethink-kibble.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('its-time-to-rethink-kibble')}</span>
                </div>
              </Link>
            </div>
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full max-md:pt-normal">
              <Link
                href="/why-fresh/raw-dog-food-vs-gently-cooked"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image src="/why-fresh/raw-vs-gently-cooked-diets.jpg" alt="" fill />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">{w.rich('raw-vs-gently-cooked-diets')}</span>
                </div>
              </Link>
            </div>
            <div className="w-1/3 px-6 max-lg:px-3 max-md:w-full max-md:pt-normal">
              <Link
                href="/why-fresh/challenges-with-home-cooking-for-your-dog"
                className="drop-shadow-style-1 mx-auto flex h-full max-w-lg flex-col overflow-hidden rounded-[30px] bg-white shadow-black/30 will-change-transform"
              >
                <div className="relative pt-[68.5%]">
                  <Image
                    src="/why-fresh/challenges-with-home-cooking-for-your-dog.jpg"
                    alt=""
                    fill
                  />
                </div>
                <div className="flex h-full items-center justify-center px-4 py-6">
                  <span className="body-1 text-center">
                    {w.rich('challenges-with-home-cooking-for-your-dog')}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </Block>
      <Newsletter />
    </main>
  );
}
