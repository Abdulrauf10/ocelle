import React from 'react';
import { FragmentProps } from '@/components/FragmentRouter';
import { Path } from '../types';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';

export default function SurveyFragment({ navigate }: FragmentProps<Path>) {
  const t = useTranslations('general');
  const { control } = useForm();
  const reasons = React.useMemo(() => {
    return [
      'I do not like subscription services',
      "I've experienced delivery issues",
      'I had issues with customer service Limited plan or recipe options',
      'Feeding fresh is too inconvenient / difficult',
      "I'm not happy with the quality of food",
      "My dog doesn't like the food Health-related / allergies",
      'Vet recommendation',
      'Price',
      'My dog is no longer with me',
      'Other (please specify):',
    ];
  }, []);
  const foods = React.useMemo(() => {
    return [
      'Dry food',
      'Wet food',
      'Raw food',
      'Dehydrated food',
      'Other fresh food',
      'Homemade food',
      'Prescription diet',
    ];
  }, []);

  return (
    <Container>
      <H2 inline className="text-center text-primary">
        Cancel My Subscription
      </H2>
      <p className="mt-4 text-center">
        Thank you for trying our fresh food for your dogs. Before you go,{' '}
        <br className="max-sm:hidden" />
        please share a little about your experience, so we can improve things for you and your
        fellow dog people!
      </p>
      <div className="mx-auto mt-8 max-w-[1200px] rounded-3xl border border-gray bg-white px-14 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.2)] max-lg:px-6 max-lg:py-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="flex-1 p-4">
            <div className="text-2xl font-bold text-gold">
              What’s the main reason you’re cancelling?
            </div>
            <p className="mt-2">Please select any that apply.</p>
          </div>
          <div className="p-4 max-lg:w-full">
            <div className="-my-1 flex flex-col">
              {reasons.map((reason, idx) => {
                return (
                  <div key={idx} className="w-[465px] py-1.5 max-lg:w-full">
                    <RoundedCheckbox
                      name={`reason[${idx}]`}
                      control={control}
                      value={1}
                      label={reason}
                    />
                  </div>
                );
              })}
              <div className="py-1.5">
                <Controller
                  name="other"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="h-40 w-full resize-none rounded-2xl border border-gray p-3"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gold" />
        <div className="-mx-4 flex flex-wrap">
          <div className="flex-1 p-4">
            <div className="text-2xl font-bold text-gold">
              What will you be replacing OCELLE with?
            </div>
            <p className="mt-2">Please select any that apply.</p>
          </div>
          <div className="p-4 max-lg:w-full">
            <div className="-my-1 flex flex-col">
              {foods.map((food, idx) => {
                return (
                  <div key={idx} className="w-[465px] py-1.5 max-lg:w-full">
                    <RoundedCheckbox
                      name={`food[${idx}]`}
                      control={control}
                      value={1}
                      label={food}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <H2 inline className="mt-20 text-center text-primary">
        Is there anything else you’d like to share about your experience? <br />
        If so, we’d love to improve on it!
      </H2>
      <div className="pb-2 text-center">
        <Controller
          name="feedback"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="mt-8 h-48 w-full max-w-[1200px] resize-none rounded-3xl border border-gray bg-white p-6 shadow-[5px_5px_12px_rgba(0,0,0,.2)]"
            />
          )}
        />
      </div>
      <div className="mx-auto mt-10 max-w-[590px]">
        <div className="-m-2 flex flex-wrap">
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => navigate(-1)}
            >
              {t('go-back')}
            </Button>
          </div>
          <div className="w-1/2 p-2 max-sm:w-full">
            <Button
              className="mx-auto max-w-[280px]"
              fullWidth
              reverse
              onClick={() => navigate('complete')}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
