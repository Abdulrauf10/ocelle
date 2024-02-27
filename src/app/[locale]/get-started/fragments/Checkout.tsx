import Container from '@/components/Container';
import Section from '../Section';
import { TextField, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import SectionBreak from '../SectionBreak';
import DateCalendar from '@/components/controls/DateCalendar';
import Price from '@/components/Price';
import Button from '@/components/Button';
import Stage from '../Stage';
import { FragmentProps } from '@/components/FragmentRouter';
import PartialCardForm, { IPartialCardForm } from '@/components/forms/partial/Card';
import PartialAddressForm, { IPartialAddressForm } from '@/components/forms/partial/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';
import PasswordField from '@/components/controls/PasswordField';
import UnderlineButton from '@/components/UnderlineButton';
import CouponForm from '@/components/forms/Coupon';
import { useSurvey } from '../SurveyContext';
import { MealPlan, Recipe } from '@/enums';
import AppThemeProvider from '@/components/AppThemeProvider';

function getRecipeTranslation(recipe?: Recipe) {
  switch (recipe) {
    case Recipe.Chicken:
      return 'chicken';
    case Recipe.Beef:
      return 'beef';
    case Recipe.Duck:
      return 'duck';
    case Recipe.Lamb:
      return 'lamb';
    case Recipe.Pork:
      return 'pork';
  }
}

interface CheckoutBlockProps {
  title?: string;
}

function CheckoutBlock({ title, children }: React.PropsWithChildren<CheckoutBlockProps>) {
  return (
    <div className="mt-4 border-t border-gold pt-4">
      {title && <h3 className="text-xl font-bold text-gold">{title}</h3>}
      {children}
    </div>
  );
}

interface ICheckoutForm extends IPartialCardForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  receiveNews: boolean;
  isSameBillingAddress: boolean;
  deliveryDate: Date;
  tnc: boolean;
  delivery: IPartialAddressForm;
  billing: IPartialAddressForm;
}

export default function CheckoutFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations();
  const { dogs } = useSurvey();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICheckoutForm>({
    defaultValues: {
      isSameBillingAddress: true,
      tnc: true,
    },
  });

  const onSubmit = React.useCallback(
    (values: unknown) => {
      console.log(values);
      navigate(Stage.ThankYou);
    },
    [navigate]
  );

  return (
    <AppThemeProvider
      theme={{
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              input: {
                padding: '10px 16.5px',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                transform: 'translate(16px, 10px) scale(1)',
                ['&.Mui-focused, &.MuiFormLabel-filled']: {
                  transform: 'translate(16px, -9px) scale(.75)',
                },
              },
            },
          },
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <div className="-mx-6 flex flex-wrap max-lg:-mx-3">
            <div className="flex-1 px-6 max-lg:px-3">
              <Section dense title={t('user-account-information')}>
                <div className="-m-2 flex flex-wrap">
                  <div className="w-1/2 p-2">
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label={t('first-name')} fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label={t('last-name')} fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label={t('email')} fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <PasswordField
                      name="password"
                      control={control}
                      rules={{ required: true }}
                      label={t('password')}
                      fullWidth
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <PasswordField
                      name="confirmPassword"
                      control={control}
                      rules={{ required: true }}
                      label={t('confirm-{}', { value: t('password') })}
                      fullWidth
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label={t('phone-number')} fullWidth error={!!error} />
                      )}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <RoundedCheckbox
                    name="receiveNews"
                    control={control}
                    label={t(
                      'keep-me-up-to-date-with-news-and-exclusive-offers-via-email-or-whatsApp'
                    )}
                  />
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title={t('delivery-address')}>
                <PartialAddressForm control={control} prefix="delivery" />
                <div className="mt-3">
                  <RoundedCheckbox
                    name="isSameBillingAddress"
                    control={control}
                    label={t('use-as-{}', { name: t('billing-address') })}
                  />
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title={t('billing-address')}>
                <PartialAddressForm control={control} prefix="billing" />
              </Section>
              <SectionBreak half />
              <Section dense title={t('payment-information')}>
                <PartialCardForm control={control} />
              </Section>
              <SectionBreak half />
              <Section dense title={t('delivery-date')}>
                <p>
                  {t('{}-{}-week-starter-box-will-be-delivered-on-the-{}', {
                    name: dogs[0].name,
                    week: 2,
                    date: '25th of December 2023',
                  })}{' '}
                  <EditButton onClick={() => {}} />
                </p>
                <p className="mt-3">
                  {t('after-checkout-you-can-adjust-your-delivery-date-until-the-{}', {
                    date: '21st of December',
                  })}
                </p>
                <div className="mt-4 w-fit">
                  <DateCalendar
                    name="deliveryDate"
                    control={control}
                    minDate={new Date()}
                    actions={[
                      { label: t('cancel'), onClick: () => {} },
                      { label: t('save-changes'), onClick: () => {} },
                    ]}
                  />
                </div>
              </Section>
            </div>
            <div className="w-1/3 px-6 max-lg:w-2/5 max-lg:px-3 max-md:mt-8 max-md:w-full">
              <div className="rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
                <h2 className="text-3xl font-bold text-gold">{t('order-summary')}</h2>
                <CheckoutBlock title={t('{}-colon', { value: t('your-plan') })}>
                  {dogs.map((dog, idx) => {
                    return (
                      <p key={idx} className="mt-1">
                        {t('{}-for-{}-diet-at-a-total-of-{}-per-day', {
                          plan:
                            dog.mealPlan === MealPlan.Full
                              ? t('fresh-full-plan')
                              : t('fresh-half-plan'),
                          name: dog.name,
                          price: '$18',
                        })}
                      </p>
                    );
                  })}
                </CheckoutBlock>
                {dogs.map((dog, idx) => {
                  return (
                    <CheckoutBlock
                      key={idx}
                      title={t('{}-colon', { value: t('{}-fresh-food-box', { name: dog.name }) })}
                    >
                      <div className="-mx-1 mt-3 flex flex-wrap justify-between">
                        <div className="px-1">{t('{}-colon', { value: t('meal-plan') })}</div>
                        <div className="px-1">
                          <strong className="mr-1.5">
                            {dog.mealPlan === MealPlan.Full
                              ? t('fresh-full-plan')
                              : t('fresh-half-plan')}
                          </strong>
                          <EditButton onClick={() => {}} />
                        </div>
                      </div>
                      <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                        <div className="px-1">{t('{}-colon', { value: t('recipes') })}</div>
                        <div className="px-1">
                          <strong className="mr-1.5">
                            {dog.recipe1 != null && t(getRecipeTranslation(dog.recipe1))}
                            {dog.recipe2 != null && `, ${t(getRecipeTranslation(dog.recipe2))}`}
                          </strong>
                          <EditButton onClick={() => {}} />
                        </div>
                      </div>
                      <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                        <div className="px-1">{t('days-of-food')}</div>
                        <div className="px-1">
                          <strong className="mr-1.5">{t('{}-days', { value: 14 })}</strong>
                          <div className="inline-block w-4">&nbsp;</div>
                        </div>
                      </div>
                      <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                        <div className="px-1">{t('transition-period')}</div>
                        <div className="px-1">
                          <strong className="mr-1.5">
                            {dog.isEnabledTransitionPeriod ? t('yes') : t('no')}
                          </strong>
                          <EditButton onClick={() => {}} />
                        </div>
                      </div>
                    </CheckoutBlock>
                  );
                })}
                <CheckoutBlock title={t('discount-coupon')}>
                  <CouponForm />
                </CheckoutBlock>
                <CheckoutBlock>
                  <div className="-mx-1 flex flex-wrap justify-between">
                    <div className="px-1">
                      {t('{}-colon', { value: t('fresh-food-box-subtotal') })}
                    </div>
                    <div className="px-1">
                      <Price className="font-bold" value={500} discount />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">
                      {t('{}-colon', { value: t('with-starter-box-discount') })}
                    </div>
                    <div className="px-1">
                      <Price className="font-bold" value={250} />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">{t('promo-code')}</div>
                    <div className="px-1">－</div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">{t('{}-colon', { value: t('delivery') })}</div>
                    <div className="px-1">
                      <Price className="font-bold uppercase" value={t('free')} dollorSign={false} />
                    </div>
                  </div>
                </CheckoutBlock>
                <CheckoutBlock>
                  <div className="-mx-1 flex flex-wrap justify-between text-xl font-bold">
                    <div className="px-1">{t('{}-colon', { value: t('todays-total') })}</div>
                    <div className="px-1">$250</div>
                  </div>
                  <div className="mt-4">
                    <RoundedCheckbox
                      name="tnc"
                      control={control}
                      className="text-sm"
                      label={t.rich('by-starting-the-first-box-you-agree-to-our-terms-conditions', {
                        button: (chunks) => (
                          <UnderlineButton type="button" theme="primary" label={chunks} />
                        ),
                      })}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <Button>{t('checkout')}</Button>
                  </div>
                </CheckoutBlock>
              </div>
              <div className="mt-10 rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
                <h2 className="text-3xl font-bold text-gold">{t('subscription')}</h2>
                <div className="mt-4 text-gold">
                  <p>{t('{}-colon', { value: t('next-order') })}[8th of January 2024]</p>
                  <p className="mt-3">
                    {t('{}-colon', { value: t('delivery-cycle') })}[
                    {t('every-{}', { value: t('{}-weeks', { value: 2 }) })}]
                  </p>
                </div>
                <p className="mt-4">{t.rich('subscription:description', { br: () => <br /> })}</p>
              </div>
            </div>
          </div>
        </Container>
      </form>
    </AppThemeProvider>
  );
}
