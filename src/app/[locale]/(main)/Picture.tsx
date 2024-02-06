'use client';

import Button from '@/components/Button';
import DogFoot from '@/components/icons/DogFoot';
import List from '@/components/List';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

export default function Picture() {
  const t = useTranslations();
  const dogRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(dogRef, { once: true });

  return (
    <div className="bg-[#e6e6e6] bg-[url('./banner-bg.svg')] bg-[length:auto_100%] bg-center bg-repeat-x">
      <div className="flex flex-wrap items-center max-md:flex-col-reverse">
        <div className="relative w-3/5 px-[2vw] py-[5vw] pr-0 text-primary max-md:w-full max-md:border-t-[10px] max-md:border-primary max-md:p-[30px]">
          <h1 className="text-[5vw] font-bold leading-[6.2vw] max-sm:text-[40px] max-sm:leading-[46px]">
            Nutrition They Need. <br />
            Food They Want.
          </h1>
          <div className="my-5 text-xl">
            <List
              picture={<DogFoot className="mr-5 h-6 w-6 fill-primary" />}
              className={{ listItem: 'py-1' }}
              items={[
                'Tasty fresh food delivered to your door',
                'Meals customised to your dog’s specific nutritional needs',
                'Vet developed formula',
                'Easier for you, better for them!',
              ]}
            />
          </div>
          <Button className="mt-4" href="/get-started">
            {t('get-started')}
          </Button>
        </div>
        <div className="w-2/5 self-end max-md:w-full">
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
