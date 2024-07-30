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
  onShow,
  togglerId,
  show,
}: {
  title: React.ReactNode;
  className?: { root?: string };
  children: React.ReactNode;
  onShow: any;
  show: boolean;
  togglerId: number;
}) {
  const handleShow = () => onShow && onShow(togglerId);

  return (
    <div
      className={clsx(
        'sh rounded-[20px] border border-gray bg-white px-8 py-6 shadow-black/20 drop-shadow-style-2 max-md:p-6',
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
      <Collapse in={show}>
        <hr className="my-4 border-gray" />
        <div className="mb-2 mt-6">{children}</div>
      </Collapse>
    </div>
  );
}

function ConcernTitle({
  width,
  height,
  icon,
  title,
}: {
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
            src={`/its-time-to-rethink-kibble/${icon}`}
            alt=""
            width={width}
            height={height}
            className="mr-5 inline-block max-sm:mr-0 sm:absolute sm:right-[100%] sm:top-1/2 sm:-translate-y-1/2"
          />
          <div className="pt-3 sm:hidden"></div>
          <p className="heading-4 font-bold text-primary lang-zh:font-normal  sm:inline">{title}</p>
        </div>
      </div>
    </div>
  );
}
export default function Concern() {
  const b = useTranslations('Button');
  const w = useTranslations('WhyFresh');
  const i = useTranslations('WhyFresh-ItsTimeToRethinkKibble');
  const [showId, setShowId] = React.useState(0);
  const handleShow = (id: number) => (id === showId ? setShowId(0) : setShowId(id));
  return (
    <Block className="bg-primary bg-opacity-10">
      <Container className="!max-w-5xl">
        <h2 className="heading-1 text-center font-bold text-primary lang-zh:font-normal">
          {i.rich('block-5-title')}
        </h2>
        <Toggler
          show={showId === 1}
          togglerId={1}
          onShow={handleShow}
          className={{ root: 'mt-6' }}
          title={
            <ConcernTitle
              width={60}
              height={53}
              icon="concern-1.svg"
              title={i.rich('block-5-mark-1-title')}
            />
          }
        >
          <p className="body-1">{i.rich('block-5-mark-1-content-1')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-1-content-2')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-1-content-3')}</p>
        </Toggler>
        <Toggler
          show={showId === 2}
          togglerId={2}
          onShow={handleShow}
          className={{ root: 'mt-6' }}
          title={
            <ConcernTitle
              width={65}
              height={39}
              icon="concern-2.svg"
              title={i.rich('block-5-mark-2-title')}
            />
          }
        >
          <p className="body-1">{i.rich('block-5-mark-2-content-1')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-2-content-2')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-2-content-3')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-2-content-4')}</p>
        </Toggler>
        <Toggler
          show={showId === 3}
          togglerId={3}
          onShow={handleShow}
          className={{ root: 'mt-6' }}
          title={
            <ConcernTitle
              width={58}
              height={52}
              icon="concern-3.svg"
              title={i.rich('block-5-mark-3-title')}
            />
          }
        >
          <p className="body-1">{i.rich('block-5-mark-3-content-1')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-3-content-2')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-3-content-3')}</p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-3-content-4')}</p>
        </Toggler>
        <Toggler
          show={showId === 4}
          togglerId={4}
          onShow={handleShow}
          className={{ root: 'mt-6' }}
          title={
            <ConcernTitle
              width={38}
              height={52}
              icon="concern-4.svg"
              title={i.rich('block-5-mark-4-title')}
            />
          }
        >
          <p className="body-1">{i.rich('block-5-mark-4-content-1')}</p>
          <div className="mt-6"></div>
          <p className="body-1">
            {i.rich('block-5-mark-4-content-2', {
              h: (chunks) => <span className="text-secondary">{chunks}</span>,
            })}
          </p>
          <div className="mt-6"></div>
          <p className="body-1">{i.rich('block-5-mark-4-content-3')}</p>
        </Toggler>
      </Container>
    </Block>
  );
}
