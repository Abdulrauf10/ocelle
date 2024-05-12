'use client';

import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import clsx from 'clsx';
import { addWeeks } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import TextField from '../controls/TextField';
import DatePickerForm from './DatePicker';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';
import PartialCardStripeForm, { useCardStripeForm } from './partial/CardStripe';

import Container from '@/components/Container';
import Price from '@/components/Price';
import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import PasswordField from '@/components/controls/PasswordField';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import { EMAIL_REGEXP, PHONE_REGEXP } from '@/consts';
import { FoodAllergies, MealPlan, OrderSize, Recipe } from '@/enums';
import { CheckoutFragment } from '@/gql/graphql';
import {
  calculateTotalPerDayPrice,
  calculateTotalPriceInBox,
  getDateOfBirth,
  getRecipeSlug,
  isUnavailableDeliveryDate,
} from '@/helpers/dog';
import { nativeRound } from '@/helpers/number';
import useSentence from '@/hooks/useSentence';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  CalendarEvent,
  CurrentlyEating,
  Gender,
  Pickiness,
} from '@/types';
import { BreedDto } from '@/types/dto';

function Section({
  title,
  description,
  className,
  dense,
  children,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  dense?: boolean;
}>) {
  return (
    <>
      <div className={className}>
        <h2 className="heading-4 font-bold text-primary">{title}</h2>
        <div className="mt-4"></div>
        {description && (
          <>
            <p className="body-3 italic text-primary">{description}</p>
            <div className="mb-2"></div>
          </>
        )}
      </div>
      <div className={clsx(!dense && 'mt-4')}>{children}</div>
    </>
  );
}

function SummaryBlock({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="mt-4 border-t border-gold pt-4">
      {title && (
        <>
          <h3 className="body-2 font-bold text-gold">{title}</h3>
          <div className="mt-3"></div>
        </>
      )}
      {children}
    </div>
  );
}

interface ISubscriptionCheckoutForm {
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

type ISubscriptionCheckoutFormAction = Omit<
  ISubscriptionCheckoutForm,
  'billingAddress' | 'confirmPassword'
> & {
  billingAddress?: IPartialAddressForm;
};

type DogData = {
  name?: string;
  isUnknownBreed?: boolean;
  breeds?: BreedDto[];
  gender?: Gender;
  isNeutered?: boolean;
  age?: { years: number; months: number } | string;
  weight?: number;
  bodyCondition?: BodyCondition;
  activityLevel?: ActivityLevel;
  foodAllergies?: FoodAllergies;
  currentlyEating?: CurrentlyEating;
  amountOfTreats?: AmountOfTreats;
  pickiness?: Pickiness;
  mealPlan?: MealPlan;
  recipe1?: Recipe;
  recipe2?: Recipe;
  isEnabledTransitionPeriod?: boolean;
};

export default function SubscriptionCheckoutForm({
  defaultValues,
  initialCheckout,
  dogs,
  clientSecret,
  closestDeliveryDate,
  calendarEvents,
  couponForm,
  onEditMealPlan,
  onEditRecipes,
  onEditTransitionPeriod,
  onBeforeTransaction,
  onCompleteTransaction,
}: {
  defaultValues?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  initialCheckout: CheckoutFragment;
  dogs: DogData[];
  clientSecret: string;
  closestDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
  couponForm: React.ReactNode;
  onEditMealPlan(): void;
  onEditRecipes(): void;
  onEditTransitionPeriod(): void;
  onBeforeTransaction(data: ISubscriptionCheckoutFormAction): Promise<void>;
  onCompleteTransaction(paymentMethodId: string): Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const form = useCardStripeForm();
  const t = useTranslations();
  const n = useTranslations('Navigator');
  const sentence = useSentence();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ISubscriptionCheckoutForm>({
    defaultValues: {
      ...defaultValues,
      isSameBillingAddress: true,
      deliveryDate: closestDeliveryDate,
      billingAddress: {
        firstName: defaultValues?.firstName,
        lastName: defaultValues?.lastName,
      },
      deliveryAddress: {
        firstName: defaultValues?.firstName,
        lastName: defaultValues?.lastName,
      },
    },
  });
  const datePickerRef = React.useRef<HTMLDivElement | null>(null);
  const [openDeliveryDate, setOpenDeliveryDate] = React.useState(false);
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);

  const handleWindowClick = React.useCallback((e: MouseEvent) => {
    if (datePickerRef.current && datePickerRef.current.contains(e.target as Node)) {
      return;
    }
    setOpenDeliveryDate(false);
  }, []);

  const onSubmit = React.useCallback(
    async ({ billingAddress, confirmPassword, ...values }: ISubscriptionCheckoutForm) => {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make  sure to disable form submission until Stripe.js has loaded.
        return;
      }
      if (isSubmitInProgress) {
        return;
      }
      // validate stripe fields
      const { error } = await elements.submit();
      if (error) {
        console.log(error);
        return;
      }
      try {
        setIsSubmitInProgress(true);
        await onBeforeTransaction(
          values.isSameBillingAddress ? values : { ...values, billingAddress }
        );
        const card = elements.getElement(CardNumberElement);
        if (!card) {
          throw new Error('cannot find card element');
        }
        const address = values.isSameBillingAddress ? values.deliveryAddress : billingAddress!;
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
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
              phone: '+852' + values.phone, // assume all phones are from HK
            },
          },
          receipt_email: values.email,
          // save_payment_method: true,
        });
        if (error) {
          console.log(error);
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
        const paymentMethodId =
          typeof paymentIntent.payment_method === 'string'
            ? paymentIntent.payment_method
            : paymentIntent.payment_method!.id;
        await onCompleteTransaction(paymentMethodId);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitInProgress(false);
      }
    },
    [clientSecret, stripe, elements, isSubmitInProgress, onBeforeTransaction, onCompleteTransaction]
  );

  React.useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [handleWindowClick]);

  const totalPrice = dogs.reduce(
    ({ recurring, startbox }, dog) => {
      const dateOfBirth =
        typeof dog.age === 'string' ? dog.age! : getDateOfBirth(dog.age!).toISOString();
      const starterBoxPrice = calculateTotalPriceInBox(
        dog.breeds!,
        new Date(dateOfBirth),
        dog.isNeutered!,
        dog.weight!,
        dog.bodyCondition!,
        dog.activityLevel!,
        { recipe1: dog.recipe1!, recipe2: dog.recipe2 },
        dog.mealPlan!,
        OrderSize.TwoWeek,
        true,
        true
      );
      const recurringPrice = calculateTotalPriceInBox(
        dog.breeds!,
        new Date(dateOfBirth),
        dog.isNeutered!,
        dog.weight!,
        dog.bodyCondition!,
        dog.activityLevel!,
        { recipe1: dog.recipe1!, recipe2: dog.recipe2 },
        dog.mealPlan!,
        OrderSize.TwoWeek,
        true,
        false
      );
      return {
        startbox: starterBoxPrice + startbox,
        recurring: recurringPrice + recurring,
      };
    },
    { recurring: 0, startbox: 0 }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <div className="-mx-6 flex flex-wrap max-lg:-mx-3">
          <div className="flex-1 px-6 max-lg:px-3">
            <Section dense title={t('user-account-information')}>
              <div className="-m-2 flex flex-wrap">
                <div className="w-1/2 p-2 max-sm:w-full">
                  <TextField
                    name="firstName"
                    label={t('first-name')}
                    control={control}
                    rules={{ required: true }}
                    disabled={isSubmitInProgress}
                    fullWidth
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <TextField
                    name="lastName"
                    label={t('last-name')}
                    control={control}
                    rules={{ required: true }}
                    disabled={isSubmitInProgress}
                    fullWidth
                  />
                </div>
                <div className="w-full p-2">
                  <TextField
                    name="email"
                    label={t('email')}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: EMAIL_REGEXP,
                        message: t('this-{}-doesn-t-look-correct-please-update-it', {
                          name: t('email').toLowerCase(),
                        }),
                      },
                    }}
                    disabled={isSubmitInProgress}
                    fullWidth
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <PasswordField
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    label={t('password')}
                    fullWidth
                    disabled={isSubmitInProgress}
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <PasswordField
                    name="confirmPassword"
                    control={control}
                    rules={{ required: true }}
                    label={t('confirm-{}', { value: t('password') })}
                    fullWidth
                    disabled={isSubmitInProgress}
                  />
                </div>
                <div className="w-full p-2">
                  <TextField
                    name="phone"
                    label={t('phone-number')}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: PHONE_REGEXP,
                        message: t('this-{}-doesn-t-look-correct-please-update-it', {
                          name: t('phone-number').toLowerCase(),
                        }),
                      },
                    }}
                    disabled={isSubmitInProgress}
                    fullWidth
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
                  disabled={isSubmitInProgress}
                />
              </div>
            </Section>
            <div className="mt-10"></div>
            <Section dense title={t('delivery-address')}>
              <PartialAddressForm control={control} watch={watch} prefix="deliveryAddress" />
              <div className="mt-3">
                <RoundedCheckbox
                  name="isSameBillingAddress"
                  control={control}
                  label={t('use-as-{}', { name: t('billing-address') })}
                  disabled={isSubmitInProgress}
                />
              </div>
            </Section>
            <div className="mt-10"></div>
            {!watch('isSameBillingAddress') && (
              <>
                <Section dense title={t('billing-address')}>
                  <PartialAddressForm
                    control={control}
                    watch={watch}
                    prefix="billingAddress"
                    disabled={isSubmitInProgress}
                  />
                </Section>
                <div className="mt-10"></div>
              </>
            )}
            <Section dense title={t('payment-information')}>
              <PartialCardStripeForm form={form} />
            </Section>
            <div className="mt-10"></div>
            <Section dense title={t('delivery-date')}>
              <p className="body-3">
                {t.rich('{}-{}-week-starter-box-will-be-delivered-on-the-{}', {
                  name: dogs[0].name,
                  week: 2,
                  date: sentence.date(watch('deliveryDate'), true),
                })}{' '}
                <EditButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDeliveryDate(true);
                  }}
                />
              </p>
              <div className="mt-3"></div>
              <p className="body-3">
                {t.rich('after-checkout-you-can-adjust-your-delivery-date-until-the-{}', {
                  date: sentence.date(new Date()),
                })}
              </p>
              {openDeliveryDate && (
                <div ref={datePickerRef} className="mt-4 w-fit">
                  <DatePickerForm
                    initialDate={watch('deliveryDate')}
                    minDate={closestDeliveryDate}
                    shouldDisableDate={(day) => isUnavailableDeliveryDate(day, calendarEvents)}
                    view={['day']}
                    action={async ({ date }) => {
                      setValue('deliveryDate', date);
                      setOpenDeliveryDate(false);
                    }}
                  />
                </div>
              )}
            </Section>
          </div>
          <div className="w-1/3 px-6 max-lg:w-2/5 max-lg:px-3 max-md:mt-8 max-md:w-full">
            <div className="rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
              <h2 className="heading-4 font-bold text-gold">{t('order-summary')}</h2>
              <SummaryBlock title={t('your-plan')}>
                {dogs.map((dog, idx) => {
                  const dateOfBirth =
                    typeof dog.age === 'string' ? dog.age! : getDateOfBirth(dog.age!).toISOString();
                  const price = calculateTotalPerDayPrice(
                    dog.breeds!,
                    new Date(dateOfBirth),
                    dog.isNeutered!,
                    dog.weight!,
                    dog.bodyCondition!,
                    dog.activityLevel!,
                    { recipe1: dog.recipe1!, recipe2: dog.recipe2 },
                    dog.mealPlan!,
                    OrderSize.TwoWeek,
                    true,
                    false
                  );
                  return (
                    <div key={idx} className="mt-2">
                      <p className="body-3">
                        {t('{}-for-{}-diet-at-a-total-of-{}-per-day', {
                          plan:
                            dog.mealPlan === MealPlan.Full
                              ? t('fresh-full-plan')
                              : t('fresh-half-plan'),
                          name: dog.name,
                          price: `\$${nativeRound(price)}`,
                        })}
                      </p>
                    </div>
                  );
                })}
              </SummaryBlock>
              {dogs.map((dog, idx) => {
                return (
                  <SummaryBlock key={idx} title={t('{}-fresh-food-box', { name: dog.name })}>
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{t('meal-plan')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">
                          {dog.mealPlan === MealPlan.Full
                            ? t('fresh-full-plan')
                            : t('fresh-half-plan')}
                        </strong>
                        <EditButton onClick={onEditMealPlan} />
                      </div>
                    </div>
                    <div className="mt-3"></div>
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{n('recipes')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">
                          {dog.recipe1 != null && t(getRecipeSlug(dog.recipe1))}
                          {dog.recipe2 != null && `, ${t(getRecipeSlug(dog.recipe2))}`}
                        </strong>
                        <EditButton onClick={onEditRecipes} />
                      </div>
                    </div>
                    <div className="mt-3"></div>
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{t('days-of-food')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">{t('{}-days', { value: 14 })}</strong>
                        <div className="inline-block w-4">&nbsp;</div>
                      </div>
                    </div>
                    <div className="mt-3"></div>
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{t('transition-period')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">
                          {dog.isEnabledTransitionPeriod ? t('yes') : t('no')}
                        </strong>
                        <EditButton onClick={onEditTransitionPeriod} />
                      </div>
                    </div>
                  </SummaryBlock>
                );
              })}
              <SummaryBlock title={t('promo-code')}>{couponForm}</SummaryBlock>
              <SummaryBlock>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('fresh-food-box-subtotal')}</div>
                  <div className="body-3 px-1">
                    <Price
                      className="font-bold"
                      value={nativeRound(totalPrice.recurring)}
                      discount
                    />
                  </div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('with-starter-box-discount')}</div>
                  <div className="body-3 px-1">
                    <Price className="font-bold" value={nativeRound(totalPrice.startbox)} />
                  </div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('promo-code')}</div>
                  <div className="body-3 px-1">－</div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('delivery')}</div>
                  <div className="body-3 px-1">
                    <Price className="font-bold uppercase" value={t('free')} dollorSign={false} />
                  </div>
                </div>
              </SummaryBlock>
              <SummaryBlock>
                <div className="-mx-1 flex flex-wrap justify-between font-bold">
                  <div className="px-1">{t('{}-colon', { value: t('todays-total') })}</div>
                  <div className="px-1">${initialCheckout.totalPrice?.gross.amount}</div>
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
                    disabled={isSubmitInProgress}
                  />
                </div>
                <div className="mt-4 text-center">
                  <Button disabled={!stripe || isSubmitInProgress || !isValid || !form.complete}>
                    {t('checkout')}
                  </Button>
                </div>
              </SummaryBlock>
            </div>
            <div className="mt-10 rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
              <h2 className="heading-4 font-bold text-gold">{n('subscription')}</h2>
              <div className="mt-4 text-gold">
                <p className="body-3">
                  {t('{}-colon', { value: t('next-order') })}
                  {sentence.date(addWeeks(new Date(), 2), true)}
                </p>
                <div className="mt-3"></div>
                <p className="body-3">
                  {t('{}-colon', { value: t('delivery-cycle') })}
                  {t('every-{}', { value: t('{}-weeks', { value: 2 }) })}
                </p>
              </div>
              <div className="mt-4"></div>
              <p className="body-3">{t.rich('subscription:description')}</p>
            </div>
          </div>
        </div>
      </Container>
    </form>
  );
}
