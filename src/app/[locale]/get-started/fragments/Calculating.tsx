import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { createCheckout, getDefaultDeliveryDate, initializeStripeTranscation } from '../actions';
import { OrderSize } from '@/enums';
import { CalendarEvent } from '@/types';

export default function CalculatingFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { owner, getDog } = useSurvey();
  const { name, recipe1, recipe2, mealPlan, isEnabledTransitionPeriod } = getDog();

  React.useEffect(() => {
    if (
      owner.email === undefined ||
      mealPlan === undefined ||
      isEnabledTransitionPeriod === undefined ||
      recipe1 === undefined
    ) {
      throw new Error('there have some fields not yet completed');
    }
    Promise.all([
      getDefaultDeliveryDate(),
      fetch('/api/calendar'),
      createCheckout(
        owner.email,
        OrderSize.TwoWeek,
        mealPlan,
        isEnabledTransitionPeriod,
        recipe1,
        recipe2
      ),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]).then(async ([defaultDeliveryDate, calendarAPI, { checkout, gateways }]) => {
      if (!calendarAPI.ok) {
        throw new Error('failed to fetch calendar events');
      }
      const json = (await calendarAPI.json()) as CalendarEvent[];
      const data = await initializeStripeTranscation();
      navigate(Stage.Checkout, {
        state: {
          defaultDeliveryDate,
          calendarEvents: json.map((record) => {
            return { ...record, start: new Date(record.start), end: new Date(record.end) };
          }),
          stripe: data,
        },
        replace: true,
      });
    });
  }, [navigate, owner, mealPlan, isEnabledTransitionPeriod, recipe1, recipe2]);

  return (
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
  );
}
