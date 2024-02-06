import Button from '@/components/Button';
import Container from '@/components/Container';
import Image from 'next/image';
import Benefits from '../Benefits';
import Section from '../Section';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function WelcomeFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();

  return (
    <Container className="text-center">
      <Section
        title={t.rich('get-started-welcome', {
          br: () => <br />,
        })}
      >
        <p className="text-primary">{t('lets-determine-your-recommended-meal-plan-and-price')}</p>
        <p className="mt-5 flex items-center justify-center text-left text-primary">
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
  );
}
