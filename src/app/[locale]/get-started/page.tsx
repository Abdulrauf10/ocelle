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
import Header from '@/components/Header';
import theme from '@/app/mui-theme';
import FragmentRouter, { useFragmentRouterController } from '@/components/FragmentRouter';
import { SurveyContextProvider } from './SurveyContext';

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
  const controller = useFragmentRouterController({
    defaultRoute: Stage.Welcome,
    routes: [
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
    ],
  });

  return (
    <ThemeProvider theme={theme}>
      <Header
        sticky={false}
        menu={false}
        languageSwitch={false}
        getStarted={false}
        startAdornment={
          <div className="hidden px-2 max-lg:block">
            <BackButton
              show={
                controller.route !== Stage.Welcome &&
                controller.route !== Stage.Calculating &&
                controller.route !== Stage.ThankYou
              }
              onClick={() => controller.navigate(-1)}
            />
          </div>
        }
        endAdornment={
          !(controller.route === Stage.Calculating || controller.route === Stage.ThankYou) && (
            <div className="w-full max-lg:px-2">
              <div className="flex w-full justify-center max-lg:mt-8 lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <BackButton
                    className="absolute -left-[80px] select-none max-lg:hidden"
                    show={controller.route !== Stage.Welcome}
                    onClick={() => controller.navigate(-1)}
                  />
                  <ProgressBar stage={controller.route || Stage.Welcome} />
                </div>
              </div>
            </div>
          )
        }
      />
      <main className="py-[3vw] max-sm:py-8">
        <SurveyContextProvider>
          <FragmentRouter controller={controller} />
        </SurveyContextProvider>
      </main>
    </ThemeProvider>
  );
}
