import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Stage from './Stage';

const PageOrder = [
  Stage.Welcome,
  Stage.Dog,
  Stage.DogBasic,
  Stage.DogAge,
  Stage.DogPreference1,
  Stage.DogPreference2,
  Stage.Owner,
  Stage.ChoosePlan,
  Stage.RecommendedPlan,
  Stage.Checkout,
];

function isCheckoutStage(stage: Stage) {
  if (stage === Stage.Checkout) {
    return true;
  }
  return false;
}

function isYourPlanStage(stage: Stage) {
  if (stage === Stage.ChoosePlan) {
    return true;
  }
  if (stage === Stage.RecommendedPlan) {
    return true;
  }
  return false;
}

function isYouStage(stage: Stage) {
  if (stage === Stage.Owner) {
    return true;
  }
  return false;
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
  return false;
}

function ProgressBarButton({
  current,
  visited,
  onClick,
  children,
}: React.PropsWithChildren<{
  current: boolean;
  visited: boolean;
  onClick?(): void;
}>) {
  return (
    <div className="px-1">
      <button
        onClick={onClick}
        className={clsx(
          'body-2 mx-auto block text-center',
          onClick && 'hover:text-secondary',
          visited ? 'text-primary' : 'text-gray'
        )}
        disabled={!onClick}
      >
        {children}
      </button>
      <div className="pt-1"></div>
      <div
        className={clsx(
          'relative mx-auto h-3.5 w-3.5 rounded-full border border-primary',
          current ? 'bg-primary' : 'bg-white'
        )}
      />
    </div>
  );
}

export default function ProgressBar({ stage }: { stage: Stage }) {
  const t = useTranslations();
  const navigate = useNavigate();

  const popToYourPlanStage = React.useCallback(() => {
    const diff = PageOrder.indexOf(stage) - PageOrder.indexOf(Stage.RecommendedPlan);
    if (diff > 0) {
      navigate(diff * -1);
    }
  }, [stage, navigate]);

  const popToYouStage = React.useCallback(() => {
    const diff = PageOrder.indexOf(stage) - PageOrder.indexOf(Stage.Owner);
    if (diff > 0) {
      navigate(diff * -1);
    }
  }, [stage, navigate]);

  const popToDogStage = React.useCallback(() => {
    const diff = PageOrder.indexOf(stage) - PageOrder.indexOf(Stage.DogPreference2);
    if (diff > 0) {
      navigate(diff * -1);
    }
  }, [stage, navigate]);

  return (
    <div className="relative flex w-full flex-1 whitespace-nowrap ">
      <div className="absolute bottom-[5.5px] h-0.5 w-full bg-primary"></div>
      <div className="w-1/4">
        <ProgressBarButton
          onClick={
            PageOrder.indexOf(stage) > PageOrder.indexOf(Stage.DogPreference2)
              ? popToDogStage
              : undefined
          }
          visited={
            isDogStage(stage) ||
            isYouStage(stage) ||
            isYourPlanStage(stage) ||
            isCheckoutStage(stage)
          }
          current={isDogStage(stage)}
        >
          {t('dogs')}
        </ProgressBarButton>
      </div>
      <div className="w-1/4">
        <ProgressBarButton
          onClick={
            PageOrder.indexOf(stage) > PageOrder.indexOf(Stage.Owner) ? popToYouStage : undefined
          }
          visited={isYouStage(stage) || isYourPlanStage(stage) || isCheckoutStage(stage)}
          current={isYouStage(stage)}
        >
          {t('you')}
        </ProgressBarButton>
      </div>
      <div className="w-1/4">
        <ProgressBarButton
          onClick={
            PageOrder.indexOf(stage) > PageOrder.indexOf(Stage.RecommendedPlan)
              ? popToYourPlanStage
              : undefined
          }
          visited={isYourPlanStage(stage) || isCheckoutStage(stage)}
          current={isYourPlanStage(stage)}
        >
          {t('your-plan')}
        </ProgressBarButton>
      </div>
      <div className="w-1/4">
        <ProgressBarButton visited={isCheckoutStage(stage)} current={isCheckoutStage(stage)}>
          {t('checkout')}
        </ProgressBarButton>
      </div>
    </div>
  );
}
