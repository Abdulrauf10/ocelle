'use client';

import { motion } from 'framer-motion';
import ProgressBar from './ProgressBar';
import React from 'react';
import Stage from './Stage';
import WelcomeFragment from './fragments/Welcome';
import DogAgeFragment from './fragments/DogAge';
import DogFragment from './fragments/Dog';
import DogBasicFragment from './fragments/DogBasic';
import DogPreference1Fragment from './fragments/DogPreference1';
import DogPreference2Fragment from './fragments/DogPreference2';
import OwnerFragment from './fragments/Owner';
import CalculatingFragment from './fragments/Calculating';
import ChoosePlanFragment from './fragments/ChoosePlan';
import RecommendedPlanFragment from './fragments/RecommendedPlan';
import CheckoutFragment from './fragments/Checkout';
import ThankYouFragment from './fragments/ThankYou';
import Back from './Back';
import { ThemeProvider } from '@mui/material';
import theme from '../mui-theme';
import Header from '@/components/Header';
import FragmentViewer, { FragmentViewerRef } from '@/components/FragmentViewer';

interface BackButtonProps {
  show: boolean;
  className?: string;
  onClick(): void;
}

function BackButton({ show, className, onClick }: BackButtonProps) {
  return (
    <motion.div
      variants={{
        show: { opacity: 1, pointerEvents: 'all' },
        hide: { opacity: 0, pointerEvents: 'none' },
      }}
      initial={!show ? 'hide' : 'show'}
      animate={!show ? 'hide' : 'show'}
      transition={{ duration: 0.1 }}
      className={className}
    >
      <Back onClick={onClick} />
    </motion.div>
  );
}

export default function GetStarted() {
  const viewerRef = React.useRef<FragmentViewerRef<Stage>>();
  const route = viewerRef.current?.route;

  return (
    <ThemeProvider theme={theme}>
      <Header
        sticky={false}
        menu={false}
        languageSwitch={false}
        getStarted={false}
        startAdornment={
          <div className="hidden px-2 max-xl:block">
            {!(route === Stage.Calculating || route === Stage.ThankYou) && (
              <BackButton
                show={route !== Stage.Welcome}
                onClick={() => viewerRef.current?.navigate(-1)}
              />
            )}
          </div>
        }
        endAdornment={
          !(route === Stage.Calculating || route === Stage.ThankYou) && (
            <div className="w-full max-xl:px-2">
              <div className="flex w-full justify-center max-xl:mt-8 xl:absolute xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2 xl:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <BackButton
                    className="absolute -left-[80px] select-none max-xl:hidden"
                    show={route !== Stage.Welcome}
                    onClick={() => viewerRef.current?.navigate(-1)}
                  />
                  <ProgressBar stage={route || Stage.Welcome} />
                </div>
              </div>
            </div>
          )
        }
      />
      <main className="py-[3vw] max-sm:py-8">
        <FragmentViewer
          ref={viewerRef as React.Ref<FragmentViewerRef<unknown>>}
          defaultRoute={Stage.Welcome}
          routes={[
            {
              name: Stage.Welcome,
              component: WelcomeFragment,
            },
            {
              name: Stage.Dog,
              component: DogFragment,
            },
            {
              name: Stage.DogBasic,
              component: DogBasicFragment,
            },
            {
              name: Stage.DogAge,
              component: DogAgeFragment,
            },
            {
              name: Stage.DogPreference1,
              component: DogPreference1Fragment,
            },
            {
              name: Stage.DogPreference2,
              component: DogPreference2Fragment,
            },
            {
              name: Stage.Owner,
              component: OwnerFragment,
            },
            {
              name: Stage.Calculating,
              component: CalculatingFragment,
            },
            {
              name: Stage.ChoosePlan,
              component: ChoosePlanFragment,
            },
            {
              name: Stage.RecommendedPlan,
              component: RecommendedPlanFragment,
            },
            {
              name: Stage.Checkout,
              component: CheckoutFragment,
            },
            {
              name: Stage.ThankYou,
              component: ThankYouFragment,
            },
          ]}
        />
      </main>
    </ThemeProvider>
  );
}
