import Button from '@/components/Button';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import UnderlineButton from '@/components/UnderlineButton';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../transition';

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
    formState: { errors },
  } = useForm<OwnerForm>({
    defaultValues: owner,
  });

  const onSubmit = React.useCallback(
    (values: OwnerForm) => {
      setOwner(values);
      navigate(Stage.ChoosePlan);
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
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} placeholder={t('first-name')} fullWidth {...field} />
                )}
              />
              <div className="mt-5"></div>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} placeholder={t('last-name')} fullWidth {...field} />
                )}
              />
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('whats-your-email-address')}>
            <div className="mx-auto max-w-[320px]">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value:
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: '[This email doesn’t look correct, please update it.]',
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField error={!!error} placeholder={t('email')} fullWidth {...field} />
                )}
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
          <Button className="mt-10">{t('continue')}</Button>
        </form>
      </Container>
    </motion.div>
  );
}
