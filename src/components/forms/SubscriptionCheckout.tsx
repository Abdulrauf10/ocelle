'use client';

import { MenuItem } from '@mui/material';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import clsx from 'clsx';
import { addWeeks, subDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';
import { roundTo } from 'round-to';

import TextField from '../controls/TextField';
import DatePickerForm from './DatePicker';
import PartialBillingAddressForm, { IPartialBillingAddressForm } from './partial/BillingAddress';
import PartialCardStripeForm, { useCardStripeForm } from './partial/CardStripe';
import PartialShippingAddressForm, { IPartialShippingAddressForm } from './partial/ShippingAddress';

import Container from '@/components/Container';
import Price from '@/components/Price';
import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import UnderlineButton from '@/components/buttons/UnderlineButton';
import PasswordField from '@/components/controls/PasswordField';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import Select from '@/components/controls/Select';
import { EMAIL_REGEXP, PASSWORD_REGEXP, PHONE_REGEXP } from '@/consts';
import { MealPlan, Recipe } from '@/enums';
import { CountryCode, OrderDiscountType, OrderFragment } from '@/gql/graphql';
import RecipeHelper from '@/helpers/recipe';
import {
  getEditableRecurringBoxDeadline,
  isLegalDeliveryDate,
  isOperationDate,
} from '@/helpers/shipment';
import { getCountryCodes } from '@/helpers/string';
import useSentence, { PadSpace } from '@/hooks/useSentence';
import { CalendarEvent } from '@/types';

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
  phone: { code: string; value: string };
  whatsapp: { code: string; value: string };
  receiveNews: boolean;
  isSameBillingAddress: boolean;
  deliveryDate: Date;
  tnc: boolean;
  deliveryAddress: IPartialShippingAddressForm;
  billingAddress: IPartialBillingAddressForm;
}

type ISubscriptionCheckoutFormAction = Omit<
  ISubscriptionCheckoutForm,
  'whatsapp' | 'billingAddress' | 'confirmPassword'
> & {
  whatsapp?: { code: string; value: string };
  billingAddress?: Omit<IPartialBillingAddressForm, 'country'> & { country: CountryCode };
};

type DogData = {
  name: string;
  mealPlan: MealPlan;
  recipe1: Recipe;
  recipe2?: Recipe;
  isEnabledTransitionPeriod: boolean;
  perDayPrice: number;
};

export default function SubscriptionCheckoutForm({
  defaultValues,
  draftOrder,
  dogs,
  clientSecret,
  closestDeliveryDate,
  calendarEvents,
  renderCouponForm,
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
  draftOrder: OrderFragment;
  dogs: DogData[];
  clientSecret: string;
  closestDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
  renderCouponForm(state: { disabled: boolean }): React.ReactNode;
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
    watch,
    trigger,
    getValues,
    resetField,
    formState: { errors, isValid },
  } = useForm<ISubscriptionCheckoutForm>({
    mode: 'onBlur',
    defaultValues: {
      ...defaultValues,
      isSameBillingAddress: true,
      phone: {
        code: '852',
        value: '',
      },
      whatsapp: {
        code: '852',
        value: '',
      },
      deliveryDate: closestDeliveryDate,
      billingAddress: {
        streetAddress2: '',
      },
      deliveryAddress: {
        firstName: defaultValues?.firstName,
        lastName: defaultValues?.lastName,
        streetAddress2: '',
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
        const data = {
          ...values,
          whatsapp: values.whatsapp.value.length === 0 ? undefined : values.whatsapp,
        };
        await onBeforeTransaction(
          values.isSameBillingAddress
            ? data
            : {
                ...data,
                billingAddress: { ...billingAddress, country: billingAddress.country.value },
              }
        );
        const card = elements.getElement(CardNumberElement);
        if (!card) {
          throw new Error('cannot find card element');
        }
        const address = values.isSameBillingAddress
          ? values.deliveryAddress
          : { ...billingAddress, country: billingAddress.country.value };
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

  const starterBoxDiscount = draftOrder.discounts.find(
    (discount) => discount.type === OrderDiscountType.Manual
  );

  if (!starterBoxDiscount) {
    throw new Error('there have some error, please try again later.');
  }

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
                    rules={{
                      required: t('please-enter-your-{}', { name: t('first-name').toLowerCase() }),
                    }}
                    disabled={isSubmitInProgress}
                    error={!!errors.firstName}
                    errorOnEmpty
                    fullWidth
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <TextField
                    name="lastName"
                    label={t('last-name')}
                    control={control}
                    rules={{
                      required: t('please-enter-your-{}', { name: t('last-name').toLowerCase() }),
                    }}
                    disabled={isSubmitInProgress}
                    error={!!errors.lastName}
                    errorOnEmpty
                    fullWidth
                  />
                </div>
                <div className="w-full p-2">
                  <TextField
                    name="email"
                    label={t('email')}
                    control={control}
                    rules={{
                      required: t('please-enter-your-{}', { name: t('email').toLowerCase() }),
                      pattern: {
                        value: EMAIL_REGEXP,
                        message: t('this-{}-doesn-t-look-correct-please-update-it', {
                          name: t('email').toLowerCase(),
                        }),
                      },
                    }}
                    disabled={isSubmitInProgress}
                    error={!!errors.email}
                    errorOnEmpty
                    fullWidth
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <PasswordField
                    name="password"
                    control={control}
                    rules={{
                      required: t('please-enter-a-valid-{}', { name: t('password') }),
                      pattern: {
                        value: PASSWORD_REGEXP,
                        message: t(
                          'passwords-must-be-at-least-8-characters-long-and-include-at-least-one-uppercase-letter-and-one-number'
                        ),
                      },
                    }}
                    label={t('password')}
                    fullWidth
                    disabled={isSubmitInProgress}
                    error={!!errors.password}
                    errorOnEmpty
                    onBlur={() => {
                      const value = getValues('confirmPassword');
                      if (value !== undefined && value.length > 0) {
                        trigger('confirmPassword');
                      }
                    }}
                  />
                </div>
                <div className="w-1/2 p-2 max-sm:w-full">
                  <PasswordField
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: true,
                      validate: (value, { password }) => {
                        return value === password || t('your-passwords-do-not-match');
                      },
                    }}
                    label={t('confirm-{}', { value: t('password') })}
                    fullWidth
                    disabled={isSubmitInProgress}
                    error={!!errors.confirmPassword}
                    errorOnEmpty
                  />
                </div>
                <div className="w-1/2 p-2 max-lg:w-full">
                  <TextField
                    name="phone.value"
                    label={t('phone-number')}
                    control={control}
                    rules={{
                      required: t('please-enter-your-{}', {
                        name: t('phone-number').toLowerCase(),
                      }),
                      pattern: {
                        value: PHONE_REGEXP,
                        message: t('please-enter-a-valid-{}', {
                          name: t('phone-number').toLowerCase(),
                        }),
                      },
                      validate: (value, { phone: { code } }) => {
                        if (code !== '852') {
                          return true;
                        }
                        return String(value).length === 8
                          ? true
                          : t('please-enter-a-valid-{}', { name: t('phone-number') });
                      },
                    }}
                    disabled={isSubmitInProgress}
                    error={!!errors.phone?.value}
                    errorOnEmpty
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <div className="w-auto">
                          <Select
                            variant="standard"
                            name="phone.code"
                            control={control}
                            rules={{ required: true }}
                            disableUnderline
                            onChange={() => trigger('phone.value')}
                            disabled={isSubmitInProgress}
                          >
                            {getCountryCodes().map((code, idx) => (
                              <MenuItem key={idx} value={code}>
                                +{code}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      ),
                    }}
                  />
                </div>
                <div className="w-1/2 p-2 max-lg:w-full">
                  <TextField
                    name="whatsapp.value"
                    label={t('whatsapp-optional')}
                    control={control}
                    rules={{
                      pattern: {
                        value: PHONE_REGEXP,
                        message: t('please-enter-a-valid-{}', { name: t('Whatsapp-number') }),
                      },
                      validate: (value, { phone: { code } }) => {
                        if (code !== '852' || value === '') {
                          return true;
                        }
                        return String(value).length === 8
                          ? true
                          : t('please-enter-a-valid-{}', { name: t('Whatsapp-number') });
                      },
                    }}
                    disabled={isSubmitInProgress}
                    error={!!errors.whatsapp?.value}
                    errorOnEmpty
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <div className="w-auto">
                          <Select
                            variant="standard"
                            name="whatsapp.code"
                            control={control}
                            rules={{ required: true }}
                            disableUnderline
                            disabled={isSubmitInProgress}
                          >
                            {getCountryCodes().map((code, idx) => (
                              <MenuItem key={idx} value={code}>
                                +{code}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      ),
                    }}
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
              <PartialShippingAddressForm
                control={control}
                watch={watch}
                prefix="deliveryAddress"
                disabled={isSubmitInProgress}
              />
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
                  <PartialBillingAddressForm
                    control={control}
                    watch={watch}
                    resetField={resetField}
                    prefix="billingAddress"
                    disabled={isSubmitInProgress}
                  />
                </Section>
                <div className="mt-10"></div>
              </>
            )}
            <Section dense title={t('payment-information')}>
              <PartialCardStripeForm form={form} disabled={isSubmitInProgress} />
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
                  disabled={isSubmitInProgress}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDeliveryDate(true);
                  }}
                />
              </p>
              <div className="mt-3"></div>
              <p className="body-3">
                {t.rich('after-checkout-you-can-adjust-your-delivery-date-until-the-{}', {
                  date: sentence.date(
                    getEditableRecurringBoxDeadline(calendarEvents, watch('deliveryDate'), true)
                  ),
                })}
              </p>
              {openDeliveryDate && (
                <div ref={datePickerRef} className="mt-4 w-fit">
                  <DatePickerForm
                    initialDate={watch('deliveryDate')}
                    minDate={closestDeliveryDate}
                    shouldDisableDate={(day) =>
                      !isOperationDate(subDays(day, 1), calendarEvents) ||
                      !isLegalDeliveryDate(day, calendarEvents)
                    }
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
                  return (
                    <div key={idx} className="mt-2">
                      <p className="body-3">
                        {t('{}-for-{}-diet-at-a-total-of-{}-per-day', {
                          plan:
                            dog.mealPlan === MealPlan.Full
                              ? t('fresh-full-plan')
                              : t('fresh-half-plan'),
                          name: sentence.padSpace(PadSpace.Right, dog.name),
                          price: `\$${roundTo(dog.perDayPrice, 2)}`,
                        })}
                      </p>
                    </div>
                  );
                })}
              </SummaryBlock>
              {dogs.map((dog, idx) => {
                return (
                  <SummaryBlock
                    key={idx}
                    title={t('{}-fresh-food-box', {
                      name: sentence.padSpace(PadSpace.Right, dog.name),
                    })}
                  >
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{t('meal-plan')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">
                          {dog.mealPlan === MealPlan.Full
                            ? t('fresh-full-plan')
                            : t('fresh-half-plan')}
                        </strong>
                        <EditButton disabled={isSubmitInProgress} onClick={onEditMealPlan} />
                      </div>
                    </div>
                    <div className="mt-3"></div>
                    <div className="-mx-1 flex flex-wrap justify-between">
                      <div className="body-3 px-1">{n('recipes')}</div>
                      <div className="body-3 px-1">
                        <strong className="mr-1.5">
                          {t(RecipeHelper.getSlug(dog.recipe1))}
                          {dog.recipe2 != null && `, ${t(RecipeHelper.getSlug(dog.recipe2))}`}
                        </strong>
                        <EditButton disabled={isSubmitInProgress} onClick={onEditRecipes} />
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
                        <EditButton
                          disabled={isSubmitInProgress}
                          onClick={onEditTransitionPeriod}
                        />
                      </div>
                    </div>
                  </SummaryBlock>
                );
              })}
              <SummaryBlock title={t('promo-code')}>
                {renderCouponForm({ disabled: isSubmitInProgress })}
              </SummaryBlock>
              <SummaryBlock>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('fresh-food-box-subtotal')}</div>
                  <div className="body-3 px-1">
                    <Price
                      className="font-bold"
                      value={draftOrder.undiscountedTotal.gross.amount}
                      discount
                    />
                  </div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('with-starter-box-discount')}</div>
                  <div className="body-3 px-1">
                    <Price className="font-bold" value={starterBoxDiscount.amount.amount} />
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
                  <div className="px-1">${draftOrder.total.gross.amount.toFixed(2)}</div>
                </div>
                <div className="mt-4">
                  <RoundedCheckbox
                    name="tnc"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    label={t.rich('i-have-read-and-understood-the-terms-conditions', {
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
