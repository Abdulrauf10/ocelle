'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import { ThemeProvider, createTheme } from '@mui/material';

function PopupIcon() {
  return (
    <svg viewBox="0 0 13 7" width={20} className="px-0.5">
      <polyline
        className="fill-none stroke-[#a98d72]"
        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
        points="12.5 .5 6.5 6.5 .5 .5"
      />
    </svg>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-jost)',
  },
  palette: {
    primary: {
      main: '#A98D72',
    },
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: <PopupIcon />,
      },
      styleOverrides: {
        inputRoot: {
          paddingTop: 3,
          paddingBottom: 3,
        },
        paper: {
          marginTop: 8,
        },
        listbox: {
          padding: 8,
        },
        option: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        input: {
          padding: '14px 16.5px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
});

const backVariants: Variants = {
  show: { opacity: 1, pointerEvents: 'all' },
  hide: { opacity: 0, pointerEvents: 'none' },
};

const fragmentVariants: Variants = {
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
};

const stageHistories: Stage[] = [];

function AnimatePresenceDiv({ name, children }: React.PropsWithChildren<{ name: string }>) {
  return (
    <motion.div
      key={name}
      variants={fragmentVariants}
      initial="outside"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export default function GetStarted() {
  const [stage, setStage] = React.useState<Stage>(Stage.Welcome);

  const back = React.useCallback(() => {
    console.log(stageHistories);
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
      <header className="px-[15px] py-[15px]">
        <div className="relative flex flex-wrap items-center justify-between">
          <div className="hidden max-lg:block">
            <Back onClick={back} />
          </div>
          <Link href="/" className="relative z-10 px-[10px]">
            <Image alt="Ocelle" src="/ocelle-logo.png" width={160} height={48} />
          </Link>
          <Link href="#" className="relative z-10 mx-[10px] whitespace-nowrap hover:underline">
            Log In
          </Link>
          {!(stage === Stage.Calculating || stage === Stage.ThankYou) && (
            <div className="absolute bottom-0 flex w-full justify-center px-[280px] max-lg:static max-lg:mt-[30px] max-lg:px-0">
              <div className="relative w-full max-w-[460px]">
                <motion.div
                  variants={backVariants}
                  initial={stage === Stage.Welcome ? 'hide' : 'show'}
                  animate={stage === Stage.Welcome ? 'hide' : 'show'}
                  transition={{ duration: 0.1 }}
                  className="absolute -left-[80px] select-none max-lg:hidden"
                >
                  <Back onClick={back} />
                </motion.div>
                <ProgressBar stage={stage} />
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="py-[3vw] max-sm:py-[30px]">
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
              <RecommendedPlanFragment />
            </AnimatePresenceDiv>
          )}
          {stage === Stage.Checkout && (
            <AnimatePresenceDiv name="checkout">
              <CheckoutFragment />
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
