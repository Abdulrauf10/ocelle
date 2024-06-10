import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import Stage from './Stage';

function isCheckoutStage(stage: Stage) {
  if (stage === Stage.Checkout) {
    return true;
  }
}

function isYourPlanStage(stage: Stage, disablePrev?: boolean) {
  if (stage === Stage.ChoosePlan) {
    return true;
  }
  if (stage === Stage.RecommendedPlan) {
    return true;
  }
  if (!disablePrev && isCheckoutStage(stage)) {
    return true;
  }
}

function isYouStage(stage: Stage, disablePrev?: boolean) {
  if (stage === Stage.Owner) {
    return true;
  }
  if ((!disablePrev && isYourPlanStage(stage)) || isCheckoutStage(stage)) {
    return true;
  }
}

function isDogStage(stage: Stage, disablePrev?: boolean) {
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
  if (!disablePrev && (isYouStage(stage) || isYourPlanStage(stage) || isCheckoutStage(stage))) {
    return true;
  }
}

export default function ProgressBar({ stage }: { stage: Stage }) {
  const t = useTranslations();

  return (
    <div className="relative flex w-full flex-1 whitespace-nowrap ">
      <div className="absolute bottom-[5.5px] h-0.5 w-full bg-primary"></div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center',
              isDogStage(stage) ? 'text-primary' : 'text-gray',
              isDogStage(stage, true) && 'underline'
            )}
          >
            {t('dogs')}
          </div>
          <div className="mt-1"></div>
          <div
            className={clsx(
              'relative mx-auto h-3.5 w-3.5 rounded-full border border-primary',
              isDogStage(stage) ? 'bg-primary' : 'bg-white'
            )}
          />
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center',
              isYouStage(stage) ? 'text-primary' : 'text-gray',
              isYouStage(stage, true) && 'underline'
            )}
          >
            {t('you')}
          </div>
          <div className="mt-1"></div>
          <div
            className={clsx(
              'relative mx-auto h-3.5 w-3.5 rounded-full border border-primary',
              isYouStage(stage) ? 'bg-primary' : 'bg-white'
            )}
          />
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center',
              isYourPlanStage(stage) ? 'text-primary' : 'text-gray',
              isYourPlanStage(stage, true) && 'underline'
            )}
          >
            {t('your-plan')}
          </div>
          <div className="mt-1"></div>
          <div
            className={clsx(
              'relative mx-auto h-3.5 w-3.5 rounded-full border border-primary',
              isYourPlanStage(stage) ? 'bg-primary' : 'bg-white'
            )}
          />
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div
            className={clsx(
              'body-2 text-center',
              isCheckoutStage(stage) ? 'text-primary' : 'text-gray',
              isCheckoutStage(stage) && 'underline'
            )}
          >
            {t('checkout')}
          </div>
          <div className="mt-1"></div>
          <div
            className={clsx(
              'relative mx-auto h-3.5 w-3.5 rounded-full border border-primary',
              isCheckoutStage(stage) ? 'bg-primary' : 'bg-white'
            )}
          />
        </div>
      </div>
    </div>
  );
}
