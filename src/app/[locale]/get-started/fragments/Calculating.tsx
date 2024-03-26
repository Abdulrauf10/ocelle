import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { Dog, useSurvey } from '../SurveyContext';
import { createCheckout, getDefaultDeliveryDate, initializeStripeTranscation } from '../actions';
import { OrderSize } from '@/enums';
import { CalendarEvent } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';
import { startOfDay, subMonths, subYears } from 'date-fns';

function isIncompletedDogProfile(dog: Dog) {
  return (
    dog.name === undefined ||
    dog.gender === undefined ||
    dog.isNeutered === undefined ||
    dog.bodyCondition === undefined ||
    dog.activityLevel === undefined ||
    dog.foodAllergies === undefined ||
    dog.amountOfTreats === undefined ||
    dog.currentlyEating === undefined ||
    dog.pickiness === undefined ||
    dog.mealPlan === undefined ||
    dog.isEnabledTransitionPeriod === undefined ||
    dog.recipe1 === undefined
  );
}

export default function CalculatingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { owner, dogs } = useSurvey();
  const waitPromise = React.useMemo(() => new Promise((resolve) => setTimeout(resolve, 3000)), []);
  const [defaultDeliveryDate, setDefaultDeliveryDate] = React.useState<Date | null>();
  const [calendarEvents, setCalendarEvents] = React.useState<CalendarEvent[] | null>();
  const [transcation, setTranscation] = React.useState<any | null>();

  React.useEffect(() => {
    getDefaultDeliveryDate()
      .then(setDefaultDeliveryDate)
      .catch((e) => {
        console.error(e);
        setDefaultDeliveryDate(null);
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
      createCheckout(
        owner.email,
        OrderSize.TwoWeek,
        dogs.map((dog) => {
          if (isIncompletedDogProfile(dog)) {
            throw new Error('unexcepted incompleted dog profile');
          }
          return {
            name: dog.name!,
            gender: dog.gender!,
            isNeutered: dog.isNeutered!,
            breeds: dog.isUnknownBreed ? undefined : dog.breeds?.map((breed) => breed.id),
            weight: dog.weight!,
            dateOfBirthMethod: typeof dog.age === 'string' ? 'Calendar' : 'Manually',
            dateOfBirth:
              typeof dog.age === 'string'
                ? dog.age!
                : subMonths(
                    subYears(startOfDay(new Date()), dog.age!.years ?? 0),
                    dog.age!.months ?? 0
                  ).toISOString(),
            bodyCondition: dog.bodyCondition!,
            activityLevel: dog.activityLevel!,
            foodAllergies: dog.foodAllergies!,
            amountOfTreats: dog.amountOfTreats!,
            currentlyEating: dog.currentlyEating!,
            pickiness: dog.pickiness!,
            mealPlan: dog.mealPlan!,
            isEnabledTransitionPeriod: dog.isEnabledTransitionPeriod!,
            recipe1: dog.recipe1!,
          };
        })
      )
        .then(async ({ checkout, gateways }) => {
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
          setTranscation(null);
        });
    }
  }, [owner, dogs]);

  React.useEffect(() => {
    if (
      defaultDeliveryDate === undefined ||
      calendarEvents === undefined ||
      transcation === undefined
    ) {
      // fetching api and wait for the request has completed
      return;
    }
    if (defaultDeliveryDate === null || calendarEvents === null || transcation === null) {
      console.error('there have some error during create the checkout, redirect to the home page');
      return navigate('/', {
        state: {
          checkoutError: true,
        },
      });
    }
    waitPromise.then(() => {
      navigate(Stage.Checkout, {
        state: {
          defaultDeliveryDate,
          calendarEvents,
          stripe: transcation,
        },
        replace: true,
      });
    });
  }, [defaultDeliveryDate, calendarEvents, transcation, waitPromise, navigate]);

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
          {/* {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })} */}
        </p>
      </Container>
    </motion.div>
  );
}
