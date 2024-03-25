import React from 'react';
import Container from '@/components/Container';
import Section from './Section';
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SectionBreak from './SectionBreak';
import DateCalendar from '@/components/controls/DateCalendar';
import Price from '@/components/Price';
import Button from '@/components/Button';
import PartialCardForm from '@/components/forms/partial/Card';
import PartialAddressForm, { IPartialAddressForm } from '@/components/forms/partial/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';
import PasswordField from '@/components/controls/PasswordField';
import UnderlineButton from '@/components/UnderlineButton';
import CouponForm from '@/components/forms/Coupon';
import { Dog } from './SurveyContext';
import { MealPlan, Recipe } from '@/enums';
import { getRecipeSlug, isUnavailableDeliveryDate } from '@/helpers/dog';
import { addDays, addWeeks } from 'date-fns';
import { formatDate } from '@/helpers/date';
import { CalendarEvent } from '@/types';
import { applyCoupon } from './actions';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import urlJoin from 'url-join';

function CheckoutBlock({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="mt-4 border-t border-gold pt-4">
      {title && <h3 className="body-2 font-bold text-gold">{title}</h3>}
      {children}
    </div>
  );
}

interface ICheckoutForm {
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
  deliveryAddress: IPartialAddressForm;
  billingAddress: IPartialAddressForm;
}

type ICheckoutFormAction = Omit<ICheckoutForm, 'billingAddress' | 'confirmPassword'> & {
  billingAddress?: IPartialAddressForm;
};

export default function CheckoutForm({
  dogs,
  defaultDeliveryDate,
  calendarEvents,
  onEditMealPlan,
  onEditRecipes,
  onEditTransitionPeriod,
  action,
}: {
  dogs: Dog[];
  defaultDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
  onEditMealPlan(): void;
  onEditRecipes(): void;
  onEditTransitionPeriod(): void;
  action(data: ICheckoutFormAction): Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ICheckoutForm>({
    defaultValues: {
      isSameBillingAddress: true,
      tnc: true,
      deliveryDate: defaultDeliveryDate,

      firstName: 'Chris',
      lastName: 'Wong',
      email: 'chris.wong@gmail.com',
      phone: '88888888',
      password: 'P@ssw0rd',
      confirmPassword: 'P@assw0rd',
      receiveNews: true,
      deliveryAddress: {
        firstName: 'Chris',
        lastName: 'Wong',
        streetAddress1: 'Flat A-B, 11/F, Wah Lik Industrial Centre',
        streetAddress2: '459-469 Castle Peak Road',
        district: 'Tsuen Wan',
        region: 'New Territories',
        country: 'HK',
      },
    },
  });
  const [pending, startTransition] = React.useTransition();

  const onSubmit = React.useCallback(
    ({ billingAddress, confirmPassword, ...values }: ICheckoutForm) => {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make  sure to disable form submission until Stripe.js has loaded.
        return;
      }
      const address = values.isSameBillingAddress ? values.deliveryAddress : billingAddress;
      startTransition(async () => {
        try {
          await action(values.isSameBillingAddress ? values : { ...values, billingAddress });
          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: urlJoin(window.location.href, '/complete'),
              save_payment_method: true,
              receipt_email: values.email,
              payment_method_data: {
                billing_details: {
                  name: address.firstName + ' ' + address.lastName,
                  email: values.email,
                  address: {
                    city: address.district,
                    country: address.country,
                    line1: address.streetAddress1,
                    line2: address.streetAddress2,
                    state: address.region,
                  },
                },
              },
            },
          });
          console.log(error);
          if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`. For some payment methods like iDEAL, your customer will
            // be redirected to an intermediate site first to authorize the payment, then
            // redirected to the `return_url`.
            if (error.type === 'card_error' || error.type === 'validation_error') {
              console.error(error.message ?? 'Something went wrong');
            } else {
              console.error('An unexpected error occurred');
            }
            return;
          }
        } catch (e) {
          console.error(e);
        }
      });
    },
    [action, stripe, elements]
  );

  return (
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
              <PartialAddressForm control={control} prefix="deliveryAddress" />
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
              <PartialAddressForm
                control={control}
                prefix="billingAddress"
                disabled={watch('isSameBillingAddress')}
              />
            </Section>
            <SectionBreak half />
            <Section dense title={t('payment-information')}>
              <PartialCardForm control={control} />
            </Section>
            <SectionBreak half />
            <Section dense title={t('delivery-date')}>
              <p className="body-3">
                {t('{}-{}-week-starter-box-will-be-delivered-on-the-{}', {
                  name: dogs[0].name,
                  week: 2,
                  date: formatDate(t, watch('deliveryDate'), true),
                })}{' '}
                <EditButton onClick={() => {}} />
              </p>
              <p className="body-3 mt-3">
                {t('after-checkout-you-can-adjust-your-delivery-date-until-the-{}', {
                  date: formatDate(t, new Date()),
                })}
              </p>
              <div className="mt-4 w-fit">
                <DateCalendar
                  name="deliveryDate"
                  control={control}
                  minDate={addDays(new Date(), 4)}
                  shouldDisableDate={(day) => isUnavailableDeliveryDate(day, calendarEvents)}
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
              <h2 className="heading-4 font-bold text-gold">{t('order-summary')}</h2>
              <CheckoutBlock title={t('{}-colon', { value: t('your-plan') })}>
                {dogs.map((dog, idx) => {
                  return (
                    <p key={idx} className="body-3 mt-1">
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
                    <div className="body-3 -mx-1 mt-3 flex flex-wrap justify-between">
                      <div className="px-1">{t('{}-colon', { value: t('meal-plan') })}</div>
                      <div className="px-1">
                        <strong className="mr-1.5">
                          {dog.mealPlan === MealPlan.Full
                            ? t('fresh-full-plan')
                            : t('fresh-half-plan')}
                        </strong>
                        <EditButton onClick={onEditMealPlan} />
                      </div>
                    </div>
                    <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                      <div className="px-1">{t('{}-colon', { value: t('recipes') })}</div>
                      <div className="px-1">
                        <strong className="mr-1.5">
                          {dog.recipe1 != null && t(getRecipeSlug(dog.recipe1))}
                          {dog.recipe2 != null && `, ${t(getRecipeSlug(dog.recipe2))}`}
                        </strong>
                        <EditButton onClick={onEditRecipes} />
                      </div>
                    </div>
                    <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                      <div className="px-1">{t('days-of-food')}</div>
                      <div className="px-1">
                        <strong className="mr-1.5">{t('{}-days', { value: 14 })}</strong>
                        <div className="inline-block w-4">&nbsp;</div>
                      </div>
                    </div>
                    <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                      <div className="px-1">{t('transition-period')}</div>
                      <div className="px-1">
                        <strong className="mr-1.5">
                          {dog.isEnabledTransitionPeriod ? t('yes') : t('no')}
                        </strong>
                        <EditButton onClick={onEditTransitionPeriod} />
                      </div>
                    </div>
                  </CheckoutBlock>
                );
              })}
              <CheckoutBlock title={t('discount-coupon')}>
                <CouponForm action={applyCoupon} />
              </CheckoutBlock>
              <CheckoutBlock>
                <div className="body-3 -mx-1 flex flex-wrap justify-between">
                  <div className="px-1">
                    {t('{}-colon', { value: t('fresh-food-box-subtotal') })}
                  </div>
                  <div className="px-1">
                    <Price className="font-bold" value={500} discount />
                  </div>
                </div>
                <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                  <div className="px-1">
                    {t('{}-colon', { value: t('with-starter-box-discount') })}
                  </div>
                  <div className="px-1">
                    <Price className="font-bold" value={250} />
                  </div>
                </div>
                <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                  <div className="px-1">{t('promo-code')}</div>
                  <div className="px-1">－</div>
                </div>
                <div className="body-3 -mx-1 mt-2 flex flex-wrap justify-between">
                  <div className="px-1">{t('{}-colon', { value: t('delivery') })}</div>
                  <div className="px-1">
                    <Price className="font-bold uppercase" value={t('free')} dollorSign={false} />
                  </div>
                </div>
              </CheckoutBlock>
              <CheckoutBlock>
                <div className="-mx-1 flex flex-wrap justify-between font-bold">
                  <div className="px-1">{t('{}-colon', { value: t('todays-total') })}</div>
                  <div className="px-1">$250</div>
                </div>
                <div className="mt-4">
                  <RoundedCheckbox
                    name="tnc"
                    control={control}
                    label={t.rich('by-starting-the-first-box-you-agree-to-our-terms-conditions', {
                      button: (chunks) => (
                        <UnderlineButton type="button" theme="primary" label={chunks} />
                      ),
                    })}
                  />
                </div>
                <div className="mt-4 text-center">
                  <Button disabled={!stripe || pending}>{t('checkout')}</Button>
                </div>
              </CheckoutBlock>
            </div>
            <div className="mt-10 rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
              <h2 className="heading-4 font-bold text-gold">{t('subscription')}</h2>
              <div className="mt-4 text-gold">
                <p>
                  {t('{}-colon', { value: t('next-order') })}
                  {formatDate(t, addWeeks(new Date(), 2), true)}
                </p>
                <p className="body-3 mt-3">
                  {t('{}-colon', { value: t('delivery-cycle') })}
                  {t('every-{}', { value: t('{}-weeks', { value: 2 }) })}
                </p>
              </div>
              <p className="body-3 mt-4">
                {t.rich('subscription:description', { br: () => <br /> })}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </form>
  );
}
