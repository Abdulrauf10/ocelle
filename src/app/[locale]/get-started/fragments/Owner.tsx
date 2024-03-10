import Button from '@/components/Button';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import UnderlineButton from '@/components/UnderlineButton';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';

export default function OwnerFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(() => {
    navigate(Stage.Calculating);
  }, [navigate]);

  return (
    <Container className="text-center">
      <h1 className="heading-3 font-bold text-primary">{t('now-tell-us-a-bit-about-you')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
        <Section title={t('whats-your-name')}>
          <div className="mx-auto max-w-[320px]">
            <Controller
              name="firstname"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder={t('first-name')} fullWidth {...field} />
              )}
            />
            <div className="mt-5"></div>
            <Controller
              name="lastname"
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
            className="text-lg uppercase"
            href="/auth/login"
            label={t('already-have-an-account-log-in-here')}
          />
        </div>
        <Button className="mt-10">{t('continue')}</Button>
      </form>
    </Container>
  );
}
