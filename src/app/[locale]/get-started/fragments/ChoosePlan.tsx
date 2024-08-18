import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { roundTo } from 'round-to';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import FreshPlan from '@/components/FreshPlan';
import Button from '@/components/buttons/Button';
import { MealPlan } from '@/enums';
import { getSurveySessionStore } from '@/helpers/session';
import { MinPricesDto } from '@/types/dto';

export default function ChoosePlanFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  const { getDog, setDog } = useSurvey();
  const { name, mealPlan } = getDog();
  const firstUpdate = React.useRef(true);
  const minPrices = React.useMemo(() => {
    return getSurveySessionStore().get('min-prices') as MinPricesDto | undefined;
  }, []);
  const [currentMealPlan, setCurrentMealPlan] = React.useState<MealPlan>(mealPlan ?? MealPlan.Full);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    if (firstUpdate.current && currentMealPlan == null) {
      setError(t('you-must-select-either-one-of-the-plan'));
      firstUpdate.current = false;
    } else {
      setError(undefined);
    }
  }, [t, currentMealPlan]);

  const onSubmit = React.useCallback(() => {
    if (currentMealPlan == null) {
      setError(t('you-must-select-either-one-of-the-plan'));
    } else {
      setDog({ mealPlan: currentMealPlan });
      if (location.state?.isEdit) {
        navigate(Stage.Processing, { replace: true });
      } else {
        navigate(Stage.RecommendedPlan);
      }
    }
  }, [t, currentMealPlan, location.state, navigate, setDog]);

  if (!minPrices) {
    console.error('cannot find min prices, redirect to home page');
    throw navigate('/');
  }

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section title={t('choose-the-best-plan-for-you-and-{}', { name })}>
          <div className="mx-auto flex max-w-[900px] flex-wrap">
            <div className="w-1/2 px-2 max-lg:w-full">
              <FreshPlan
                title={t('fresh-full-plan')}
                picture="/meal-plan/full-plan.jpg"
                pricePerDay={roundTo(minPrices.fullPlan, 2)}
                discountedPricePerDay={roundTo(minPrices.fullPlan / 2, 2)}
                firstDiscount
                error={!!error}
                recommended
                selected={currentMealPlan === MealPlan.Full}
                onSelect={() => setCurrentMealPlan(MealPlan.Full)}
              >
                {t('fresh-full-plan:description')}
              </FreshPlan>
            </div>
            <div className="w-1/2 px-2 max-lg:mt-8 max-lg:w-full">
              <FreshPlan
                title={t('fresh-half-plan')}
                picture="/meal-plan/half-plan.jpg"
                pricePerDay={roundTo(minPrices.halfPlan, 2)}
                discountedPricePerDay={roundTo(minPrices.halfPlan / 2, 2)}
                firstDiscount
                error={!!error}
                selected={currentMealPlan === MealPlan.Half}
                onSelect={() => setCurrentMealPlan(MealPlan.Half)}
              >
                {t('fresh-half-plan:description')}
              </FreshPlan>
            </div>
          </div>
          {error && <p className="mt-5 text-error">{error}</p>}
        </Section>
        <Button className="mt-10" onClick={onSubmit}>
          {t('continue')}
        </Button>
      </Container>
    </motion.div>
  );
}
