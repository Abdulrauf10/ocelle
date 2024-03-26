'use client';

import { Breed } from '@/entities';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, Chip, TextField } from '@mui/material';
import InteractiveBlock from '../controls/InteractiveBlock';
import UnderlineButton from '../UnderlineButton';
import clsx from 'clsx';
import DateCalendar from '../controls/DateCalendar';
import Image from 'next/image';
import PictureRadio from '../controls/PictureRadio';
import Button from '../Button';
import { ActivityLevel, AmountOfTreats, BodyCondition, CurrentlyEating, Pickiness } from '@/types';
import { FoodAllergies } from '@/enums';
import { arrayToAllergies, foodAllergiesToArray, getFoodAllergiesOptions } from '@/helpers/form';
import { DateOfBirthMethod, Gender } from '@/types/dog';
import { intervalToDuration, startOfDay, subMonths, subYears } from 'date-fns';

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
  breeds: Breed[];
  gender: Gender;
  isNeutered: 'Y' | 'N';
  months?: number;
  years?: number;
  dateOfBirth?: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: Array<boolean | undefined>;
  eating: CurrentlyEating;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

interface IDogFormReturn {
  name: string;
  breeds: number[];
  gender: Gender;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: FoodAllergies;
  eating: CurrentlyEating;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

export default function DogForm({
  name,
  breeds,
  gender,
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
  breeds: Breed[];
  gender: Gender;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: FoodAllergies;
  eating: CurrentlyEating;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
  action(data: IDogFormReturn): Promise<void>;
}) {
  const t = useTranslations();
  const dateOfBirthInterval = intervalToDuration({ start: dateOfBirth, end: new Date() });
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IDogForm>({
    defaultValues: {
      name,
      breeds,
      gender,
      isNeutered: isNeutered ? 'Y' : 'N',
      months: dateOfBirthMethod === 'Manually' ? dateOfBirthInterval.months ?? 0 : undefined,
      years: dateOfBirthMethod === 'Manually' ? dateOfBirthInterval.years ?? 0 : undefined,
      dateOfBirth: dateOfBirthMethod === 'Calendar' ? dateOfBirth : undefined,
      weight,
      bodyCondition,
      activityLevel,
      allergies: foodAllergiesToArray(allergies),
      eating,
      amountOfTreats,
      pickiness,
    },
  });
  const [pending, startTransition] = React.useTransition();
  const [breedLoading, setBreedLoading] = React.useState(true);
  const [breedOptions, setBreedOptions] = React.useState<Breed[] | undefined>(undefined);
  const [tab, setTab] = React.useState<'Age' | 'Birthday'>(
    dateOfBirthMethod === 'Manually' ? 'Age' : 'Birthday'
  );
  const allergiesOptions = React.useMemo(() => {
    return getFoodAllergiesOptions().map((option) => ({ label: t(option) }));
  }, [t]);

  const fetchBreeds = React.useCallback(async () => {
    if (breedOptions === undefined) {
      const res = await fetch('/api/breed');
      setBreedOptions((await res.json()) as Breed[]);
      setBreedLoading(false);
    }
  }, [breedOptions]);

  const onSubmit = React.useCallback(
    ({
      name,
      breeds,
      gender,
      isNeutered,
      months,
      years,
      dateOfBirth,
      weight,
      bodyCondition,
      activityLevel,
      allergies,
      eating,
      amountOfTreats,
      pickiness,
    }: IDogForm) => {
      startTransition(() => {
        action({
          name,
          breeds: breeds.map((breed) => breed.id),
          gender,
          isNeutered: isNeutered === 'Y',
          dateOfBirthMethod: tab === 'Birthday' ? 'Calendar' : 'Manually',
          dateOfBirth:
            tab === 'Birthday'
              ? dateOfBirth!
              : subMonths(subYears(startOfDay(new Date()), years ?? 0), months ?? 0),
          weight,
          bodyCondition,
          activityLevel,
          allergies: arrayToAllergies(allergies),
          eating,
          amountOfTreats,
          pickiness,
        });
      });
    },
    [action, tab]
  );

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
              loading={breedLoading}
              onOpen={fetchBreeds}
              getOptionLabel={(option) => option.enName}
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
              value="M"
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
              value="F"
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
              value="Y"
              error={!!errors.isNeutered}
              control={control}
              name="isNeutered"
              label={watch('gender', 'M') == 'M' ? t('neutered') : t('spayed')}
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
              label={watch('gender', 'M') == 'M' ? t('not-neutered') : t('not-spayed')}
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
        <div className="mt-4 max-w-[840px]">
          <PictureRadio
            name="bodyCondition"
            rules={{ required: true }}
            control={control}
            error={!!errors.bodyCondition}
            radios={[
              {
                label: t('too-skinny'),
                value: 'TooSkinny',
                children: (
                  <Image src="/question/body-skinny.svg" alt="dog skinny" width={120} height={99} />
                ),
              },
              {
                label: t('just-right'),
                value: 'JustRight',
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
                value: 'Rounded',
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
                value: 'Chunky',
                children: (
                  <Image src="/question/body-chunky.svg" alt="dog chunky" width={120} height={99} />
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
            name="activityLevel"
            rules={{ required: true }}
            control={control}
            error={!!errors.activityLevel}
            radios={[
              {
                label: t('mellow'),
                value: 'Mellow',
                children: (
                  <Image src="/question/mellow.svg" alt="Mellow dog" width={100} height={95} />
                ),
              },
              {
                label: t('active'),
                value: 'Active',
                children: (
                  <Image src="/question/active.svg" alt="Active dog" width={80} height={95} />
                ),
              },
              {
                label: t('very-active'),
                value: 'VeryActive',
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
        <p className="mt-5 text-primary">[{t('less-than-30-minutes-of-outdoor-daily-activity')}]</p>
      </EditDogBlock>
      <EditDogBlock title={t('food-allergies-sensitivities')}>
        <div className="-mx-3 -mt-4 flex max-w-[640px] flex-wrap">
          <div className="mt-4 px-3">
            <InteractiveBlock
              type="checkbox"
              label={allergiesOptions[0].label}
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
                    },
                  }}
                  onChange={() => trigger('allergies')}
                />
              </div>
            );
          })}
        </div>
        {Array.isArray(errors.allergies) && errors.allergies.some((x) => x.type === 'conflict') && (
          <p className="mx-auto mt-3 max-w-[360px] text-sm text-error">
            You’ve indicated that [Charlie] has no allergies (“None!”) as well as allergies to [
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
              value="None"
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
              value="Some"
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
              value="Lots"
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
        <div className="mt-4 max-w-[640px]">
          <PictureRadio
            name="pickiness"
            rules={{ required: true }}
            control={control}
            error={!!errors.pickiness}
            radios={[
              {
                label: t('can-be-picky'),
                value: 'Picky',
                children: (
                  <div className="flex items-end">
                    <Image src="/question/picky.svg" alt="Picky dog" width={130} height={50} />
                  </div>
                ),
              },
              {
                label: t('is-a-good-eater'),
                value: 'GoodEater',
                children: (
                  <div className="flex items-end">
                    <Image src="/question/good-eater.svg" alt="Eater dog" width={80} height={73} />
                  </div>
                ),
              },
              {
                label: t('will-eat-anything'),
                value: 'EatAnything',
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
            <Button fullWidth onClick={() => reset()} reverse>
              {t('cancel')}
            </Button>
          </div>
          <div className="w-1/2 px-2">
            <Button fullWidth disabled={pending}>
              {t('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
