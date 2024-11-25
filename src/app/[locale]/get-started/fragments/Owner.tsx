import debounce from 'debounce';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import { isAvailableEmailAddress } from '@/actions';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import TextField from '@/components/controls/TextField';
import { EMAIL_REGEXP } from '@/consts';
import useFormFieldDisplayState from '@/hooks/useFormFieldState';

interface OwnerForm {
  firstName: string;
  lastName: string;
  email: string;
}

export default function OwnerFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { owner, setOwner } = useSurvey();
  const form = useForm<OwnerForm>({
    mode: 'onBlur',
    defaultValues: owner,
  });
  const {
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    formState: { errors, isValid },
  } = form;
  const { displayState, displayButton, checkFieldDisplayState } =
    useFormFieldDisplayState<OwnerForm>(
      {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
      },
      watch,
      getValues,
      getFieldState,
      'onBlur'
    );

  const onSubmit = React.useCallback(
    (values: OwnerForm) => {
      setOwner(values);
      navigate(Stage.Calculating);
    },
    [navigate, setOwner]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <FormProvider {...form}>
        <Container className="text-center">
          <h1 className="heading-4 font-bold text-primary">{t('now-tell-us-a-bit-about-you')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-12" onBlur={checkFieldDisplayState}>
            <Section title={t('whats-your-name')}>
              <div className="mx-auto max-w-[320px]">
                <TextField
                  name="firstName"
                  placeholder={t('first-name')}
                  rules={{
                    required: t('please-enter-your-{}', { name: t('first-name').toLowerCase() }),
                  }}
                  errorOnEmpty
                  fullWidth
                />
                <div className="mt-5"></div>
                <TextField
                  name="lastName"
                  placeholder={t('last-name')}
                  rules={{
                    required: t('please-enter-your-{}', { name: t('last-name').toLowerCase() }),
                  }}
                  errorOnEmpty
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
                  disableErrorMessage
                  rules={{
                    required: true,
                    pattern: {
                      value: EMAIL_REGEXP,
                      message: t('this-{}-doesn-t-look-correct-please-update-it', {
                        name: t('email').toLowerCase(),
                      }),
                    },
                    validate: async (value) => {
                      const email = validator.normalizeEmail(value, {
                        gmail_remove_dots: false,
                        gmail_remove_subaddress: false,
                        outlookdotcom_remove_subaddress: false,
                        yahoo_remove_subaddress: false,
                        icloud_remove_subaddress: false,
                      });
                      if (!email || !validator.isEmail(email)) {
                        return t('this-{}-doesn-t-look-correct-please-update-it', {
                          name: t('email').toLowerCase(),
                        });
                      }
                      if (await isAvailableEmailAddress(email)) {
                        checkFieldDisplayState();
                        return true;
                      }
                      return t(
                        'looks-like-you-already-have-an-account-with-us-to-continue-please-log-in-using-the-link-below'
                      );
                    },
                  }}
                  fullWidth
                />
              </div>
              {errors?.email?.message && (
                <p className="mt-3 w-full text-error">
                  <span className="body-3">{String(errors?.email?.message)}</span>
                </p>
              )}
            </Section>
            <div className="mt-10">
              <UnderlineButton
                className="body-2 uppercase"
                href="/auth/login"
                label={t('already-have-an-account-log-in-here')}
              />
            </div>
            {displayButton && (
              <Button className="mt-10" disabled={!isValid}>
                {t('continue')}
              </Button>
            )}
          </form>
        </Container>
      </FormProvider>
    </motion.div>
  );
}
