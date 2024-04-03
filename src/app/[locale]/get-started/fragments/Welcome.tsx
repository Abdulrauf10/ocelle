import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import Image from 'next/image';
import Benefits from '../Benefits';
import Section from '../Section';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

export default function WelcomeFragment() {
  const navigate = useNavigate();
  const t = useTranslations();

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section
          title={t.rich('get-started-welcome', {
            br: () => <br />,
          })}
        >
          <p className="body-3 text-primary">
            {t('lets-determine-your-recommended-meal-plan-and-price')}
          </p>
          <p className="body-3 mt-5 flex items-center justify-center text-left text-primary">
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
