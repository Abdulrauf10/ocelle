import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import TextField from '@/components/controls/TextField';
import { EMAIL_REGEXP } from '@/consts';

interface OwnerForm {
  firstName: string;
  lastName: string;
  email: string;
}

export default function OwnerFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { owner, setOwner } = useSurvey();
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<OwnerForm>({
    mode: 'onChange',
    defaultValues: owner,
  });

  const onSubmit = React.useCallback(
    (values: OwnerForm) => {
      setOwner(values);
      navigate(Stage.Calculating);
    },
    [navigate, setOwner]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <h1 className="heading-4 font-bold text-primary">{t('now-tell-us-a-bit-about-you')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
          <Section title={t('whats-your-name')}>
            <div className="mx-auto max-w-[320px]">
              <TextField
                name="firstName"
                placeholder={t('first-name')}
                control={control}
                rules={{ required: true }}
                fullWidth
              />
              <div className="mt-5"></div>
              <TextField
                name="lastName"
                placeholder={t('last-name')}
                control={control}
                rules={{ required: true }}
                fullWidth
              />
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('whats-your-email-address')}>
            <div className="mx-auto max-w-[320px]">
              <TextField
                name="email"
                placeholder={t('email')}
                control={control}
                disableErrorMessage
                rules={{
                  required: true,
                  pattern: {
                    value: EMAIL_REGEXP,
                    message: t('this-{}-doesn-t-look-correct-please-update-it', {
                      name: t('email').toLowerCase(),
                    }),
                  },
                }}
                fullWidth
              />
            </div>
            {errors?.email?.message && (
              <p className="mt-3 w-full text-error">{String(errors?.email?.message)}</p>
            )}
          </Section>
          <div className="mt-10">
            <UnderlineButton
              className="body-2 uppercase"
              href="/auth/login"
              label={t('already-have-an-account-log-in-here')}
            />
          </div>
          <Button className="mt-10" disabled={!isValid}>
            {t('continue')}
          </Button>
        </form>
      </Container>
    </motion.div>
  );
}
