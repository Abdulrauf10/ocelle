import { useMutation, useQuery } from '@tanstack/react-query';
import { startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Stage from '../Stage';
import { Dog, dogToDogDto, useSurvey } from '../SurveyContext';
import {
  calculateDogsTotalPerDayPrice,
  createDraftOrder,
  initializeStripeTranscation,
} from '../actions';
import { pageVariants } from '../transition';

import { getClosestDeliveryDate, getEvents } from '@/actions';
import Container from '@/components/Container';

export default function ProcessingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { dogs } = useSurvey();
  const waitPromise = React.useMemo(() => new Promise((resolve) => setTimeout(resolve, 3000)), []);
  const { data: closestDeliveryDate, isLoading: loadingDeliveryDate } = useQuery({
    queryKey: [startOfDay(new Date()).toISOString()],
    queryFn: async () => new Date(await getClosestDeliveryDate()),
  });
  const { data: calendarEvents, isLoading: loadingCalenadarEvents } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => getEvents(),
  });
  const { data: dogsPerDayPrice, isLoading: loadingDogsPerDayPrice } = useQuery({
    queryKey: ['dogs'],
    queryFn: () => calculateDogsTotalPerDayPrice(dogs.map(dogToDogDto)),
  });
  const {
    data: order,
    mutate: draftOrderMutate,
    isPending: draftOrderPending,
    isIdle: draftOrderIdle,
  } = useMutation({
    mutationFn: (dogs: Dog[]) => createDraftOrder(dogs.map((dog) => dogToDogDto(dog))),
  });
  const {
    data: transcation,
    mutate: transcationMutate,
    isPending: transcationPending,
    isIdle: transcationIdle,
  } = useMutation({
    mutationFn: () => initializeStripeTranscation(),
  });

  React.useEffect(() => {
    draftOrderMutate(dogs);
  }, [dogs, draftOrderMutate]);

  React.useEffect(() => {
    if (order) {
      transcationMutate();
    }
  }, [order, dogs, transcationMutate]);

  React.useEffect(() => {
    if (
      loadingDogsPerDayPrice ||
      loadingDeliveryDate ||
      loadingCalenadarEvents ||
      draftOrderIdle ||
      draftOrderPending ||
      transcationIdle ||
      transcationPending
    ) {
      // fetching api and wait for the request has completed
      return;
    }
    if (!dogsPerDayPrice || !order || !closestDeliveryDate || !calendarEvents || !transcation) {
      console.error('there have some error during create the draft order');
      return navigate('/', {
        state: {
          checkoutError: true,
        },
      });
    }
    waitPromise.then(() => {
      navigate(Stage.Checkout, {
        state: {
          dogsPerDayPrice,
          order,
          closestDeliveryDate,
          calendarEvents,
          stripe: transcation,
        },
        replace: true,
      });
    });
  }, [
    dogsPerDayPrice,
    order,
    closestDeliveryDate,
    calendarEvents,
    transcation,
    loadingDogsPerDayPrice,
    loadingDeliveryDate,
    loadingCalenadarEvents,
    draftOrderIdle,
    draftOrderPending,
    transcationIdle,
    transcationPending,
    waitPromise,
    navigate,
  ]);

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Image
          src="/get-started/loading.gif"
          alt="loading indicator"
          width={200}
          height={200}
          className="inline-block"
          unoptimized
        />
        <div className="mt-8"></div>
        <h1 className="heading-4 font-bold text-primary">{t('calculating')}</h1>
        <div className="mt-8"></div>
        <p className="text-primary">
          {/* {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })} */}
        </p>
      </Container>
    </motion.div>
  );
}
