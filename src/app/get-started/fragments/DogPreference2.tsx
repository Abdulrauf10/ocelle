import React from 'react';
import { useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import Button from '@/components/Button';
import BlockRadio from '../controls/block/Radio';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import BlockCheckbox from '../controls/block/Checkbox';
import Image from 'next/image';
import LineRadioGroup from '../controls/LineRadioGroup';

export default function DogPreference2Fragment({ forward }: FragmentProps) {
  const { handleSubmit, control } = useForm();

  const onSubmit = React.useCallback(() => {
    forward();
  }, [forward]);

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
              <BlockCheckbox value="none" control={control} name="allergies.[0]" label="None" />
            </div>
            <div className="mt-4 px-3">
              <BlockCheckbox
                value="chicken"
                control={control}
                name="allergies.[1]"
                label="Chicken"
              />
            </div>
            <div className="mt-4 px-3">
              <BlockCheckbox value="beef" control={control} name="allergies.[2]" label="Beef" />
            </div>
            <div className="mt-4 px-3">
              <BlockCheckbox value="pork" control={control} name="allergies.[3]" label="Pork" />
            </div>
            <div className="mt-4 px-3">
              <BlockCheckbox value="lamb" control={control} name="allergies.[4]" label="Lamb" />
            </div>
            <div className="mt-4 px-3">
              <BlockCheckbox value="duck" control={control} name="allergies.[5]" label="Duck" />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title="What is [Charlie] currently eating?">
          <div className="mx-auto -mt-4 flex max-w-[530px] flex-wrap justify-between">
            <div className="mt-4 px-3">
              <BlockRadio value="dry" control={control} name="eating" label="Dry" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="wet" control={control} name="eating" label="Wet" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="raw" control={control} name="eating" label="Raw" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="dehydrated" control={control} name="eating" label="Dehydrated" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="fresh" control={control} name="eating" label="Fresh" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="homemade" control={control} name="eating" label="Homemade" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="other" control={control} name="eating" label="Other" />
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
              <BlockRadio value="none" control={control} name="treats" label="None" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="some" control={control} name="treats" label="Some" />
            </div>
            <div className="mt-4 px-3">
              <BlockRadio value="lots" control={control} name="treats" label="Lots" />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title=" How picky is [Charlie] at mealtimes?">
          <div className="mx-auto mt-10 max-w-[640px]">
            <LineRadioGroup
              name="active"
              rules={{ required: true }}
              control={control}
              radios={[
                {
                  label: 'Can Be Picky',
                  value: 'picky',
                  children: (
                    <div className="flex items-end">
                      <Image src="/question/picky.svg" alt="Picky dog" width={130} height={130} />
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
                        height={80}
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
                      height={70}
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
