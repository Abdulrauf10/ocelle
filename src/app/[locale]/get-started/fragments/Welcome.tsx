import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useNavigate } from 'react-router-dom';

import Benefits from '../Benefits';
import Section from '../Section';
import Stage from '../Stage';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';

export default function WelcomeFragment() {
  const navigate = useNavigate();
  const t = useTranslations();

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section title={t.rich('get-started-welcome')}>
          <p className="body-3 text-primary">
            {t('lets-determine-your-recommended-meal-plan-and-price')}
          </p>
          <div className="mt-5"></div>
          <p className="body-3 flex items-center justify-center text-left text-primary">
            <Image
              src="/question/timer.svg"
              alt="Timer"
              width={30}
              height={26}
              className="mr-2 inline-block"
            />
            {t('this-should-only-take-about-2-minutes-per-dog')}
          </p>
          <Button className="mt-8" onClick={() => navigate(Stage.Dog)}>
            {t('lets-get-started')}
          </Button>
        </Section>
        <Benefits />
      </Container>
    </motion.div>
  );
}
