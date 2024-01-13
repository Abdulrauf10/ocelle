import Stage from './Stage';

interface ProgressBarProps {
  stage: Stage;
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
}

function isYouStage(stage: Stage) {
  if (stage === Stage.Owner) {
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
}

function isCheckoutStage(stage: Stage) {
  if (stage === Stage.Checkout) {
    return true;
  }
}

export default function ProgressBar({ stage }: ProgressBarProps) {
  return (
    <div className="relative flex w-full flex-1 whitespace-nowrap">
      <div className="absolute bottom-[5.5px] h-0.5 w-full bg-primary"></div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="text-center text-lg text-[#9A9486]">Dogs</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isDogStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="text-center text-lg text-[#9A9486]">You</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYouStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="text-center text-lg text-[#9A9486]">Your Plan</div>
          <div className="relative mx-auto h-[14px] w-[14px] rounded-full border border-primary bg-white">
            {isYourPlanStage(stage) && (
              <div className="ml-0.5 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="px-1">
          <div className="text-center text-lg text-[#9A9486]">Checkout</div>
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
