import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { Autocomplete, Chip, TextField } from '@mui/material';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import { Breed } from '@/entities';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import CircleCheckbox from '@/components/controls/CircleCheckbox';
import { FragmentProps } from '@/components/FragmentRouter';
import Stage from '../Stage';
import { useTranslations } from 'next-intl';
import { useSurvey } from '../SurveyContext';
import { booleanToString, stringToBoolean } from '@/helpers/string';

interface DogBasicForm {
  breeds: Breed[];
  isUnknownBreed: boolean;
  gender: 'M' | 'F';
  isNeutered: 'Y' | 'N';
}

export default function DogBasicFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { getDog, setDog } = useSurvey();
  const { name, breeds, gender, isNeutered, isUnknownBreed } = getDog();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<DogBasicForm>({
    defaultValues: {
      breeds: breeds || [],
      gender,
      isNeutered: booleanToString(isNeutered),
      isUnknownBreed,
    },
  });
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<Breed[] | undefined>(undefined);

  const fetchBreeds = React.useCallback(async () => {
    if (options === undefined) {
      const res = await fetch('/api/breed');
      setOptions((await res.json()) as Breed[]);
      setLoading(false);
    }
  }, [options]);

  const onSubmit = React.useCallback(
    ({ breeds, gender, isNeutered, isUnknownBreed }: DogBasicForm) => {
      setDog({
        breeds,
        gender,
        isNeutered: stringToBoolean(isNeutered),
        isUnknownBreed,
      });
      navigate(Stage.DogAge);
    },
    [navigate, setDog]
  );

  return (
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('what-breed-is', { name })}
          description={t('if-{}-is-a-mix-you-can-select-multiple-breeds', { name })}
        >
          <div className="mx-auto max-w-[480px]">
            <Controller
              name="breeds"
              control={control}
              rules={{ required: !watch('isUnknownBreed', isUnknownBreed ?? false) }}
              render={({ field: { onChange, ...field } }) => (
                <Autocomplete
                  multiple
                  fullWidth
                  options={options || []}
                  loading={loading}
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
                  disabled={watch('isUnknownBreed', isUnknownBreed ?? false)}
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
            <div className="mt-3 px-3">
              <CircleCheckbox
                control={control}
                name="isUnknownBreed"
                label={t('dont-know-the-breed')}
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title={t('{}-is-a', { name })}>
          <div className="flex justify-center">
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
        </Section>
        <SectionBreak />
        <Section title={t('is-{}', { name })}>
          <div className="flex justify-center">
            <div className="px-3">
              <InteractiveBlock
                type="radio"
                value="N"
                error={!!errors.isNeutered}
                control={control}
                name="isNeutered"
                label={watch('gender', gender ?? 'M') == 'M' ? t('neutered') : t('spayed')}
                rules={{ required: true }}
              />
            </div>
            <div className="px-3">
              <InteractiveBlock
                type="radio"
                value="Y"
                error={!!errors.isNeutered}
                control={control}
                name="isNeutered"
                label={watch('gender', gender ?? 'M') == 'M' ? t('not-neutered') : t('not-spayed')}
                rules={{ required: true }}
              />
            </div>
          </div>
          <p className="mt-10 italic text-primary">
            [{t('spayed-and-neutered-dogs-require-fewer-calories')}]
          </p>
        </Section>
        <Button className="mt-10">{t('continue')}</Button>
      </form>
    </Container>
  );
}
