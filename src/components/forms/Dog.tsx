'use client';

import { Autocomplete, Chip, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { intervalToDuration, startOfDay, subMonths, subYears } from 'date-fns';
import equal from 'deep-equal';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import Button from '../buttons/Button';
import UnderlineButton from '../buttons/UnderlineButton';
import DateCalendar from '../controls/DateCalendar';
import InteractiveBlock from '../controls/InteractiveBlock';
import PictureRadio from '../controls/PictureRadio';

import { getBreeds } from '@/actions';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DateOfBirthMethod,
  DogFood,
  FoodAllergies,
  Pickiness,
  Recipe,
  Sex,
} from '@/enums';
import DogHelper from '@/helpers/dog';
import {
  arrayToAllergies,
  arrayToFoods,
  foodAllergiesToArray,
  foodsToArray,
  getFoodAllergiesOptions,
} from '@/helpers/form';
import useDefaultValues from '@/hooks/defaultValues';
import { BreedDto } from '@/types/dto';

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
          <h2 className="heading-4 p-1 font-bold text-primary">{title}</h2>
          <p className="p-1 max-md:w-full">{description}</p>
        </div>
      );
    }
    return <h2 className="heading-4 pb-3 font-bold text-primary">{title}</h2>;
  };

  return (
    <div className="mt-20">
      {renderHead()}
      {children}
    </div>
  );
}

interface IDogForm {
  name: string;
  breeds: BreedDto[];
  sex: Sex;
  isNeutered: 'Y' | 'N';
  months?: number;
  years?: number;
  dateOfBirth?: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: Array<boolean | undefined>;
  eating: Array<boolean | undefined>;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

interface IDogFormReturn {
  name: string;
  breeds: number[];
  sex: Sex;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: FoodAllergies;
  eating: DogFood[];
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

export default function DogForm({
  name,
  breeds,
  sex,
  isNeutered,
  dateOfBirthMethod,
  dateOfBirth,
  weight,
  bodyCondition,
  activityLevel,
  allergies,
  eating,
  amountOfTreats,
  pickiness,
  action,
}: {
  name: string;
  breeds: BreedDto[];
  sex: Sex;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: FoodAllergies;
  eating: DogFood[];
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
  action(data: IDogFormReturn): Promise<void>;
}) {
  const t = useTranslations();
  const dateOfBirthInterval = intervalToDuration({ start: dateOfBirth, end: new Date() });
  const { defaultValues, setDefaultValues } = useDefaultValues<{
    name: string;
    breeds: BreedDto[];
    sex: Sex;
    isNeutered: 'Y' | 'N';
    months?: number;
    years?: number;
    dateOfBirth?: Date;
    weight: number;
    bodyCondition: BodyCondition;
    activityLevel: ActivityLevel;
    allergies: Array<boolean | undefined>;
    eating: Array<boolean | undefined>;
    amountOfTreats: AmountOfTreats;
    pickiness: Pickiness;
  }>({
    name,
    breeds,
    sex,
    isNeutered: isNeutered ? 'Y' : 'N',
    months: dateOfBirthMethod === 'Manually' ? dateOfBirthInterval.months ?? 0 : undefined,
    years: dateOfBirthMethod === 'Manually' ? dateOfBirthInterval.years ?? 0 : undefined,
    dateOfBirth: dateOfBirthMethod === 'Calendar' ? dateOfBirth : undefined,
    weight,
    bodyCondition,
    activityLevel,
    allergies: foodAllergiesToArray(allergies),
    eating: foodsToArray(eating),
    amountOfTreats,
    pickiness,
  });
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IDogForm>({ defaultValues });
  const [pending, startTransition] = React.useTransition();
  const { data: breedOptions, isLoading: isBreedLoading } = useQuery({
    queryKey: ['breeds'],
    queryFn: () => getBreeds(),
  });
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>(
    dateOfBirthMethod === 'Manually' ? 'Age' : 'Birthday'
  );
  const allergiesOptions = React.useMemo(() => {
    return getFoodAllergiesOptions().map((option) => ({ label: t(option) }));
  }, [t]);

  const onSubmit = React.useCallback(
    (values: IDogForm) => {
      startTransition(async () => {
        await action({
          name: values.name,
          breeds: values.breeds.map((breed) => breed.id),
          sex: values.sex,
          isNeutered: values.isNeutered === 'Y',
          dateOfBirthMethod:
            tab === 'Birthday' ? DateOfBirthMethod.Calendar : DateOfBirthMethod.Manually,
          dateOfBirth:
            tab === 'Birthday'
              ? values.dateOfBirth!
              : DogHelper.getDateOfBirth(values.years, values.months),
          weight: values.weight,
          bodyCondition: values.bodyCondition,
          activityLevel: values.activityLevel,
          allergies: arrayToAllergies(values.allergies),
          eating: arrayToFoods(values.eating),
          amountOfTreats: values.amountOfTreats,
          pickiness: values.pickiness,
        });
      });
      setDefaultValues(values);
    },
    [action, setDefaultValues, tab]
  );

  const isSameAsDefaultValue =
    watch('name') === defaultValues.name &&
    equal(watch('breeds'), defaultValues.breeds) &&
    watch('sex') === defaultValues.sex &&
    watch('isNeutered') === defaultValues.isNeutered &&
    watch('years') === defaultValues.years &&
    watch('months') === defaultValues.months &&
    watch('dateOfBirth')?.getTime() === defaultValues.dateOfBirth?.getTime() &&
    watch('weight') === defaultValues.weight &&
    watch('bodyCondition') === defaultValues.bodyCondition &&
    watch('activityLevel') === defaultValues.activityLevel &&
    equal(watch('allergies'), defaultValues.allergies) &&
    equal(watch('eating'), defaultValues.eating) &&
    watch('amountOfTreats') === defaultValues.amountOfTreats &&
    watch('pickiness') === defaultValues.pickiness;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EditDogBlock title={t('name')}>
        <Controller
          name="name"
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
          name="breeds"
          control={control}
          rules={{ required: true }}
          defaultValue={[]}
          render={({ field: { onChange, ...field } }) => (
            <Autocomplete
              multiple
              fullWidth
              options={breedOptions || []}
              loading={isBreedLoading}
              getOptionLabel={(option) => option.name}
              freeSolo={false}
              getOptionDisabled={(option) => watch('breeds').length > 1}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('start-typing-the-breed')}
                  error={!!errors.breeds}
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
              value={Sex.M}
              error={!!errors.sex}
              control={control}
              name="sex"
              label={t('boy')}
              rules={{ required: true }}
            />
          </div>
          <div className="px-3">
            <InteractiveBlock
              type="radio"
              value={Sex.F}
              error={!!errors.sex}
              control={control}
              name="sex"
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
              value="Y"
              error={!!errors.isNeutered}
              control={control}
              name="isNeutered"
              label={watch('sex', Sex.M) == Sex.M ? t('neutered') : t('spayed')}
              rules={{ required: true }}
            />
          </div>
          <div className="px-3">
            <InteractiveBlock
              type="radio"
              value="N"
              error={!!errors.isNeutered}
              control={control}
              name="isNeutered"
              label={watch('sex', Sex.M) == Sex.M ? t('not-neutered') : t('not-spayed')}
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
            type="button"
            underline={tab === 'Age'}
            className={clsx('text-lg', tab === 'Age' ? 'font-bold' : '')}
            onClick={() => setTab('Age')}
            label={t('enter-manually')}
          />
          <UnderlineButton
            type="button"
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
                name="dateOfBirth"
                rules={{ required: tab === 'Birthday' }}
                error={!!errors.dateOfBirth}
              />
            </div>
          )}
        </div>
      </EditDogBlock>
      <EditDogBlock title={t('current-{}', { value: t('weight') })}>
        <div className="flex items-center">
          <Controller
            name="weight"
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
        {errors?.weight?.message && (
          <p className="mt-3 w-full text-error">{String(errors?.weight?.message)}</p>
        )}
      </EditDogBlock>
      <EditDogBlock title={t('current-{}', { value: t('body-condition') })}>
        <div className="mt-4">
          <PictureRadio
            className={{
              radioGroup: 'max-w-[630px]',
            }}
            name="bodyCondition"
            watch={watch}
            rules={{ required: true }}
            control={control}
            error={!!errors.bodyCondition}
            radios={[
              {
                label: t('too-skinny'),
                descripton: (
                  <p className="body-3 w-full text-primary">
                    {t('visible-rib-cage-spine-noticeable-loss-of-muscle-mass')}
                  </p>
                ),
                selectedDescription: (
                  <i className="body-3 w-full text-primary">{t('adjust-their-calories')}</i>
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
                  <p className="body-3 w-full text-primary">
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
                  <p className="body-3 w-full text-primary">
                    {t('waistline-is-disappearing-difficult-to-feel-ribs-and-spine-broad-back')}
                  </p>
                ),
                selectedDescription: (
                  <i className="body-3 w-full text-primary">{t('adjust-their-calories')}</i>
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
                  <p className="body-3 w-full text-primary">
                    {t(
                      'waistline-is-lost-you-cannot-feel-their-ribs-and-spine-weight-is-a-serious-concern'
                    )}
                  </p>
                ),
                selectedDescription: (
                  <i className="body-3 w-full text-primary">{t('adjust-their-calories')}</i>
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
          />
        </div>
      </EditDogBlock>
      <EditDogBlock title={t('activity-level')}>
        <div className="mt-4">
          <PictureRadio
            className={{
              radioGroup: 'max-w-[440px]',
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
                  <p className="body-3 w-full text-primary">
                    {t('less-than-30-minutes-of-daily-outdoor-activity')}
                  </p>
                ),
                value: ActivityLevel.Mellow,
                children: (
                  <Image src="/get-started/mellow.svg" alt="Mellow dog" width={68} height={43} />
                ),
              },
              {
                label: t('active'),
                descripton: (
                  <p className="body-3 w-full text-primary">
                    {t('around-1-2-hours-of-daily-outdoor-activity')}
                  </p>
                ),
                value: ActivityLevel.Active,
                children: (
                  <Image src="/get-started/active.svg" alt="Active dog" width={51} height={61} />
                ),
              },
              {
                label: t('very-active'),
                descripton: (
                  <p className="body-3 w-full text-primary">
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
      </EditDogBlock>
      <EditDogBlock title={t('food-allergies-sensitivities')}>
        <div className="-mx-3 -mt-4 flex max-w-[640px] flex-wrap">
          <div className="mt-4 px-3">
            <InteractiveBlock
              type="checkbox"
              label={t('{}-exclamation', { value: allergiesOptions[0].label })}
              control={control}
              name="allergies.0"
              error={Array.isArray(errors.allergies) && !!errors.allergies[0]}
              rules={{
                validate: {
                  required: (value, formValues) =>
                    formValues.allergies.some((value: unknown) => !!value),
                  conflict: (value, formValues) =>
                    !value ||
                    !formValues.allergies.some((value: unknown, idx: number) => idx > 0 && value),
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
              <div className="mt-4 px-3" key={idx}>
                <InteractiveBlock
                  type="checkbox"
                  label={allergiesOptions[idx].label}
                  control={control}
                  name={`allergies.${idx}`}
                  error={Array.isArray(errors.allergies) && !!errors.allergies[idx]}
                  rules={{
                    validate: {
                      required: (value, formValues) =>
                        formValues.allergies.some((value: unknown) => !!value),
                      conflict: (value, formValues) => !value || !formValues.allergies[0],
                      allAllergies: (value, { allergies }) => {
                        const foodAllergies = arrayToAllergies(allergies);
                        return !Object.keys(Recipe).every((recipe) =>
                          DogHelper.isAllergies(recipe as Recipe, foodAllergies)
                        );
                      },
                    },
                  }}
                  onChange={() => trigger('allergies')}
                />
              </div>
            );
          })}
        </div>
        {Array.isArray(errors.allergies) && errors.allergies.some((x) => x.type === 'conflict') && (
          <p className="mt-3 text-error">
            <span className="body-3">
              {t(
                'You-ve-indicated-that-{}-has-no-allergies-None-as-well-as-allergies-to-{}-please-check-your-selection',
                {
                  name: watch('name'),
                  value: getValues('allergies')
                    .map((v: unknown, i: number) => (v ? allergiesOptions[i].label : v))
                    .filter((v: unknown, i: number) => !!v && i !== 0)
                    .join(', '),
                }
              )}
            </span>
          </p>
        )}
        {Array.isArray(errors.allergies) &&
          errors.allergies.some((x) => x.type === 'allAllergies') && (
            <p className="mt-3 text-error">
              <span className="body-3">
                {t(
                  'unfortunately-all-our-recipes-contain-an-ingredient-{}-is-allergic-sensitive-to',
                  {
                    name,
                  }
                )}
              </span>
            </p>
          )}
      </EditDogBlock>
      <EditDogBlock title={t('amount-of-treats-table-scrapes-normally-consumed')}>
        <div className="-mx-3 -mt-4 flex flex-wrap">
          <div className="mt-4 px-3">
            <InteractiveBlock
              type="radio"
              value={AmountOfTreats.None}
              control={control}
              name="amountOfTreats"
              label={t('none')}
              error={!!errors.amountOfTreats}
              rules={{ required: true }}
            />
          </div>
          <div className="mt-4 px-3">
            <InteractiveBlock
              type="radio"
              value={AmountOfTreats.Some}
              control={control}
              name="amountOfTreats"
              label={t('some')}
              error={!!errors.amountOfTreats}
              rules={{ required: true }}
            />
          </div>
          <div className="mt-4 px-3">
            <InteractiveBlock
              type="radio"
              value={AmountOfTreats.Lots}
              control={control}
              name="amountOfTreats"
              label={t('lots')}
              error={!!errors.amountOfTreats}
              rules={{ required: true }}
            />
          </div>
        </div>
      </EditDogBlock>
      <EditDogBlock title={t('pickiness-around-mealtime')}>
        <div className="mt-4">
          <PictureRadio
            className={{
              radioGroup: 'max-w-[520px]',
            }}
            name="pickiness"
            watch={watch}
            rules={{ required: true }}
            control={control}
            error={!!errors.pickiness}
            radios={[
              {
                label: t('can-be-picky'),
                value: Pickiness.Picky,
                children: (
                  <div className="flex items-end">
                    <Image src="/get-started/picky.svg" alt="Picky dog" width={110} height={42} />
                  </div>
                ),
              },
              {
                label: t('is-a-good-eater'),
                value: Pickiness.GoodEater,
                children: (
                  <div className="flex items-end">
                    <Image
                      src="/get-started/good-eater.svg"
                      alt="Eater dog"
                      width={60}
                      height={55}
                    />
                  </div>
                ),
              },
              {
                label: t('will-eat-anything'),
                value: Pickiness.EatAnything,
                children: (
                  <Image
                    src="/get-started/eat-anything.svg"
                    alt="Eat anything dog"
                    width={53}
                    height={62}
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
            <Button
              fullWidth
              onClick={() => reset(defaultValues)}
              reverse
              disabled={isSameAsDefaultValue}
            >
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending || isSameAsDefaultValue}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
