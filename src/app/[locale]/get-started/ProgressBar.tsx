import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Stage from './Stage';

function isCheckoutStage(stage: Stage) {
  if (stage === Stage.Checkout) {
    return true;
  }
}

function isYourPlanStage(stage: Stage) {
  if (stage === Stage.ChoosePlan) {
    return true;
  }
  if (stage === Stage.RecommendedPlan) {
    return true;
  }
  if (isCheckoutStage(stage)) {
    return true;
  }
}

function isYouStage(stage: Stage) {
  if (stage === Stage.Owner) {
    return true;
  }
  if (isYourPlanStage(stage) || isCheckoutStage(stage)) {
    return true;
  }
}

function isDogStage(stage: Stage) {
  if (stage === Stage.Dog) {
    return true;
  }
  if (stage === Stage.DogBasic) {
    return true;
  }
  if (stage === Stage.DogAge) {
    return true;
  }
  if (stage === Stage.DogPreference1) {
    return true;
  }
  if (stage === Stage.DogPreference2) {
    return true;
  }
  if (isYouStage(stage) || isYourPlanStage(stage) || isCheckoutStage(stage)) {
    return true;
  }
}

function isSingleDogsStage(stage: Stage) {
  const dogStages = [
    Stage.Dog,
    Stage.DogBasic,
    Stage.DogAge,
    Stage.DogPreference1,
    Stage.DogPreference2,
  ];
  if (dogStages.includes(stage)) {
    return true;
  }
}

function isSingleYouStage(stage: Stage) {
  const dogStages = [Stage.Owner];
  if (dogStages.includes(stage)) {
    return true;
  }
}

function isSingleYourplanStage(stage: Stage) {
  const dogStages = [Stage.ChoosePlan, Stage.RecommendedPlan];
  if (dogStages.includes(stage)) {
    return true;
  }
}

function isSingleCheckoutStage(stage: Stage) {
  const dogStages = [Stage.Checkout];
  if (dogStages.includes(stage)) {
    return true;
  }
}

export default function ProgressBar({ stage }: { stage: Stage }) {
  const t = useTranslations();
  console.log(stage);
  return (
    <div className="relative flex w-full flex-1 whitespace-nowrap ">
      <div className="absolute bottom-[5.5px] h-0.5 w-full bg-primary"></div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center text-primary',
              isSingleDogsStage(stage) && 'underline'
            )}
          >
            {t('dogs')}
          </div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isDogStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center text-primary',
              isSingleYouStage(stage) && 'underline'
            )}
          >
            {t('you')}
          </div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYouStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center text-primary',
              isSingleYourplanStage(stage) && 'underline'
            )}
          >
            {t('your-plan')}
          </div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYourPlanStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center text-primary',
              isSingleCheckoutStage(stage) && 'underline'
            )}
          >
            {t('checkout')}
          </div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isCheckoutStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
