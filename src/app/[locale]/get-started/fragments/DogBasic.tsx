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

import { getBreeds } from '@/actions';
import alphabeticalFilterOption from '@/alphabeticalFilterOption';
import AppThemeProvider from '@/components/AppThemeProvider';
import Container from '@/components/Container';
import Button from '@/components/buttons/Button';
import CircleCheckbox from '@/components/controls/CircleCheckbox';
import InteractiveBlock from '@/components/controls/InteractiveBlock';
import { Sex } from '@/enums';
import { booleanToString, stringToBoolean } from '@/helpers/string';
import useSentence, { PadSpace } from '@/hooks/useSentence';
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
  const { padSpace } = useSentence();
  const { getDog, setDog } = useSurvey();
  const { name, breeds, sex, isNeutered, isUnknownBreed } = getDog();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<DogBasicForm>({
    mode: 'onChange',
    defaultValues: {
      breeds: breeds || [],
      sex,
      isNeutered: booleanToString(isNeutered),
      isUnknownBreed,
    },
  });
  const { data: options, isLoading } = useQuery({
    queryKey: ['breeds'],
    queryFn: () => getBreeds(),
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

  const [showSex, setShowSex] = React.useState(false);

  const values = watch();

  console.log(values.breeds);

  React.useEffect(() => {
    if (values.breeds.length !== 0 || values.isUnknownBreed) {
      setShowSex(true);
    }
  }, [values.breeds, values.isUnknownBreed]);

  return (
    <AppThemeProvider
      theme={{
        components: {
          MuiAutocomplete: {
            styleOverrides: {
              inputRoot: {
                paddingTop: 3,
                paddingBottom: 3,
              },
            },
          },
        },
      }}
    >
      <motion.div variants={pageVariants} initial="outside" animate="enter" exit="exit">
        <Container className="text-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section
              title={t('what-breed-is', {
                name: padSpace(PadSpace.Right, name),
              })}
              description={t('if-{}-is-a-mix-you-can-select-multiple-breeds', {
                name: padSpace(PadSpace.Both, name),
              })}
            >
              <div className="mx-auto max-w-[480px]">
                <Controller
                  name="breeds"
                  control={control}
                  rules={{
                    validate: {
                      required: (value, formValues) =>
                        formValues.isUnknownBreed ? true : value.length > 0,
                    },
                  }}
                  render={({ field: { onChange, ...field } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      options={options || []}
                      loading={isLoading}
                      getOptionLabel={(option) => option.name}
                      freeSolo={false}
                      getOptionDisabled={() =>
                        watch('breeds').length > 1 ||
                        values.breeds.some((breed) => breed.uid.indexOf('9998') > -1)
                      }
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={
                            watch('breeds').length == 0 ? t('start-typing-the-breed') : ''
                          }
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
                      filterOptions={alphabeticalFilterOption}
                      {...field}
                    />
                  )}
                />
                <div className="mt-3 px-3">
                  <CircleCheckbox
                    control={control}
                    name="isUnknownBreed"
                    label={t.rich('dont-know-the-breed')}
                    onChange={() => setValue('breeds', [])}
                  />
                </div>
              </div>
            </Section>
            <SectionBreak />
            {showSex && (
              <Section
                title={t('{}-is-', {
                  name: padSpace(PadSpace.Right, name),
                })}
              >
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
            )}
            {values.sex !== undefined && (
              <>
                <SectionBreak />
                <Section
                  title={t('is-{}-', {
                    name: padSpace(PadSpace.Right, name),
                  })}
                >
                  <div className="flex justify-center">
                    <div className="px-3">
                      <InteractiveBlock
                        type="radio"
                        value="Y"
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
                        value="N"
                        error={!!errors.isNeutered}
                        control={control}
                        name="isNeutered"
                        label={
                          watch('sex', sex ?? Sex.M) == Sex.M ? t('not-neutered') : t('not-spayed')
                        }
                        rules={{ required: true }}
                      />
                    </div>
                  </div>
                  <div className="mt-6"></div>
                  <p className="body-3 italic text-primary">
                    {t('spayed-and-neutered-dogs-require-fewer-calories')}
                  </p>
                </Section>
              </>
            )}
            {values.sex !== undefined &&
              values.isNeutered !== undefined &&
              (values.breeds.length > 0 || values.isUnknownBreed !== undefined) && (
                <Button className="mt-10" disabled={!isValid}>
                  {t('continue')}
                </Button>
              )}
          </form>
        </Container>
      </motion.div>
    </AppThemeProvider>
  );
}
