'use client';

import Image from 'next/image';
import Link from 'next/link';
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

const stageHistories: Stage[] = [];

export default function GetStarted() {
  const [stage, setStage] = React.useState<Stage>(Stage.Welcome);

  const back = React.useCallback(() => setStage(stageHistories.pop() || Stage.Welcome), []);

  return (
    <div>
      <header className="px-[15px] py-[15px]">
        <div className="relative flex flex-wrap items-center justify-between">
          <div className="hidden max-lg:block">
            <Back onClick={back} />
          </div>
          <Link href="/" className="px-[10px]">
            <Image alt="Ocelle" src="/ocelle-logo.png" width={160} height={48} />
          </Link>
          <Link href="#" className="mx-[10px] whitespace-nowrap hover:underline">
            Log In
          </Link>
          <div className="absolute bottom-0 flex w-full justify-center px-[280px] max-lg:static max-lg:mt-[30px] max-lg:px-0">
            <div className="relative w-full max-w-[460px]">
              <div className="absolute -left-[80px] max-lg:hidden">
                <Back onClick={back} />
              </div>
              <ProgressBar stage={stage} />
            </div>
          </div>
        </div>
      </header>
      <main className="py-[3vw] max-sm:py-[30px]">
        {stage === Stage.Welcome && <WelcomeFragment />}
        {stage === Stage.Dog && <DogFragment />}
        {stage === Stage.DogBasic && <DogBasicFragment />}
        {stage === Stage.DogAge && <DogAgeFragment />}
        {stage === Stage.DogPreference1 && <DogPreference1Fragment />}
        {stage === Stage.DogPreference2 && <DogPreference2Fragment />}
        {stage === Stage.Owner && <OwnerFragment />}
        {stage === Stage.Calculating && <CalculatingFragment />}
        {stage === Stage.ChoosePlan && <ChoosePlanFragment />}
        {stage === Stage.RecommendedPlan && <RecommendedPlanFragment />}
        {stage === Stage.Checkout && <CheckoutFragment />}
        {stage === Stage.ThankYou && <ThankYouFragment />}
      </main>
    </div>
  );
}
