import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
import PictureRadio from '@/components/controls/PictureRadio';
import TextField from '@/components/controls/TextField';
import { ActivityLevel, BodyCondition } from '@/enums';
import { PadSpace } from '@/enums';
import DogHelper from '@/helpers/dog';
import useFormFieldDisplayState from '@/hooks/useFormFieldState';
import useSentence from '@/hooks/useSentence';

interface DogPreference1Form {
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
}

export default function DogPreference1Fragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { padSpace } = useSentence();
  const { getDog, setDog } = useSurvey();
  const { name, weight, bodyCondition, activityLevel, sex } = getDog();
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    getFieldState,
    formState: { errors, isValid },
  } = useForm<DogPreference1Form>({
    mode: 'onChange',
    defaultValues: {
      weight,
      bodyCondition,
      activityLevel,
    },
  });
  const { displayState, displayButton } = useFormFieldDisplayState<DogPreference1Form>(
    {
      weight: undefined,
      bodyCondition: undefined,
      activityLevel: undefined,
    },
    watch,
    getValues,
    getFieldState
  );

  const onSubmit = React.useCallback(
    ({ weight, bodyCondition, activityLevel }: DogPreference1Form) => {
      setDog({ weight, bodyCondition, activityLevel });
      navigate(Stage.DogPreference2);
    },
    [navigate, setDog]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
      <Container className="text-center">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Section
            description={t.rich(
              'if-youre-unsure-you-can-always-adjust-this-information-in-your-account-later'
            )}
          />
          <Section title={t('what-best-represents-their-current-body-condition')}>
            <div className="mt-10">
              <PictureRadio
                className={{
                  radioGroup: 'mx-auto max-w-[630px]',
                }}
                name="bodyCondition"
                watch={watch}
                rules={{
                  required: true,
                }}
                control={control}
                error={!!errors.bodyCondition || !!errors.weight}
                radios={[
                  {
                    label: t('too-skinny'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('visible-rib-cage-spine-noticeable-loss-of-muscle-mass')}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t.rich('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.TooSkinny,
                    children: (
                      <Image
                        src="/get-started/body-skinny.svg"
                        alt="dog skinny"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('just-right'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t(
                          'clear-waistline-and-tucked-in-belly-you-can-easily-feel-their-ribs-and-or-spine-but-they-are-not-clearly-visible'
                        )}
                      </p>
                    ),
                    value: BodyCondition.JustRight,
                    children: (
                      <Image
                        src="/get-started/body-just-right.svg"
                        alt="dog just right"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('rounded'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t('waistline-is-disappearing-difficult-to-feel-ribs-and-spine-broad-back')}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t.rich('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.Rounded,
                    children: (
                      <Image
                        src="/get-started/body-rounded.svg"
                        alt="dog rounded"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                  {
                    label: t('chunky'),
                    descripton: (
                      <p className="body-3 text-primary">
                        {t(
                          'waistline-is-lost-you-cannot-feel-their-ribs-and-spine-weight-is-a-serious-concern'
                        )}
                      </p>
                    ),
                    selectedDescription: (
                      <i className="body-3 text-primary">{t.rich('adjust-their-calories')}</i>
                    ),
                    value: BodyCondition.Chunky,
                    children: (
                      <Image
                        src="/get-started/body-chunky.svg"
                        alt="dog chunky"
                        width={91}
                        height={75}
                      />
                    ),
                  },
                ]}
                onChange={() => {
                  if (getValues('weight') !== undefined) {
                    trigger('weight');
                  }
                }}
              />
            </div>
            {errors?.bodyCondition?.message && (
              <p className="mt-3 w-full text-error">
                <span className="body-3">
                  {String(errors?.bodyCondition?.message)
                    .split('[br]')
                    .map((v, idx, arr) => [
                      v.trim(),
                      arr.length - 1 === idx ? undefined : <br key={v} />,
                    ])
                    .flat()}
                </span>
              </p>
            )}
          </Section>
          {displayState.bodyCondition && (
            <>
              <SectionBreak />
              <Section
                title={t('what-is-{}-current-weight', {
                  name: padSpace(PadSpace.Right, name),
                })}
              >
                <div className="flex flex-wrap items-center justify-center">
                  <TextField
                    name="weight"
                    type="number"
                    control={control}
                    disableErrorMessage
                    rules={{
                      required: true,
                      validate: (value, { weight, bodyCondition }) => {
                        const idealWeight = DogHelper.calculateIdealWeight(weight, bodyCondition);
                        if (idealWeight > 50 || idealWeight < 0.5) {
                          return 'ideal-weight';
                        }
                        return true;
                      },
                    }}
                    className="mr-2 w-20"
                    inputProps={{ className: 'text-center', min: 0, step: 0.5 }}
                    InputProps={{
                      sx: {
                        input: {
                          MozAppearance: 'textfield',
                          '&::-webkit-outer-spin-button': { appearance: 'none', margin: 0 },
                          '&::-webkit-inner-spin-button': { appearance: 'none', margin: 0 },
                        },
                      },
                    }}
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
                    }
                    beforeOnChange={(e) => {
                      if (e.target.value.indexOf('.') === -1) {
                        return e;
                      }
                      const [integer, decimal] = e.target.value.split('.');
                      if (!decimal) {
                        return e;
                      }
                      e.target.value = `${integer}.${decimal.substring(0, 2)}`;
                      return e;
                    }}
                  />
                  <span className="body-3 ml-2">KG</span>
                  {errors?.weight?.message && (
                    <p className="mt-3 w-full text-error">
                      <span className="body-3">
                        {errors?.weight?.message === 'ideal-weight'
                          ? t.rich(
                              'unfortunately-{}-needs-are-a-bit-outside-our-regular-portion-offerings-however-we-may-be-able-to-help-please-contact-our-customer-service-team',
                              {
                                name: padSpace(PadSpace.Both, name),
                                link: (chunks) => (
                                  <UnderlineButton
                                    label={chunks}
                                    href="mailto:info@ocelle.dog"
                                    underline
                                    className="!text-error"
                                  />
                                ),
                              }
                            )
                          : String(errors?.weight?.message)}
                      </span>
                    </p>
                  )}
                </div>
              </Section>
            </>
          )}
          {displayState.weight && displayState.bodyCondition && (
            <>
              <SectionBreak />
              <Section
                title={t('how-active-is', {
                  name: padSpace(PadSpace.Right, name),
                })}
              >
                <div className="mt-10">
                  <PictureRadio
                    className={{
                      radioGroup: 'mx-auto max-w-[440px]',
                    }}
                    name="activityLevel"
                    watch={watch}
                    rules={{ required: true }}
                    control={control}
                    error={!!errors.activityLevel}
                    radios={[
                      {
                        label: t('mellow'),
                        descripton: (
                          <p className="body-3 text-primary">
                            {t('less-than-30-minutes-of-daily-outdoor-activity')}
                          </p>
                        ),
                        value: ActivityLevel.Mellow,
                        children: (
                          <Image
                            src="/get-started/mellow.svg"
                            alt="Mellow dog"
                            width={68}
                            height={43}
                          />
                        ),
                      },
                      {
                        label: t('active'),
                        descripton: (
                          <p className="body-3 text-primary">
                            {t('around-1-2-hours-of-daily-outdoor-activity')}
                          </p>
                        ),
                        value: ActivityLevel.Active,
                        children: (
                          <Image
                            src="/get-started/active.svg"
                            alt="Active dog"
                            width={51}
                            height={61}
                          />
                        ),
                      },
                      {
                        label: t('very-active'),
                        descripton: (
                          <p className="body-3 text-primary">
                            {t('more-than-2-hours-of-daily-outdoor-activity')}
                          </p>
                        ),
                        value: ActivityLevel.VeryActive,
                        children: (
                          <Image
                            src="/get-started/very-active.svg"
                            alt="Very Active dog"
                            width={79}
                            height={61}
                          />
                        ),
                      },
                    ]}
                  />
                </div>
              </Section>
            </>
          )}
          {displayButton && (
            <Button className="mt-8" disabled={!isValid}>
              {t('continue')}
            </Button>
          )}
        </form>
      </Container>
    </motion.div>
  );
}
