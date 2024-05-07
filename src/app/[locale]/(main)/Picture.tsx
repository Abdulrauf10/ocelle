'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';

import Container from '@/components/Container';
import List from '@/components/List';
import Button from '@/components/buttons/Button';
import DogFoot from '@/components/icons/DogFoot';

export default function Picture() {
  const t = useTranslations('Home');
  const b = useTranslations('Button');
  const dogRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(dogRef, { once: true });

  return (
    <div className="bg-[#e6e6e6] bg-[url('./banner-bg.svg')] bg-[length:auto_100%] bg-center bg-repeat-x">
      <Container>
        <div className="flex flex-wrap items-center max-md:flex-col-reverse">
          <div className="relative w-3/5 py-[5vw] pr-0 text-primary max-md:w-full max-md:border-t-[10px] max-md:border-primary max-md:p-[30px]">
            <h1 className="heading-headline font-bold">
              {t('block-1-title-1')} <br />
              {t('block-1-title-2')}
            </h1>
            <div className="my-6"></div>
            <List
              picture={
                <div className="mt-[2px]">
                  <DogFoot className="mr-5 h-6 w-6 fill-primary" />
                </div>
              }
              className={{ row: 'py-1', item: 'body-1' }}
              items={[
                t('block-1-content-1'),
                t('block-1-content-2'),
                t('block-1-content-3'),
                t('block-1-content-4'),
              ]}
            />
            <div className="flex justify-center sm:justify-start ">
              <Button className="mt-4" href="/get-started">
                {b('get-started')}
              </Button>
            </div>
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
      </Container>
    </div>
  );
}
