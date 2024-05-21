import { Autocomplete, Chip, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Section from '../Section';
import SectionBreak from '../SectionBreak';
import Stage from '../Stage';
import { useSurvey } from '../SurveyContext';
import { pageVariants } from '../transition';

import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import CircleCheckbox from '@/components/controls/CircleCheckbox';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import { Sex } from '@/enums';
import { booleanToString, stringToBoolean } from '@/helpers/string';
import { BreedDto } from '@/types/dto';

interface DogBasicForm {
  breeds: BreedDto[];
  isUnknownBreed: boolean;
  sex: Sex;
  isNeutered: 'Y' | 'N';
}

export default function DogBasicFragment() {
  const t = useTranslations();
  const navigate = useNavigate();
  const { getDog, setDog } = useSurvey();
  const { name, breeds, sex, isNeutered, isUnknownBreed } = getDog();
  const [pending, startTransition] = React.useTransition();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<DogBasicForm>({
    defaultValues: {
      breeds: breeds || [],
      sex,
      isNeutered: booleanToString(isNeutered),
      isUnknownBreed,
    },
  });
  const { data: options, isLoading } = useQuery({
    queryKey: ['breeds'],
    queryFn: async () => {
      const res = await fetch('/api/breed');
      return (await res.json()) as BreedDto[];
    },
  });

  const onSubmit = React.useCallback(
    ({ breeds, sex, isNeutered, isUnknownBreed }: DogBasicForm) => {
      setDog({
        breeds,
        sex,
        isNeutered: stringToBoolean(isNeutered),
        isUnknownBreed,
      });
      navigate(Stage.DogAge);
    },
    [navigate, setDog]
  );

  return (
    <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
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
                    loading={isLoading}
                    getOptionLabel={(option) => option.name}
                    freeSolo={false}
                    getOptionDisabled={(option) => watch('breeds').length > 1}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={watch('breeds').length == 0 ? t('start-typing-the-breed') : ''}
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
                  //TODO need to clear the breeds`
                  onClick={() => {}}
                />
              </div>
            </div>
          </Section>
          <SectionBreak />
          <Section title={t('{}-is-', { name })}>
            <div className="flex justify-center">
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
          </Section>
          <SectionBreak />
          <Section title={t('is-{}-', { name })}>
            <div className="flex justify-center">
              <div className="px-3">
                <InteractiveBlock
                  type="radio"
                  value="N"
                  error={!!errors.isNeutered}
                  control={control}
                  name="isNeutered"
                  label={watch('sex', sex ?? Sex.M) == Sex.M ? t('neutered') : t('spayed')}
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
                  label={watch('sex', sex ?? Sex.M) == Sex.M ? t('not-neutered') : t('not-spayed')}
                  rules={{ required: true }}
                />
              </div>
            </div>
            <div className="mt-6"></div>
            <p className="body-3 italic text-primary">
              {t('spayed-and-neutered-dogs-require-fewer-calories')}
            </p>
          </Section>
          <Button className="mt-10" disabled={!isValid || pending}>
            {t('continue')}
          </Button>
        </form>
      </Container>
    </motion.div>
  );
}
