import React from 'react';
import { useForm } from 'react-hook-form';
import FragmentProps from '../FragmentProps';
import Container from '@/components/Container';
import Button from '@/components/Button';
import RadioControl from '../controls/Radio';
import Section from '../Section';
import SectionBreak from '../SectionBreak';
import CheckboxControl from '../controls/Checkbox';
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
              <CheckboxControl value="none" control={control} name="allergies.[0]" label="None" />
            </div>
            <div className="mt-4 px-3">
              <CheckboxControl
                value="chicken"
                control={control}
                name="allergies.[1]"
                label="Chicken"
              />
            </div>
            <div className="mt-4 px-3">
              <CheckboxControl value="beef" control={control} name="allergies.[2]" label="Beef" />
            </div>
            <div className="mt-4 px-3">
              <CheckboxControl value="pork" control={control} name="allergies.[3]" label="Pork" />
            </div>
            <div className="mt-4 px-3">
              <CheckboxControl value="lamb" control={control} name="allergies.[4]" label="Lamb" />
            </div>
            <div className="mt-4 px-3">
              <CheckboxControl value="duck" control={control} name="allergies.[5]" label="Duck" />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title="What is [Charlie] currently eating?">
          <div className="mx-auto -mt-4 flex max-w-[530px] flex-wrap justify-between">
            <div className="mt-4 px-3">
              <RadioControl value="dry" isBlock control={control} name="eating" label="Dry" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="wet" isBlock control={control} name="eating" label="Wet" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="raw" isBlock control={control} name="eating" label="Raw" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl
                value="dehydrated"
                isBlock
                control={control}
                name="eating"
                label="Dehydrated"
              />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="fresh" isBlock control={control} name="eating" label="Fresh" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl
                value="homemade"
                isBlock
                control={control}
                name="eating"
                label="Homemade"
              />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="other" isBlock control={control} name="eating" label="Other" />
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
              <RadioControl value="none" isBlock control={control} name="treats" label="None" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="some" isBlock control={control} name="treats" label="Some" />
            </div>
            <div className="mt-4 px-3">
              <RadioControl value="lots" isBlock control={control} name="treats" label="Lots" />
            </div>
          </div>
        </Section>
        <SectionBreak />
        <Section title=" How picky is [Charlie] at mealtimes?">
          <div className="mx-auto mt-[40px] max-w-[640px]">
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
        <Button className="mt-[40px]">Continue</Button>
      </form>
    </Container>
  );
}
