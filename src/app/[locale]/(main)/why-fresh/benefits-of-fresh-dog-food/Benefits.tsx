'use client';

import Collapse from '@mui/material/Collapse';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Container from '@/components/Container';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Plus from '@/components/icons/Plus';
import Sub from '@/components/icons/Sub';
import Block from '@/components/layouts/Block';

function Toggler({
  title,
  className,
  children,
}: {
  title: React.ReactNode;
  className?: { root?: string };
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(false);

  const handleShow = () => {
    if (!show) {
      setTimeout(() => {
        if (ref.current) {
          const elementRect = ref.current.getBoundingClientRect();
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          const absoluteElementTop = elementRect.top + scrollPosition;
          const targetScrollTop = absoluteElementTop - 150;
          window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
    setShow(!show);
  };
  return (
    <div
      ref={ref}
      className={clsx(
        'cursor-pointer rounded-[20px] border border-gray bg-white px-8 py-6 shadow-black/20 drop-shadow-style-2 max-md:p-6',
        className?.root
      )}
      onClick={handleShow}
    >
      <div className="relative flex max-md:items-center">
        <div className="flex-1">{title}</div>
        <button className="right-3 top-3 ml-3 max-sm:absolute">
          {show ? <Sub className="w-4" /> : <Plus className="w-4" />}
        </button>
      </div>
      <Collapse in={show} timeout={300}>
        <hr className="my-4 border-gray" />
        {/* <div className="mb-2 mt-6 max-lg:lang-en:-mx-2 max-sm:lang-en:-mx-2 md:lang-en:-mx-2"> */}
        <div className="mb-2 mt-6">{children}</div>
      </Collapse>
    </div>
  );
}

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
            src={`/benefits-of-fresh-dog-food/${icon}`}
            alt=""
            width={width}
            height={height}
            className={clsx(
              'mr-5 inline-block max-sm:mb-2 max-sm:mr-0 sm:absolute sm:right-[100%] sm:top-1/2 sm:-translate-y-1/2',
              className?.icon
            )}
          />
          <div className="pt-3 sm:hidden"></div>
          <p className="heading-4 font-bold text-primary lang-zh:font-normal sm:inline">{title}</p>
        </div>
      </div>
    </div>
  );
}
export default function Benefits() {
  const i = useTranslations('WhyFresh-BenefitsOfFreshDogFood');
  return (
    <Block className="bg-primary bg-opacity-10">
      <h2 className="heading-1 text-center font-bold text-primary lang-zh:font-normal">
        {i.rich('block-4-title')}
      </h2>
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
          <ul className="-mb-2 mt-2 !list-disc lang-en:pl-8 lang-zh:pl-11">
            <li className="text-primary">
              <p className="body-1 text-black">{i.rich('block-4-benefits-1-content-4-mark-1')}</p>
            </li>
            <li className="text-primary">
              <p className="body-1 text-black">{i.rich('block-4-benefits-1-content-4-mark-2')}</p>
            </li>
            <li className="text-primary">
              <p className="body-1 text-black">{i.rich('block-4-benefits-1-content-4-mark-3')}</p>
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
                  src="/benefits-of-fresh-dog-food/chicken-recipe-light.png"
                  alt=""
                  width={112}
                  height={115.5}
                  className="inline-block min-w-28"
                />
                <div className="mt-1"></div>
                <p className="body-4 text-primary lang-en:font-bold lang-zh:font-medium">
                  {i('block-4-benefits-5-content-5-image-1-desc')}
                </p>
              </div>
              <div className="mx-6 mt-2 h-[115.5px] w-px bg-primary max-sm:lang-zh:mx-3"></div>
              <div className="flex">
                <div className="flex-1 text-center">
                  <Image
                    src="/benefits-of-fresh-dog-food/kibble-half.png"
                    alt=""
                    width={115.5}
                    height={115.5}
                    className="inline-block min-w-28"
                  />
                  <div className="mt-1"></div>
                  <p className="body-4 text-brown lang-en:font-bold lang-zh:font-medium">
                    {i('block-4-benefits-5-content-5-image-2-desc')}
                  </p>
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
  );
}
