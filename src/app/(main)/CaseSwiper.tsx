'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import TickList from '@/components/List/TickList';

import 'swiper/css';
import 'swiper/css/pagination';

export default function CaseSwiper() {
  return (
    <Swiper
      spaceBetween={50}
      modules={[Pagination]}
      pagination={{ dynamicBullets: true }}
      className="mt-[40px]"
    >
      <SwiperSlide>
        <div className="flex w-full justify-center">
          <div className="flex flex-wrap items-start justify-center pb-[60px] max-lg:flex-col-reverse max-lg:justify-start">
            <div className="max-w-[560px] rounded-[30px] bg-white py-[50px] pl-[50px] pr-[90px] text-left text-xl shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-lg:-mt-5 max-lg:ml-[30px] max-lg:px-[50px] max-lg:py-10 max-lg:shadow-[-7px_7px_5px_rgba(185,130,59,0.3)]">
              <h3 className="text-3xl font-bold text-[#be873b]">Bo&apos;s Plan</h3>
              <p className="text-2xl font-bold text-[#be873b]">SENIOR SQUIRREL CHASER</p>
              <div className="my-[10px]">
                <div className="my-2.5 ml-0 mr-[5px] inline-block rounded-[20px] border border-[#be873b] px-[45px] py-[3px] text-xl text-[#be873b]">
                  FRESH BEEF
                </div>
              </div>
              <p>
                A mellow 8-year-old pit mix and picky eater needs nutrients that support her
                physical health and the flavours she loves. Her Fresh Beef recipe plan ensures:
              </p>
              <div className="mt-[20px]">
                <TickList items={['Joint support', 'Extra energy', 'Shinier coat']} />
              </div>
            </div>
            <div className="relative z-[5] ml-[-50px] mt-[250px] text-left max-lg:m-0">
              <div className="relative w-[420px] overflow-hidden rounded-[30px] pt-[89.2%] shadow-[-7px_7px_5px_rgba(185,130,59,0.3)] max-lg:w-[280px] max-lg:shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-sm:w-[240px]">
                <Image alt="bo" src="/dogs/bo.jpeg" fill />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex w-full justify-center">
          <div className="flex flex-wrap items-start justify-center pb-[60px] max-lg:flex-col-reverse max-lg:justify-start">
            <div className="max-w-[560px] rounded-[30px] bg-white py-[50px] pl-[50px] pr-[90px] text-left text-xl shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-lg:-mt-5 max-lg:ml-[30px] max-lg:px-[50px] max-lg:py-10 max-lg:shadow-[-7px_7px_5px_rgba(185,130,59,0.3)]">
              <h3 className="text-3xl font-bold text-[#be873b]">Bo&apos;s Plan</h3>
              <p className="text-2xl font-bold text-[#be873b]">SENIOR SQUIRREL CHASER</p>
              <div className="my-[10px]">
                <div className="my-2.5 ml-0 mr-[5px] inline-block rounded-[20px] border border-[#be873b] px-[45px] py-[3px] text-xl text-[#be873b]">
                  FRESH BEEF
                </div>
              </div>
              <p>
                A mellow 8-year-old pit mix and picky eater needs nutrients that support her
                physical health and the flavours she loves. Her Fresh Beef recipe plan ensures:
              </p>
              <div className="mt-[20px]">
                <TickList items={['Joint support', 'Extra energy', 'Shinier coat']} />
              </div>
            </div>
            <div className="relative z-[5] ml-[-50px] mt-[250px] text-left max-lg:m-0">
              <div className="relative w-[420px] overflow-hidden rounded-[30px] pt-[89.2%] shadow-[-7px_7px_5px_rgba(185,130,59,0.3)] max-lg:w-[280px] max-lg:shadow-[7px_7px_5px_rgba(185,130,59,0.3)] max-sm:w-[240px]">
                <Image alt="bo" src="/dogs/bo.jpeg" fill />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
