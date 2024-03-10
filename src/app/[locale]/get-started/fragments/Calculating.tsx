import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';

export default function CalculatingFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { getDog } = useSurvey();
  const { name } = getDog();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(Stage.ChoosePlan, { replace: true });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

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
