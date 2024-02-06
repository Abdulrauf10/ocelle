'use client';

import React from 'react';
import clsx from 'clsx';
import theme from '@/app/mui-theme';
import Container from '@/components/Container';
import { Breed } from '@/entities';
import { Autocomplete, Chip, TextField, ThemeProvider } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import UnderlineButton from '@/components/UnderlineButton';
import DateCalendar from '@/components/controls/DateCalendar';
import PictureRadio from '@/components/controls/PictureRadio';
import Image from 'next/image';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import Headings from '@/components/Headings';

interface EditDogBlockProps {
  title: string;
  description?: string;
}

function EditDogBlock({
  title,
  description,
  children,
}: React.PropsWithChildren<EditDogBlockProps>) {
  const renderHead = () => {
    if (description) {
      return (
        <div className="-m-1 flex flex-wrap items-end pb-3">
          <Headings tag="h2" styles="h2" className="p-1 text-primary">
            {title}
          </Headings>
          <p className="p-1 max-md:w-full">{description}</p>
        </div>
      );
    }
    return (
      <Headings tag="h2" styles="h2" className="pb-3 text-primary">
        {title}
      </Headings>
    );
  };

  return (
    <div className="mt-20">
      {renderHead()}
      {children}
    </div>
  );
}

export default function EditDog({ params }: { params: { id: string } }) {
  const t = useTranslations();
  const {
    control,
    trigger,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [breedLoading, setBreedLoading] = React.useState(true);
  const [breedOptions, setBreedOptions] = React.useState<Breed[] | undefined>(undefined);
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>('Age');
  const allergiesOptions = React.useMemo(() => {
    return [
      { label: t('none'), value: 'none' },
      { label: t('chicken'), value: 'chicken' },
      { label: t('beef'), value: 'beef' },
      { label: t('pork'), value: 'pork' },
      { label: t('lamb'), value: 'lamb' },
      { label: t('duck'), value: 'duck' },
    ];
  }, [t]);

  const fetchBreeds = React.useCallback(async () => {
    if (breedOptions === undefined) {
      const res = await fetch('/api/breed');
      setBreedOptions((await res.json()) as Breed[]);
      setBreedLoading(false);
    }
  }, [breedOptions]);

  const name = 'Charlie';

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <Headings tag="h1" styles="h2" className="text-center text-primary">
            {t('edit-{}-information', { name })}
          </Headings>
          <EditDogBlock title={t('name')}>
            <Controller
              name="dogName"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder={t('your-dogs-name')} fullWidth {...field} />
              )}
            />
          </EditDogBlock>
          <EditDogBlock
            title={t('breeds')}
            description={t('({})', {
              value: t('if-theyre-a-mix-you-can-select-multiple-breeds'),
            })}
          >
            <Controller
              name="breed"
              control={control}
              rules={{ required: true }}
              defaultValue={[]}
              render={({ field: { onChange, ...field } }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  options={breedOptions || []}
                  loading={breedLoading}
                  onOpen={fetchBreeds}
                  getOptionLabel={(option) => option.enName}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('start-typing-the-breed')}
                      error={!!errors.breed}
                    />
                  )}
                  renderTags={(tagValue, getTagProps, state) =>
                    tagValue.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.id}
                        label={state.getOptionLabel(option)}
                      />
                    ))
                  }
                  onChange={(e, data) => onChange(data)}
                  {...field}
                />
              )}
            />
          </EditDogBlock>
          <EditDogBlock title={t('sex')}>
            <div className="-mx-3 flex">
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={1}
                  error={!!errors.gender}
                  control={control}
                  name="gender"
                  label={t('boy')}
                  rules={{ required: true }}
                />
              </div>
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={2}
                  error={!!errors.gender}
                  control={control}
                  name="gender"
                  label={t('girl')}
                  rules={{ required: true }}
                />
              </div>
            </div>
          </EditDogBlock>
          <EditDogBlock title="Neutered / Spayed">
            <div className="-mx-3 flex">
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={0}
                  error={!!errors.neuter}
                  control={control}
                  name="neuter"
                  label={watch('gender', 1) == 1 ? t('neutered') : t('spayed')}
                  rules={{ required: true }}
                />
              </div>
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={1}
                  error={!!errors.neuter}
                  control={control}
                  name="neuter"
                  label={watch('gender', 1) == 1 ? t('not-neutered') : t('not-spayed')}
                  rules={{ required: true }}
                />
              </div>
            </div>
          </EditDogBlock>
          <EditDogBlock
            title={t('age')}
            description={t('({})', { value: t('if-youre-unsure-just-give-us-your-best-guess') })}
          >
            <div className="flex w-full max-w-[260px] justify-between">
              <UnderlineButton
                underline={tab === 'Age'}
                className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
                onClick={() => setTab('Age')}
                label={t('enter-manually')}
              />
              <UnderlineButton
                underline={tab === 'Birthday'}
                className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
                onClick={() => setTab('Birthday')}
                label={t('select-birthday')}
              />
            </div>
            <div className="mt-4">
              {tab === 'Age' && (
                <div className="-mx-4 flex">
                  <div className="flex items-center px-4">
                    <Controller
                      name="years"
                      control={control}
                      rules={{ required: tab === 'Age' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          type="number"
                          className="mr-2 w-20"
                          inputProps={{ min: 0 }}
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                    <span className="ml-2">{t('years')}</span>
                  </div>
                  <div className="flex items-center px-4">
                    <Controller
                      name="months"
                      control={control}
                      rules={{ required: tab === 'Age' }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          type="number"
                          className="mr-2 w-20"
                          inputProps={{ min: 0 }}
                          {...field}
                          error={!!error}
                        />
                      )}
                    />
                    <span className="ml-2">{t('months')}</span>
                  </div>
                </div>
              )}
              {tab === 'Birthday' && (
                <div className="[&>div]:mx-0">
                  <DateCalendar
                    control={control}
                    name="birthday"
                    rules={{ required: tab === 'Birthday' }}
                    error={!!errors.birthday}
                  />
                </div>
              )}
            </div>
          </EditDogBlock>
          <EditDogBlock title={t('current-{}', { value: t('weight') })}>
            <div className="flex items-center">
              <Controller
                name="kgs"
                control={control}
                rules={{
                  required: true,
                  min: {
                    value: 0.5,
                    message: t('ocelle-is-currently-available-to-dogs-between-05-to-50-kg'),
                  },
                  max: {
                    value: 50,
                    message: t('ocelle-is-currently-available-to-dogs-between-05-to-50-kg'),
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    type="number"
                    className="mr-2 w-20"
                    inputProps={{ min: 0, step: 0.1 }}
                    {...field}
                    error={!!error}
                  />
                )}
              />
              <span className="ml-2">kg</span>
            </div>
            {errors?.kgs?.message && (
              <p className="mt-3 w-full text-error">{String(errors?.kgs?.message)}</p>
            )}
          </EditDogBlock>
          <EditDogBlock title={t('current-{}', { value: t('body-condition') })}>
            <div className="mt-4 max-w-[840px]">
              <PictureRadio
                name="bodyCondition"
                rules={{ required: true }}
                control={control}
                error={!!errors.bodyCondition}
                radios={[
                  {
                    label: t('too-skinny'),
                    value: 'too-skinny',
                    children: (
                      <Image
                        src="/question/body-skinny.svg"
                        alt="dog skinny"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('just-right'),
                    value: 'just-right',
                    children: (
                      <Image
                        src="/question/body-just-right.svg"
                        alt="dog just right"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('rounded'),
                    value: 'rounded',
                    children: (
                      <Image
                        src="/question/body-rounded.svg"
                        alt="dog rounded"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                  {
                    label: t('chunky'),
                    value: 'chunky',
                    children: (
                      <Image
                        src="/question/body-chunky.svg"
                        alt="dog chunky"
                        width={120}
                        height={99}
                      />
                    ),
                  },
                ]}
              />
            </div>
            <p className="mt-5 text-primary">
              [{t('visible-rib-cage-spine-noticeable-loss-of-muscle-mass')}]
            </p>
            <p className="mt-5 italic text-primary">[{t('adjust-their-calories')}]</p>
          </EditDogBlock>
          <EditDogBlock title={t('activity-level')}>
            <div className="mt-4 max-w-[640px]">
              <PictureRadio
                name="active"
                rules={{ required: true }}
                control={control}
                error={!!errors.active}
                radios={[
                  {
                    label: t('mellow'),
                    value: 'mellow',
                    children: (
                      <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={95} />
                    ),
                  },
                  {
                    label: t('active'),
                    value: 'active',
                    children: (
                      <Image src="/question/active.svg" alt="Active dog" width={80} height={95} />
                    ),
                  },
                  {
                    label: t('very-active'),
                    value: 'very-active',
                    children: (
                      <Image
                        src="/question/very-active.svg"
                        alt="Very Active dog"
                        width={110}
                        height={95}
                      />
                    ),
                  },
                ]}
              />
            </div>
            <p className="mt-5 text-primary">
              [{t('less-than-30-minutes-of-outdoor-daily-activity')}]
            </p>
          </EditDogBlock>
          <EditDogBlock title={t('food-allergies-sensitivities')}>
            <div className="-mx-3 -mt-4 flex max-w-[640px] flex-wrap">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="checkbox"
                  label={allergiesOptions[0].label}
                  value={allergiesOptions[0].value}
                  control={control}
                  name="allergies[0]"
                  error={Array.isArray(errors.allergies) && !!errors.allergies[0]}
                  rules={{
                    validate: {
                      required: (value, formValues) =>
                        formValues.allergies.some((value: unknown) => !!value),
                      conflict: (value, formValues) =>
                        value &&
                        !formValues.allergies.some(
                          (value: unknown, idx: number) => idx > 0 && !!value
                        ),
                    },
                  }}
                  onChange={() => trigger('allergies')}
                />
              </div>
              {allergiesOptions.map((option, idx) => {
                if (idx === 0) {
                  return;
                }
                return (
                  <div className="mt-4 px-3" key={option.value}>
                    <InteractiveBlock
                      type="checkbox"
                      label={allergiesOptions[idx].label}
                      value={allergiesOptions[idx].value}
                      control={control}
                      name={`allergies[${idx}]`}
                      error={Array.isArray(errors.allergies) && !!errors.allergies[idx]}
                      rules={{
                        validate: {
                          required: (value, formValues) =>
                            formValues.allergies.some((value: unknown) => !!value),
                          conflict: (value, formValues) => !(value && formValues.allergies[0]),
                        },
                      }}
                      onChange={() => trigger('allergies')}
                    />
                  </div>
                );
              })}
            </div>
            {Array.isArray(errors.allergies) &&
              errors.allergies.some((x) => x.type === 'conflict') && (
                <p className="mx-auto mt-3 max-w-[360px] text-sm text-error">
                  You’ve indicated that [Charlie] has no allergies (“None!”) as well as allergies to
                  [
                  {getValues('allergies')
                    .map((v: unknown, i: number) => (v ? allergiesOptions[i].label : v))
                    .filter((v: unknown, i: number) => !!v && i !== 0)
                    .join(', ')}
                  ]. Please recheck and re-enter your selection.
                </p>
              )}
          </EditDogBlock>
          <EditDogBlock title={t('amount-of-treats-table-scrapes-normally-consumed')}>
            <div className="-mx-3 -mt-4 flex flex-wrap">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="none"
                  control={control}
                  name="treats"
                  label={t('none')}
                  error={!!errors.treats}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="some"
                  control={control}
                  name="treats"
                  label={t('some')}
                  error={!!errors.treats}
                  rules={{ required: true }}
                />
              </div>
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="lots"
                  control={control}
                  name="treats"
                  label={t('lots')}
                  error={!!errors.treats}
                  rules={{ required: true }}
                />
              </div>
            </div>
          </EditDogBlock>
          <EditDogBlock title={t('pickiness-around-mealtime')}>
            <div className="mt-4 max-w-[640px]">
              <PictureRadio
                name="picky"
                rules={{ required: true }}
                control={control}
                error={!!errors.picky}
                radios={[
                  {
                    label: t('can-be-picky'),
                    value: 'picky',
                    children: (
                      <div className="flex items-end">
                        <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                      </div>
                    ),
                  },
                  {
                    label: t('is-a-good-eater'),
                    value: 'eater',
                    children: (
                      <div className="flex items-end">
                        <Image
                          src="/question/good-eater.svg"
                          alt="Eater dog"
                          width={80}
                          height={73}
                        />
                      </div>
                    ),
                  },
                  {
                    label: t('will-eat-anything'),
                    value: 'eatAnything',
                    children: (
                      <Image
                        src="/question/eat-anything.svg"
                        alt="Eat anything dog"
                        width={70}
                        height={81}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </EditDogBlock>
          <div className="mx-auto mb-10 mt-20 max-w-[480px]">
            <div className="-mx-2 flex">
              <div className="w-1/2 px-2">
                <Button fullWidth onClick={reset} reverse>
                  {t('cancel')}
                </Button>
              </div>
              <div className="w-1/2 px-2">
                <Button fullWidth>{t('save-changes')}</Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </ThemeProvider>
  );
}
