import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import Headings from '@/components/Headings';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function CalculatingFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(Stage.ChoosePlan, { replace: true });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  const name = 'Charlie';

  return (
    <Container className="text-center">
      <Image
        src="/question/loading.gif"
        alt="loading indicator"
        width={200}
        height={200}
        className="inline-block"
      />
      <Headings tag="h1" styles="h2" className="mt-8 font-bold text-primary">
        {t('calculating')}
      </Headings>
      <p className="mt-8 text-primary">
        {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })}
      </p>
    </Container>
  );
}
