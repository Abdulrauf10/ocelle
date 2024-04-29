import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import TextField from '@/components/controls/TextField';

interface DogForm {
  name: string;
}

export default function DogFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { setDog, getDog } = useSurvey();
  const { name } = getDog();
  const { handleSubmit, control } = useForm<DogForm>({ defaultValues: { name } });
  const [showMoreDogs, setShowMoreDogs] = React.useState(false);

  const onSubmit = React.useCallback(
    (values: DogForm) => {
      setDog(values);
      navigate(Stage.DogBasic);
    },
    [navigate, setDog]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <Section title={t('whats-your-dogs-name')}>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 max-w-[320px]">
            <TextField
              name="name"
              placeholder={t('your-dogs-name')}
              control={control}
              rules={{ required: true }}
              fullWidth
            />
            <Button className="mt-10">{t('continue')}</Button>
          </form>
          <UnderlineButton
            className="body-2 mt-10"
            onClick={() => setShowMoreDogs(true)}
            label={t('i-have-more-dogs')}
          />
          {showMoreDogs && (
            <p className="body-3 mt-5 italic text-primary">{t.rich('i-have-more-dogs:reply')}</p>
          )}
        </Section>
      </Container>
    </motion.div>
  );
}
