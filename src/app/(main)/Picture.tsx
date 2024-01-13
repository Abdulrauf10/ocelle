'use client';

import Button from '@/components/Button';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function Picture() {
  const dogRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(dogRef, { once: true });

  return (
    <div className="bg-[url('./banner-bg.jpg')] bg-[length:auto_100%] bg-center bg-repeat-x">
      <div className="flex flex-wrap items-center max-md:flex-col-reverse">
        <div className="relative w-3/5 p-[2vw] pr-0 text-primary max-md:w-full max-md:border-t-[10px] max-md:border-primary max-md:p-[30px]">
          <h1 className="text-[5vw] font-bold leading-[6.2vw] max-sm:text-[40px] max-sm:leading-[46px]">
            Good Health Begins <br className="max-md:hidden" />
            With Healthy Food.
          </h1>
          <p className="my-5 text-xl">
            Fresh, deliciously good food. Approved by our Vet Nutritionist. Delivered to your door.
          </p>
          <Button href="/get-started">Get Started</Button>
        </div>
        <div className="w-2/5 max-md:w-full">
          <div className="w-3/4 overflow-hidden max-md:m-auto">
            <motion.div
              ref={dogRef}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1.5 }}
              className="relative pt-[158%]"
            >
              <Image alt="dog" src="/home-banner-dog.png" fill />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
