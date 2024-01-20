'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
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

const stageHistories: Stage[] = [];

function AnimatePresenceDiv({ name, children }: React.PropsWithChildren<{ name: string }>) {
  return (
    <motion.div
      key={name}
      variants={{
        outside: {
          opacity: 0,
          x: 50,
        },
        enter: {
          opacity: 1,
          x: 0,
        },
        exit: {
          opacity: 0,
          x: -50,
        },
      }}
      initial="outside"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

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
  const [stage, setStage] = React.useState<Stage>(Stage.Welcome);

  const back = React.useCallback(() => {
    setStage(stageHistories.pop() || Stage.Welcome);
  }, []);

  const forward = React.useCallback(() => {
    if (stage !== Stage.Welcome) {
      stageHistories.push(stage);
    }
    setStage(() => {
      const nextStage = (stage as number) + 1;
      return nextStage as Stage;
    });
  }, [stage]);

  return (
    <ThemeProvider theme={theme}>
      <Header
        sticky={false}
        menu={false}
        languageSwitch={false}
        getStarted={false}
        startAdornment={
          <div className="hidden px-2 max-xl:block">
            {!(stage === Stage.Calculating || stage === Stage.ThankYou) && (
              <BackButton show={stage !== Stage.Welcome} onClick={back} />
            )}
          </div>
        }
        endAdornment={
          !(stage === Stage.Calculating || stage === Stage.ThankYou) && (
            <div className="w-full max-xl:px-2">
              <div className="flex w-full justify-center max-xl:mt-8 xl:absolute xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2 xl:px-[280px]">
                <div className="relative w-full max-w-[460px]">
                  <BackButton
                    className="absolute -left-[80px] select-none max-xl:hidden"
                    show={stage !== Stage.Welcome}
                    onClick={back}
                  />
                  <ProgressBar stage={stage} />
                </div>
              </div>
            </div>
          )
        }
      />
      <main className="overflow-hidden py-[3vw] max-sm:py-8">
        <AnimatePresence mode="wait" initial={false}>
          {stage === Stage.Welcome && (
            <AnimatePresenceDiv name="welcome">
              <WelcomeFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.Dog && (
            <AnimatePresenceDiv name="dog">
              <DogFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.DogBasic && (
            <AnimatePresenceDiv name="dog-basic">
              <DogBasicFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.DogAge && (
            <AnimatePresenceDiv name="dog-age">
              <DogAgeFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.DogPreference1 && (
            <AnimatePresenceDiv name="dog-pref-1">
              <DogPreference1Fragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.DogPreference2 && (
            <AnimatePresenceDiv name="dog-pref-2">
              <DogPreference2Fragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.Owner && (
            <AnimatePresenceDiv name="owner">
              <OwnerFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.Calculating && (
            <AnimatePresenceDiv name="calcuating">
              <CalculatingFragment />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.ChoosePlan && (
            <AnimatePresenceDiv name="choose-plan">
              <ChoosePlanFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.RecommendedPlan && (
            <AnimatePresenceDiv name="recomm-plan">
              <RecommendedPlanFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.Checkout && (
            <AnimatePresenceDiv name="checkout">
              <CheckoutFragment forward={forward} />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.ThankYou && (
            <AnimatePresenceDiv name="thank-you">
              <ThankYouFragment />
            </AnimatePresenceDiv>
          )}
        </AnimatePresence>
      </main>
    </ThemeProvider>
  );
}
