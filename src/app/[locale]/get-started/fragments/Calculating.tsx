import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { createCheckout, getDefaultDeliveryDate, initializeStripeTranscation } from '../actions';
import { OrderSize } from '@/enums';
import { CalendarEvent } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

export default function CalculatingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { owner, getDog } = useSurvey();
  const { name, recipe1, recipe2, mealPlan, isEnabledTransitionPeriod } = getDog();
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
    if (
      owner.email === undefined ||
      mealPlan === undefined ||
      isEnabledTransitionPeriod === undefined ||
      recipe1 === undefined
    ) {
      console.error('failed to calculate, there have some fields not yet completed');
      setTranscation(null);
    } else {
      createCheckout(
        owner.email,
        OrderSize.TwoWeek,
        mealPlan,
        isEnabledTransitionPeriod,
        recipe1,
        recipe2
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
  }, [owner, mealPlan, isEnabledTransitionPeriod, recipe1, recipe2]);

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
          {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })}
        </p>
      </Container>
    </motion.div>
  );
}
