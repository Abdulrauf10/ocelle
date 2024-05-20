import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Stage from '../Stage';
import { Dog, useSurvey } from '../SurveyContext';
import { createDraftOrder, initializeStripeTranscation } from '../actions';
import { pageVariants } from '../transition';

import { getClosestDeliveryDate } from '@/actions';
import Container from '@/components/Container';
import { DateOfBirthMethod } from '@/enums';
import { OrderFragment } from '@/gql/graphql';
import { getDateOfBirth } from '@/helpers/dog';
import { CalendarEvent } from '@/types';

function isIncompletedDogProfile(dog: Dog) {
  return (
    dog.name === undefined ||
    dog.sex === undefined ||
    dog.isNeutered === undefined ||
    dog.bodyCondition === undefined ||
    dog.activityLevel === undefined ||
    dog.foodAllergies === undefined ||
    dog.amountOfTreats === undefined ||
    dog.currentEating === undefined ||
    dog.pickiness === undefined ||
    dog.mealPlan === undefined ||
    dog.isEnabledTransitionPeriod === undefined ||
    dog.recipe1 === undefined
  );
}

export default function ProcessingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { owner, dogs } = useSurvey();
  const waitPromise = React.useMemo(() => new Promise((resolve) => setTimeout(resolve, 3000)), []);
  const [order, setOrder] = React.useState<OrderFragment | null>();
  const [closestDeliveryDate, setClosestDeliveryDate] = React.useState<Date | null>();
  const [calendarEvents, setCalendarEvents] = React.useState<CalendarEvent[] | null>();
  const [transcation, setTranscation] = React.useState<any | null>();

  React.useEffect(() => {
    getClosestDeliveryDate()
      .then((date) => setClosestDeliveryDate(new Date(date)))
      .catch((e) => {
        console.error(e);
        setClosestDeliveryDate(null);
      });
    fetch('/api/calendar')
      .then(async (calendarAPI) => {
        if (!calendarAPI.ok) {
          console.error('failed to fetch calendar events');
          setCalendarEvents(null);
        }
        const json = (await calendarAPI.json()) as CalendarEvent[];
        setCalendarEvents(
          json.map((record) => {
            return { ...record, start: new Date(record.start), end: new Date(record.end) };
          })
        );
      })
      .catch((e) => {
        console.error(e);
        setCalendarEvents(null);
      });
    const hasDogNotYetCompleted = dogs.some(isIncompletedDogProfile);
    if (owner.email === undefined || hasDogNotYetCompleted) {
      console.error('failed to calculate, there have some fields not yet completed');
      setTranscation(null);
    } else {
      createDraftOrder(
        dogs.map((dog) => {
          if (isIncompletedDogProfile(dog)) {
            throw new Error('unexcepted incompleted dog profile');
          }
          return {
            name: dog.name!,
            sex: dog.sex!,
            isNeutered: dog.isNeutered!,
            breeds: dog.isUnknownBreed ? undefined : dog.breeds?.map((breed) => breed.id),
            weight: dog.weight!,
            dateOfBirthMethod:
              typeof dog.age === 'string' ? DateOfBirthMethod.Calendar : DateOfBirthMethod.Manually,
            dateOfBirth:
              typeof dog.age === 'string' ? dog.age! : getDateOfBirth(dog.age!).toISOString(),
            bodyCondition: dog.bodyCondition!,
            activityLevel: dog.activityLevel!,
            foodAllergies: dog.foodAllergies!,
            amountOfTreats: dog.amountOfTreats!,
            currentEating: dog.currentEating!,
            pickiness: dog.pickiness!,
            mealPlan: dog.mealPlan!,
            isEnabledTransitionPeriod: dog.isEnabledTransitionPeriod!,
            recipe1: dog.recipe1!,
          };
        })
      )
        .then(async (order) => {
          setOrder(order);
          try {
            const data = await initializeStripeTranscation();
            setTranscation(data);
          } catch (e) {
            console.error(e);
            setTranscation(null);
          }
        })
        .catch((e) => {
          console.error(e);
          setOrder(null);
          setTranscation(null);
        });
    }
  }, [owner, dogs]);

  React.useEffect(() => {
    if (
      order === undefined ||
      closestDeliveryDate === undefined ||
      calendarEvents === undefined ||
      transcation === undefined
    ) {
      // fetching api and wait for the request has completed
      return;
    }
    if (
      order === null ||
      closestDeliveryDate === null ||
      calendarEvents === null ||
      transcation === null
    ) {
      console.error('there have some error during create the checkout');
      return navigate('/', {
        state: {
          checkoutError: true,
        },
      });
    }
    waitPromise.then(() => {
      navigate(Stage.Checkout, {
        state: {
          order,
          closestDeliveryDate,
          calendarEvents,
          stripe: transcation,
        },
        replace: true,
      });
    });
  }, [order, closestDeliveryDate, calendarEvents, transcation, waitPromise, navigate]);

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
        <div className="mt-8"></div>
        <p className="text-primary">
          {/* {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })} */}
        </p>
      </Container>
    </motion.div>
  );
}
