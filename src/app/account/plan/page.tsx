'use client';

import React from 'react';
import clsx from 'clsx';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import Button from '@/components/Button';
import UnderlineButton from '@/components/UnderlineButton';
import Image from 'next/image';
import DogSwitch from '../DogSwitch';

export default function Plan() {
  const mbBoxClassName = clsx(
    'max-md:border-brown max-md:rounded-[30px] max-md:border max-md:bg-white max-md:p-6 max-md:shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] mx-auto'
  );

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <div className="item-center -mx-4 -my-3 flex max-sm:flex-col-reverse">
            <div className="flex-1 px-4 py-3 max-sm:text-center">
              <H2 inline className="text-primary">
                Welcome Back, [Kevan]
              </H2>
              <p className="mt-4">
                Keep tabs on your subscription and edit [Charlie]’s information.
              </p>
            </div>
            <div className="px-4 py-3">
              <DogSwitch />
            </div>
          </div>
          <div className="py-6"></div>
          <H2 inline className="text-primary max-md:text-center">
            Your Dog:
          </H2>
          <div className="border-brown mx-auto mt-4 rounded-[30px] border bg-white px-4 py-2 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:max-w-[520px] max-md:text-center">
            <div className="flex flex-wrap items-center">
              <div className="flex-1 px-3 py-3">
                <div className="text-brown text-xl font-bold">[Muffin]</div>
                <div className="mt-2">[Poodle]</div>
                <div className="mt-3">
                  [7 years and 7 months old, 8 kg, mellow, is spayed, and has no allergies / food
                  sensitivities.]
                </div>
                <div className="mt-3">
                  <UnderlineButton label="View [Charlie]’s Feeding Guidelines" />
                </div>
              </div>
              <div className="px-3 py-3 max-md:w-full">
                <Button theme="primary" href="/account/dog/1">
                  Edit Dog’s Details
                </Button>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <H2 inline className="text-primary max-md:text-center">
            [Charlie]’s Box:
          </H2>
          <div className="border-brown mt-4 rounded-[30px] border bg-white px-8 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.1)] max-md:border-none max-md:bg-transparent max-md:p-0 max-md:shadow-none">
            <div className="-mx-3 flex max-md:block">
              <div className="px-3 text-center">
                <div
                  className={clsx(
                    'max-md:flex max-md:flex-col max-md:items-center',
                    mbBoxClassName
                  )}
                >
                  <Image
                    src="/ocelle-box.jpg"
                    alt="Ocelle Box"
                    width={280}
                    height={274}
                    className="rounded-2xl"
                  />
                  <div className="max-w-[280px]">
                    <p className="mt-3">
                      Upcoming box arrives by the{' '}
                      <span className="text-brown whitespace-nowrap font-bold">
                        [15th of December 2023]
                      </span>
                    </p>
                    <div className="mt-3">
                      <UnderlineButton
                        theme="primary"
                        label="Manage Delivery Date"
                        href="/account/plan/delivery-date"
                      />
                    </div>
                    <p className="mt-3">
                      You can make changes until the{' '}
                      <span className="text-brown whitespace-nowrap font-bold">
                        [10th of December 2023] 11:59PM
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-3">
                <div className="border-gray h-full w-px border-l"></div>
              </div>
              <div className="flex-1 px-3">
                <div
                  className={clsx(
                    'flex h-full flex-col justify-between max-md:mt-6 max-sm:text-center',
                    mbBoxClassName
                  )}
                >
                  <div className="text-brown text-lg font-bold">What’s Included In This Box:</div>
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between">
                    <span className="flex-1 px-1 py-2">
                      [2 weeks] supply of fresh, healthy food.
                    </span>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label="Manage Order Size"
                        href="/account/plan/often"
                      />
                    </div>
                  </div>
                  <hr className="border-gray my-3 max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between max-sm:mb-2">
                    <div className="text-brown flex-1 px-1 py-2 text-lg font-bold">
                      [2] Fresh Recipes
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label="Manage Recipes"
                        href="/account/plan/recipe"
                      />
                    </div>
                  </div>
                  <div className="mx-auto mb-4 mt-2">
                    <div className="-mx-2 -my-4 flex justify-between max-sm:flex-col">
                      <div className="px-2 py-4">
                        <Image
                          src="/meal-plan/chicken.jpg"
                          alt="Chicken Recipe"
                          width={180}
                          height={180}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">Fresh Chicken Recipe</p>
                      </div>
                      <div className="px-2 py-4">
                        <div className="border-gray h-full w-px border-l max-sm:w-full max-sm:border-b"></div>
                      </div>
                      <div className="px-2 py-4">
                        <Image
                          src="/meal-plan/lamb.jpg"
                          alt="Lamb Recipe"
                          width={180}
                          height={180}
                          className="rounded-3xl shadow-[5px_5px_12px_rgba(0,0,0,.1)]"
                        />
                        <p className="mt-2 text-center">Fresh Lamb Recipe</p>
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray my-3 max-sm:my-6" />
                  <div className="-mx-1 -my-2 flex flex-wrap justify-between">
                    <div className="text-brown flex-1 px-1 py-2 text-lg font-bold">
                      Fresh [Full/Half] Plan
                    </div>
                    <div className="whitespace-nowrap px-1 py-2 max-sm:w-full">
                      <UnderlineButton
                        theme="primary"
                        label="Manage Meal Plan"
                        href="/account/plan/meal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6"></div>
          <div className="rounded-[30px] bg-primary px-3 py-6 text-white max-md:py-8">
            <div className="flex items-center max-md:flex-col">
              <div className="px-4">
                <Image src="/referral-box.svg" alt="Referral Box" width={300} height={300} />
              </div>
              <div className="px-4 max-md:text-center">
                <H2 inline>
                  Know More Dog People? Refer a Friend, Earn{' '}
                  <span className="text-[1.1em] font-bold">[$50]</span>
                </H2>
                <p className="mt-3">
                  Refer your friends to try OCELLE with a special discount code and get{' '}
                  <span className="text-[1.4em] font-bold">[$50]</span> off your next box!
                </p>
                <Button className="mt-6">Refer a Friend</Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
