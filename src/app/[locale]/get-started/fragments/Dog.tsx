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
import useFormFieldDisplayState from '@/hooks/useFormFieldState';

interface DogForm {
  name: string;
}

export default function DogFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { setDog, getDog } = useSurvey();
  const { name } = getDog();
  const {
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    control,
    formState: { isValid },
  } = useForm<DogForm>({
    defaultValues: {
      name,
    },
  });
  const { displayButton } = useFormFieldDisplayState<DogForm>(
    {
      name: undefined,
    },
    watch,
    getValues,
    getFieldState
  );
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
          <div className="mt-6"></div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[320px]">
            <TextField
              name="name"
              placeholder={t('your-dogs-name')}
              control={control}
              rules={{ required: true }}
              fullWidth
            />
            {displayButton && (
              <>
                <div className="pt-10"></div>
                <Button disabled={!isValid}>{t('continue')}</Button>
              </>
            )}
          </form>
          <div className="pt-10"></div>
          <div className="flex justify-center">
            <UnderlineButton
              onClick={() => setShowMoreDogs(!showMoreDogs)}
              label={<p className="body-2">{t('i-have-more-dogs')}</p>}
            />
          </div>
          {showMoreDogs && (
            <div className="pt-4">
              <p className="body-3 italic text-primary">
                {t.rich('i-have-more-dogs:reply', { br: () => <br className="max-md:hidden" /> })}
              </p>
            </div>
          )}
        </Section>
      </Container>
    </motion.div>
  );
}
