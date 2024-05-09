import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { getMinPerDayPrice } from '../actions';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
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
  }, [
    dog.age,
    dog.isNeutered,
    dog.isUnknownBreed,
    dog.breeds,
    dog.weight,
    dog.bodyCondition,
    dog.activityLevel,
  ]);

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
  }, [waitPromise, minPrices, navigate]);

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
        <div className="mt-8"></div>
        <h1 className="heading-4 font-bold text-primary">{t('calculating')}</h1>
        <p className="mt-8 text-primary">
          {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name: dog.name })}
        </p>
      </Container>
    </motion.div>
  );
}
