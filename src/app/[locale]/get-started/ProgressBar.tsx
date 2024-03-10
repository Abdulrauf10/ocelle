import { useTranslations } from 'next-intl';
import Stage from './Stage';

interface ProgressBarProps {
  stage: Stage;
}

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

export default function ProgressBar({ stage }: ProgressBarProps) {
  const t = useTranslations();

  return (
    <div className="relative flex w-full flex-1 whitespace-nowrap">
      <div className="absolute bottom-[5.5px] h-0.5 w-full bg-primary"></div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="body-2 text-center text-gray">{t('dogs')}</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isDogStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="body-2 text-center text-gray">{t('you')}</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYouStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="body-2 text-center text-gray">{t('your-plan')}</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYourPlanStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="body-2 text-center text-gray">{t('checkout')}</div>
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
