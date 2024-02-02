'use client';

import React from 'react';
import clsx from 'clsx';
import theme from '@/app/mui-theme';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
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
          <H2 inline className="p-1 text-primary">
            {title}
          </H2>
          <p className="p-1 max-md:w-full">{description}</p>
        </div>
      );
    }
    return (
      <H2 inline className="pb-3 text-primary">
        {title}
      </H2>
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
  const t = useTranslations('general');
  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [breedLoading, setBreedLoading] = React.useState(true);
  const [breedOptions, setBreedOptions] = React.useState<Breed[] | undefined>(undefined);
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>('Age');
  const allergiesOptions = React.useMemo(() => {
    return [
      { label: 'None', value: 'none' },
      { label: 'Chicken', value: 'chicken' },
      { label: 'Beef', value: 'beef' },
      { label: 'Pork', value: 'pork' },
      { label: 'Lamb', value: 'lamb' },
      { label: 'Duck', value: 'duck' },
    ];
  }, []);

  const fetchBreeds = React.useCallback(async () => {
    if (breedOptions === undefined) {
      const res = await fetch('/api/breed');
      setBreedOptions((await res.json()) as Breed[]);
      setBreedLoading(false);
    }
  }, [breedOptions]);

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <Container className="max-w-[860px]">
          <H2 inline className="text-center text-primary">
            Edit [Charlie]’s Information
          </H2>
          <EditDogBlock title="Name">
            <Controller
              name="dogName"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <TextField error={!!error} placeholder="Your Dog’s Name" fullWidth {...field} />
              )}
            />
          </EditDogBlock>
          <EditDogBlock
            title="Breed(s)"
            description="(If they’re a mix, you can select multiple breeds.)"
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
                      placeholder="Start Typing The Breed"
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
          <EditDogBlock title="Sex">
            <div className="-mx-3 flex">
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={0}
                  error={!!errors.gender}
                  control={control}
                  name="gender"
                  label="Boy"
                  rules={{ required: true }}
                />
              </div>
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value={1}
                  error={!!errors.gender}
                  control={control}
                  name="gender"
                  label="Girl"
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
                  label="[Neutered]"
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
                  label="[Not Neutered]"
                  rules={{ required: true }}
                />
              </div>
            </div>
          </EditDogBlock>
          <EditDogBlock title="Age" description="(if you’re unsure, just give us your best guess!)">
            <div className="flex w-full max-w-[260px] justify-between">
              <UnderlineButton
                underline={tab === 'Age'}
                className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
                onClick={() => setTab('Age')}
                label="Enter Manually"
              />
              <UnderlineButton
                underline={tab === 'Birthday'}
                className={clsx('text-lg', tab === 'Birthday' ? 'font-bold' : '')}
                onClick={() => setTab('Birthday')}
                label="Select Birthday"
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
                    <span className="ml-2">Year(s)</span>
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
                    <span className="ml-2">Month(s)</span>
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
          <EditDogBlock title="Current Weight">
            <div className="flex items-center">
              <Controller
                name="kgs"
                control={control}
                rules={{
                  required: true,
                  min: {
                    value: 0.5,
                    message: '[Ocelle is currently available to dogs between 0.5 to 50 kg.]',
                  },
                  max: {
                    value: 50,
                    message: '[Ocelle is currently available to dogs between 0.5 to 50 kg.]',
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
          <EditDogBlock title="Current Body Condition">
            <div className="mt-4 max-w-[840px]">
              <PictureRadio
                name="bodyCondition"
                rules={{ required: true }}
                control={control}
                error={!!errors.bodyCondition}
                radios={[
                  {
                    label: 'Too Skinny',
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
                    label: 'Just Right',
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
                    label: 'Rounded',
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
                    label: 'Chunky',
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
              [Visible rib cage and / or spine. Noticeable loss of muscle mass.]
            </p>
            <p className="mt-5 italic text-primary">
              [We’ll adjust their calories and help to manage their weight, so that it’s just right
              for optimum health and wellbeing!]
            </p>
          </EditDogBlock>
          <EditDogBlock title="Activity Level">
            <div className="mt-4 max-w-[640px]">
              <PictureRadio
                name="active"
                rules={{ required: true }}
                control={control}
                error={!!errors.active}
                radios={[
                  {
                    label: 'Mellow',
                    value: 'mellow',
                    children: (
                      <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={95} />
                    ),
                  },
                  {
                    label: 'Active',
                    value: 'active',
                    children: (
                      <Image src="/question/active.svg" alt="Active dog" width={80} height={95} />
                    ),
                  },
                  {
                    label: 'Very Active',
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
            <p className="mt-5 text-primary">[Less than 30 minutes of outdoor daily activity.]</p>
          </EditDogBlock>
          <EditDogBlock title="Food Allergies / Sensitivities">
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
          <EditDogBlock title="Amount Of Treats / Table Scrapes Normally Consumed">
            <div className="-mx-3 -mt-4 flex flex-wrap">
              <div className="mt-4 px-3">
                <InteractiveBlock
                  type="radio"
                  value="none"
                  control={control}
                  name="treats"
                  label="None"
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
                  label="Some"
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
                  label="Lots"
                  error={!!errors.treats}
                  rules={{ required: true }}
                />
              </div>
            </div>
          </EditDogBlock>
          <EditDogBlock title="Pickiness Around Mealtime">
            <div className="mt-4 max-w-[640px]">
              <PictureRadio
                name="picky"
                rules={{ required: true }}
                control={control}
                error={!!errors.picky}
                radios={[
                  {
                    label: 'Can Be Picky',
                    value: 'picky',
                    children: (
                      <div className="flex items-end">
                        <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                      </div>
                    ),
                  },
                  {
                    label: 'Is A Good Eater',
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
                    label: 'Will Eat Anything',
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
