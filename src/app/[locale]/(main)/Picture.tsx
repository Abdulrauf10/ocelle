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
    <div className="bg-[#e6e6e6] bg-[url('/banner-bg.svg')] bg-[length:auto_100%] bg-center bg-repeat-x">
      <Container className="max-md:px-0">
        <div className="flex flex-wrap items-center max-md:flex-col-reverse">
          <div className="relative flex-1 pr-0 text-primary max-md:w-full max-md:border-t-[10px] max-md:border-primary max-md:p-[30px]">
            <h1 className="heading-headline heading-weight-1">{t.rich('block-1-title-1')}</h1>
            <div className="pt-8"></div>
            <List
              picture={
                <div className="-mt-0.5">
                  <DogFoot className="h-6 w-6 fill-primary" />
                </div>
              }
              className={{ list: '-my-2.5', row: 'py-2.5', icon: 'mr-5', item: 'body-1' }}
              items={[
                t.rich('block-1-content-1'),
                t.rich('block-1-content-2'),
                t.rich('block-1-content-3'),
                t.rich('block-1-content-4'),
              ]}
            />
            <div className="pt-8"></div>
            <div className="text-center sm:text-left">
              <Button href="/get-started">{b('get-started')}</Button>
            </div>
          </div>
          <div className="w-[500px] self-end max-xl:w-[375px] max-md:w-full">
            <div className="w-3/4 overflow-hidden max-xl:w-full max-md:m-auto max-md:max-w-[450px]">
              <motion.div
                ref={dogRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1.5 }}
                className="relative left-0 pt-[158%]"
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
