import Button from '@/components/buttons/Button';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import Section from '../Section';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

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
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder={t('your-dogs-name')} fullWidth {...field} />
              )}
            />
            <Button className="mt-10">{t('continue')}</Button>
          </form>
          <UnderlineButton
            className="body-2 mt-10"
            onClick={() => setShowMoreDogs(true)}
            label={t('i-have-more-dogs')}
          />
          {showMoreDogs && (
            <p className="body-3 mt-5 italic text-primary">
              {t.rich('i-have-more-dogs:reply', {
                br: () => <br />,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          )}
        </Section>
      </Container>
    </motion.div>
  );
}
