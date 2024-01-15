import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import Button from '@/components/Button';
import { Autocomplete, Chip, TextField } from '@mui/material';
import RadioControl from '../controls/Radio';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import { Breed } from '@/entities';

export default function DogBasicFragment({ forward }: FragmentProps) {
  const { handleSubmit, control } = useForm();
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState<Breed[] | undefined>(undefined);

  const fetchBreeds = React.useCallback(async () => {
    if (options === undefined) {
      const res = await fetch('/breed');
      setOptions((await res.json()) as Breed[]);
      setLoading(false);
    }
  }, [options]);

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

  return (
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title="What breed is [Charlie]?"
          description="If [Charlie] is a mix, you can select multiple breeds."
        >
          <div className="mx-auto max-w-[480px]">
            <Controller
              name="breed"
              control={control}
              rules={{ required: true }}
              defaultValue={[]}
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
                    <TextField placeholder="Start Typing The Breed" {...params} />
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
            <div className="mt-3 px-3">
              <RadioControl
                control={control}
                name="isUnknownBreed"
                label="Don’t Know The Breed"
                value="Y"
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title="[Charlie] is a ...">
          <div className="flex justify-center">
            <div className="px-3">
              <RadioControl value={0} isBlock control={control} name="gender" label="Boy" />
            </div>
            <div className="px-3">
              <RadioControl value={1} isBlock control={control} name="gender" label="Girl" />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title="Is [Charlie] ...">
          <div className="flex justify-center">
            <div className="px-3">
              <RadioControl value={0} isBlock control={control} name="neuter" label="[Neutered]" />
            </div>
            <div className="px-3">
              <RadioControl
                value={1}
                isBlock
                control={control}
                name="neuter"
                label="[Not Neutered]"
              />
            </div>
          </div>
          <p className="mt-10 italic text-primary">
            Spayed and neutered dogs require fewer calories.
          </p>
        </Section>
        <Button className="mt-10">Continue</Button>
      </form>
    </Container>
  );
}
