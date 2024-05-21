import { queryOptions, useQuery } from '@tanstack/react-query';
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

export default function CalculatingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog } = useSurvey();
  const dog = getDog();
  const options = queryOptions({
    queryKey: [
      'minPerDayPrice',
      dog.age,
      dog.isNeutered,
      dog.isUnknownBreed,
      dog.breeds ? JSON.stringify(dog.breeds) : undefined,
      dog.weight,
      dog.bodyCondition,
      dog.activityLevel,
    ],
    queryFn: () =>
      getMinPerDayPrice({
        isNeutered: dog.isNeutered!,
        breeds: dog.isUnknownBreed ? undefined : dog.breeds?.map((breed) => breed.id),
        weight: dog.weight!,
        dateOfBirth:
          typeof dog.age === 'string' ? dog.age! : getDateOfBirth(dog.age!).toISOString(),
        bodyCondition: dog.bodyCondition!,
        activityLevel: dog.activityLevel!,
      }),
  });
  const { isLoading, data } = useQuery(options);
  const waitPromise = React.useMemo(() => new Promise((resolve) => setTimeout(resolve, 3000)), []);

  React.useEffect(() => {
    if (isLoading) {
      // fetching api and wait for the request has completed
      return;
    }
    if (data === null) {
      console.error('there have some error during calculation, redirect to the home page');
      return navigate('/', {
        state: {
          calculationError: true,
        },
      });
    }
    waitPromise.then(() => {
      getSurveySessionStore().set('min-prices', data);
      navigate(Stage.ChoosePlan, { replace: true });
    });
  }, [waitPromise, isLoading, data, navigate]);

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
