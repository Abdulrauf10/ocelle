'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import List from '@/components/List';

interface SlideProps {
  dog: string;
  plan: string;
  listItems: React.ReactNode[];
  picture: string;
}

function Slide({ dog, plan, listItems, picture, children }: React.PropsWithChildren<SlideProps>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const h = useTranslations('Home');
  return (
    <div ref={ref} className="flex w-full justify-center">
      <div className="flex flex-wrap items-start justify-center pb-14 max-lg:flex-col-reverse max-lg:justify-start">
        {/* <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.5 }}
          className="max-w-[560px] rounded-[30px] bg-white py-12 pl-12 pr-24 text-left shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-lg:-mt-5 max-lg:ml-8 max-lg:px-12 max-lg:py-10 max-lg:shadow-[-7px_7px_5px_rgba(185,130,59,0.3)]"
        > */}
        <div className="max-w-[560px] rounded-[30px] bg-white py-12 pl-12 pr-24 text-left shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-lg:-mt-5 max-lg:ml-8 max-lg:px-6 max-lg:py-10 max-lg:shadow-[-7px_7px_5px_rgba(185,130,59,0.3)]">
          <h3 className="heading-3 heading-weight-2 text-gold">{h('{}-plan', { name: dog })}</h3>
          <div className="pt-4"></div>
          <div className="inline-block rounded-3xl border border-current px-11 py-1 uppercase text-gold">
            <span className="body-1">{plan}</span>
          </div>
          <div className="pt-6"></div>
          <p className="body-1">{children}</p>
          <div className="pt-6"></div>
          <List
            picture={
              <div className="">
                <Image
                  src="/brown-tick.png"
                  className={'mr-3 h-[22px] w-[22px]'}
                  width={24}
                  height={24}
                  alt="brown tick"
                />
              </div>
            }
            className={{
              list: '-my-1.5',
              row: 'py-1.5 text-gold',
              item: 'body-1',
            }}
            items={listItems}
          />
          {/* </motion.div> */}
        </div>
        {/* <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="relative z-10 -ml-12 mt-48 text-left max-lg:m-0"
        > */}
        <div className="relative z-10 -ml-12 mt-48 text-left max-lg:m-0">
          <div className="relative w-[420px] overflow-hidden rounded-[30px] pt-[89.2%] shadow-[-7px_7px_5px_rgba(185,130,59,0.3)] max-lg:w-[280px] max-lg:shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-sm:w-[240px]">
            <Image alt={dog} src={picture} fill />
          </div>
        </div>
        {/* </motion.div> */}
      </div>
    </div>
  );
}

export default function CaseSwiper() {
  const h = useTranslations('Home');
  return (
    <Swiper
      spaceBetween={50}
      modules={[Pagination, Autoplay]}
      pagination={{ dynamicBullets: false, clickable: true }}
      autoplay={{ delay: 10000 }}
      speed={2000}
      loop={true}
    >
      <SwiperSlide>
        <Slide
          dog="Muffin"
          plan="Fresh Duck"
          picture="/dogs/muffin.jpeg"
          listItems={[
            h('weight-loss-support'),
            h('improved-digestive-health'),
            h('improved-allergies'),
          ]}
        >
          {h('muffin-content')}
        </Slide>
      </SwiperSlide>
      <SwiperSlide>
        <Slide
          dog="Pixie"
          plan="Fresh Beef"
          picture="/dogs/pixie.jpg"
          listItems={[h('eye-health'), h('joint-support'), h('sustained-energy')]}
        >
          {h('pixie-content')}
        </Slide>
      </SwiperSlide>
      <SwiperSlide>
        <Slide
          dog="Toast"
          plan="Fresh Pork"
          picture="/dogs/toast.jpg"
          listItems={[
            h('healthier-coat-and-skin'),
            h('improved-immunity'),
            h('improved-allergies'),
          ]}
        >
          {h('toast-content')}
        </Slide>
      </SwiperSlide>
    </Swiper>
  );
}
