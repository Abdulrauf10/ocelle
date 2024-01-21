import React from 'react';
import { useForm } from 'react-hook-form';
import Container from '@/components/Container';
import Button from '@/components/Button';
import BlockRadio from '../controls/block/Radio';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import BlockCheckbox from '../controls/block/Checkbox';
import Image from 'next/image';
import LineRadioGroup from '../controls/LineRadioGroup';
import { FragmentProps } from '@/components/FragmentViewer';
import Stage from '../Stage';

export default function DogPreference2Fragment({ navigate }: FragmentProps<Stage>) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useForm();
  const options = React.useMemo(() => {
    return [
      { label: 'None', value: 'none' },
      { label: 'Chicken', value: 'chicken' },
      { label: 'Beef', value: 'beef' },
      { label: 'Pork', value: 'pork' },
      { label: 'Lamb', value: 'lamb' },
      { label: 'Duck', value: 'duck' },
    ];
  }, []);

  const onSubmit = React.useCallback(() => {
    navigate(Stage.Owner);
  }, [navigate]);

  return (
    <Container className="text-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={
            <>
              Does [Charlie] have any food <br className="max-md:hidden" />
              allergies or sensitivities?
            </>
          }
        >
          <div className="mx-auto -mt-4 flex max-w-[380px] flex-wrap justify-center">
            <div className="mt-4 px-3">
              <BlockCheckbox
                label={options[0].label}
                value={options[0].value}
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
            {options.map((option, idx) => {
              if (idx === 0) {
                return;
              }
              return (
                <div className="mt-4 px-3" key={option.value}>
                  <BlockCheckbox
                    label={options[idx].label}
                    value={options[idx].value}
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
              <p className="text-error mx-auto mt-3 max-w-[360px] text-sm">
                You’ve indicated that [Charlie] has no allergies (“None!”) as well as allergies to [
                {getValues('allergies')
                  .map((v: unknown, i: number) => (v ? options[i].label : v))
                  .filter((v: unknown, i: number) => !!v && i !== 0)
                  .join(', ')}
                ]. Please recheck and re-enter your selection.
              </p>
            )}
        </Section>
        <SectionBreak />
        <Section title="What is [Charlie] currently eating?">
          <div className="mx-auto -mt-4 flex max-w-[530px] flex-wrap justify-between">
            <div className="mt-4 px-3">
              <BlockRadio
                value="dry"
                control={control}
                name="eating"
                label="Dry"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="wet"
                control={control}
                name="eating"
                label="Wet"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="raw"
                control={control}
                name="eating"
                label="Raw"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="dehydrated"
                control={control}
                name="eating"
                label="Dehydrated"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="fresh"
                control={control}
                name="eating"
                label="Fresh"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="homemade"
                control={control}
                name="eating"
                label="Homemade"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="other"
                control={control}
                name="eating"
                label="Other"
                error={!!errors.eating}
                rules={{ required: true }}
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section
          title={
            <>
              How many treats or table scraps <br className="max-md:hidden" />
              does [Charlie] normally get?
            </>
          }
        >
          <div className="mx-auto -mt-4 flex max-w-[520px] flex-wrap justify-center">
            <div className="mt-4 px-3">
              <BlockRadio
                value="none"
                control={control}
                name="treats"
                label="None"
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="some"
                control={control}
                name="treats"
                label="Some"
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio
                value="lots"
                control={control}
                name="treats"
                label="Lots"
                error={!!errors.treats}
                rules={{ required: true }}
              />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title=" How picky is [Charlie] at mealtimes?">
          <div className="mx-auto mt-10 max-w-[640px]">
            <LineRadioGroup
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
        </Section>
        <Button className="mt-10">Continue</Button>
      </form>
    </Container>
  );
}
