import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';
import { getMinPerDayPrice } from '../actions';
import { getDateOfBirth } from '@/helpers/dog';
import { getSurveySessionStore } from '@/helpers/session';
import { MinPricesDto } from '@/types/dto';

export default function CalculatingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog } = useSurvey();
  const dog = getDog();
  const waitPromise = React.useMemo(() => new Promise((resolve) => setTimeout(resolve, 3000)), []);
  const [minPrices, setMinPrices] = React.useState<MinPricesDto | null>();

  React.useEffect(() => {
    getMinPerDayPrice({
      isNeutered: dog.isNeutered!,
      breeds: dog.isUnknownBreed ? undefined : dog.breeds?.map((breed) => breed.id),
      weight: dog.weight!,
      dateOfBirth: typeof dog.age === 'string' ? dog.age! : getDateOfBirth(dog.age!).toISOString(),
      bodyCondition: dog.bodyCondition!,
      activityLevel: dog.activityLevel!,
    })
      .then(setMinPrices)
      .catch((e) => {
        console.error(e);
        setMinPrices(null);
      });
  }, []);

  React.useEffect(() => {
    if (minPrices === undefined) {
      // fetching api and wait for the request has completed
      return;
    }
    if (minPrices === null) {
      console.error('there have some error during calculation, redirect to the home page');
      return navigate('/', {
        state: {
          calculationError: true,
        },
      });
    }
    waitPromise.then(() => {
      getSurveySessionStore().set('min-prices', minPrices);
      navigate(Stage.ChoosePlan, { replace: true });
    });
  }, [navigate]);

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Image
          src="/question/loading.gif"
          alt="loading indicator"
          width={200}
          height={200}
          className="inline-block"
        />
        <h1 className="heading-4 mt-8 font-bold text-primary">{t('calculating')}</h1>
        <p className="mt-8 text-primary">
          {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name: dog.name })}
        </p>
      </Container>
    </motion.div>
  );
}
