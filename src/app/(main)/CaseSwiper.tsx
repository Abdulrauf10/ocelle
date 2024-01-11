'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import TickList from '@/components/List/TickList';

import 'swiper/css';
import 'swiper/css/pagination';
import React from 'react';
import { motion, useInView } from 'framer-motion';

interface SlideProps {
  dog: string;
  plan: string;
  listItems: React.ReactNode[];
  picture: string;
}

function Slide({ dog, plan, listItems, picture, children }: React.PropsWithChildren<SlideProps>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className="flex w-full justify-center">
      <div className="flex flex-wrap items-start justify-center pb-[60px] max-lg:flex-col-reverse max-lg:justify-start">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.5 }}
          className="max-w-[560px] rounded-[30px] bg-white py-[50px] pl-[50px] pr-[90px] text-left text-xl shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-lg:-mt-5 max-lg:ml-[30px] max-lg:px-[50px] max-lg:py-10 max-lg:shadow-[-7px_7px_5px_rgba(185,130,59,0.3)]"
        >
          <h3 className="text-3xl font-bold text-[#be873b]">{dog} Plan</h3>
          <div className="my-[10px]">
            <div className="my-2.5 ml-0 mr-[5px] inline-block rounded-[20px] border border-[#be873b] px-[45px] py-[3px] text-xl uppercase text-[#be873b]">
              {plan}
            </div>
          </div>
          <p>{children}</p>
          <div className="mt-[20px]">
            <TickList items={listItems} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="relative z-[5] ml-[-50px] mt-[250px] text-left max-lg:m-0"
        >
          <div className="relative w-[420px] overflow-hidden rounded-[30px] pt-[89.2%] shadow-[-7px_7px_5px_rgba(185,130,59,0.3)] max-lg:w-[280px] max-lg:shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-sm:w-[240px]">
            <Image alt={dog} src={picture} fill />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CaseSwiper() {
  return (
    <Swiper
      spaceBetween={50}
      modules={[Pagination, Autoplay]}
      pagination={{ dynamicBullets: true }}
      className="mt-[40px]"
      autoplay={{ delay: 10000 }}
    >
      <SwiperSlide>
        <Slide
          dog="Muffin’s"
          plan="Fresh Duck"
          picture="/dogs/muffin.jpeg"
          listItems={[
            'Weight loss',
            'Improved digestive health (perfect poops!)',
            'Improved allergies',
          ]}
        >
          An active 9-year-old Poodle with allergies who’s on a weight loss journey. She needs
          flavourful food without excess calories that are easy to digest. Her Fresh Duck plan
          ensures:
        </Slide>
      </SwiperSlide>
      <SwiperSlide>
        <Slide
          dog="Pixie’s"
          plan="Fresh Beef"
          picture="/dogs/pixie.jpg"
          listItems={['Eye health', 'Joint support', 'Sustained energy']}
        >
          A mellow 10-year-old Bichon Friese, who’s a picky eater and needs nutrients that support
          her physical health with the flavours she loves. Her Fresh Beef plan ensures:
        </Slide>
      </SwiperSlide>
      <SwiperSlide>
        <Slide
          dog="Toast’s"
          plan="Fresh Pork"
          picture="/dogs/toast.jpg"
          listItems={['Healthier coat and skin', 'Improved immunity', 'Improved allergies']}
        >
          A very active 6-year-old Pug with severe allergies, who needs nutrient-rich food to fuel
          his active lifestyle, while being easy on his stomach. His Fresh Pork plan ensures:
        </Slide>
      </SwiperSlide>
    </Swiper>
  );
}
