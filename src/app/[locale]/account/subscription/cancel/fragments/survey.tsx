import React from 'react';
import { FragmentProps } from '@/components/FragmentRouter';
import { Path } from '../types';
import { Controller, useForm } from 'react-hook-form';
import Container from '@/components/Container';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';

export default function SurveyFragment({ navigate }: FragmentProps<Path>) {
  const t = useTranslations();
  const { control } = useForm();
  const reasons = React.useMemo(() => {
    return [
      t('i-do-not-like-subscription-services'),
      t('ive-experienced-delivery-issues'),
      t('i-had-issues-with-customer-service-limited-plan-or-recipe-options'),
      t('Feeding-fresh-is-too-inconvenient-difficult'),
      t('im-not-happy-with-the-quality-of-food'),
      t('my-dog-doesnt-like-the-food-Health-related-allergies'),
      t('vet-recommendation'),
      t('price'),
      t('my-dog-is-no-longer-with-me'),
      t('{}-colon', { value: t('other-please-specify') }),
    ];
  }, [t]);
  const foods = React.useMemo(() => {
    return [
      t('{}-food', { value: t('dry') }),
      t('{}-food', { value: t('wet') }),
      t('{}-food', { value: t('raw') }),
      t('{}-food', { value: t('dehydrated') }),
      t('{}-food', { value: t('other-fresh') }),
      t('{}-food', { value: t('homemade') }),
      t('prescription-diet'),
    ];
  }, [t]);

  return (
    <Container>
      <h1 className="heading-3 text-center font-bold text-primary">
        {t('cancel-my-subscription')}
      </h1>
      <p className="mt-4 text-center">
        {t.rich('cancel-my-subscription:survey', { br: () => <br className="max-sm:hidden" /> })}
      </p>
      <div className="mx-auto mt-8 max-w-[1200px] rounded-3xl border border-gray bg-white px-14 py-6 shadow-[5px_5px_12px_rgba(0,0,0,.2)] max-lg:px-6 max-lg:py-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="flex-1 p-4">
            <div className="text-2xl font-bold text-gold">
              {t('whats-the-main-reason-youre-cancelling')}
            </div>
            <p className="mt-2">{t('please-select-any-that-apply')}</p>
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
              {t('what-will-you-be-replacing-ocelle-with')}
            </div>
            <p className="mt-2">{t('please-select-any-that-apply')}</p>
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
      <h2 className="heading-3 mt-20 text-center font-bold text-primary">
        {t.rich('cancel-my-subscrption:experience', { br: () => <br /> })}
      </h2>
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
              {t('cancel-subscription')}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
