import React from 'react';
import Image from 'next/image';
import Container from '@/components/Container';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

export default function CalculatingFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog } = useSurvey();
  const { name } = getDog();

  React.useEffect(() => {
    setTimeout(() => {
      navigate(Stage.ChoosePlan, { replace: true });
    }, 3000);
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
          {t('were-crunching-some-numbers-to-formulate-{}-meal-plan', { name })}
        </p>
      </Container>
    </motion.div>
  );
}
