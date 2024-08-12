'use client';

import { MenuItem } from '@mui/material';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import clsx from 'clsx';
import { subDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useForm } from 'react-hook-form';

import CartRows from '../CartRows';
import UnderlineButton from '../buttons/UnderlineButton';
import TextField from '../controls/TextField';
import DatePickerForm from './DatePicker';
import PartialBillingAddressForm, { IPartialBillingAddressForm } from './partial/BillingAddress';
import PartialCardStripeForm, { useCardStripeForm } from './partial/CardStripe';
import PartialShippingAddressForm, { IPartialShippingAddressForm } from './partial/ShippingAddress';

import Container from '@/components/Container';
import Price from '@/components/Price';
import Button from '@/components/buttons/Button';
import EditButton from '@/components/buttons/EditButton';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import Select from '@/components/controls/Select';
import { EMAIL_REGEXP, PHONE_REGEXP } from '@/consts';
import { useCart } from '@/contexts/cart';
import { CountryCode } from '@/gql/graphql';
import { isLegalDeliveryDate, isOperationDate } from '@/helpers/shipment';
import { getCountryCodes } from '@/helpers/string';
import useSentence from '@/hooks/useSentence';
import { CalendarEvent } from '@/types';
import { CartReturn } from '@/types/dto';

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

interface IGuestCheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: { code: string; value: string };
  whatsapp: { code: string; value: string };
  receiveNews: boolean;
  isSameBillingAddress: boolean;
  deliveryDate: Date;
  deliveryAddress: IPartialShippingAddressForm;
  billingAddress: IPartialBillingAddressForm;
  tnc: boolean;
}

type IGuestCheckoutFormAction = Omit<
  IGuestCheckoutForm,
  'whatsapp' | 'billingAddress' | 'confirmPassword'
> & {
  whatsapp?: { code: string; value: string };
  billingAddress?: Omit<IPartialBillingAddressForm, 'country'> & { country: CountryCode };
};

export default function GuestCheckoutForm({
  clientSecret,
  minDeliveryDate,
  calendarEvents,
  renderCouponForm,
  onCartUpdate,
  onCartDelete,
  onBeforeTransaction,
  onCompleteTransaction,
}: {
  clientSecret: string;
  minDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
  renderCouponForm(state: { disabled: boolean }): React.ReactNode;
  onCartUpdate(lineId: string, quantity: number): Promise<CartReturn>;
  onCartDelete(lineId: string): Promise<CartReturn>;
  onBeforeTransaction(data: IGuestCheckoutFormAction): Promise<void>;
  onCompleteTransaction(): Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const form = useCardStripeForm();
  const sentence = useSentence();
  const { lines, shippingPrice, totalPrice, setCart } = useCart();
  const t = useTranslations();
  const {
    control,
    setValue,
    handleSubmit,
    resetField,
    formState: { errors, isValid },
    watch,
  } = useForm<IGuestCheckoutForm>({
    mode: 'onBlur',
    defaultValues: {
      phone: {
        code: '852',
        value: '',
      },
      whatsapp: {
        code: '852',
        value: '',
      },
      isSameBillingAddress: true,
      deliveryDate: minDeliveryDate,
      deliveryAddress: {
        streetAddress2: '',
      },
      billingAddress: {
        streetAddress2: '',
      },
    },
  });
  const datePickerRef = React.useRef<HTMLDivElement | null>(null);
  const [openDeliveryDate, setOpenDeliveryDate] = React.useState(false);
  const [updatingCart, setUpdatingCart] = React.useState(false);
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);

  const handleWindowClick = React.useCallback((e: MouseEvent) => {
    if (datePickerRef.current && datePickerRef.current.contains(e.target as Node)) {
      return;
    }
    setOpenDeliveryDate(false);
  }, []);

  const onSubmit = React.useCallback(
    async ({ billingAddress, ...values }: IGuestCheckoutForm) => {
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
        const { error } = await stripe.confirmCardPayment(clientSecret, {
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
              phone: '+' + values.phone.code + values.phone.value, // assume all phones are from HK
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
        await onCompleteTransaction();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitInProgress(false);
      }
    },
    [stripe, elements, isSubmitInProgress, clientSecret, onBeforeTransaction, onCompleteTransaction]
  );

  React.useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [handleWindowClick]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <div className="-mx-6 flex flex-wrap max-lg:-mx-3">
          <div className="flex-1 px-6 max-lg:px-3">
            <Section dense title={t('customer-info')}>
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
                    errorOnEmpty
                    fullWidth
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
                        message: t('this-{}-doesn-t-look-correct-please-update-it', {
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
                        message: t('this-{}-doesn-t-look-correct-please-update-it', {
                          name: 'WhatsApp',
                        }),
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
                {t.rich('your-order-will-be-delivered-on-the-{}', {
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
              {openDeliveryDate && (
                <div ref={datePickerRef} className="mt-4 w-fit">
                  <DatePickerForm
                    initialDate={watch('deliveryDate')}
                    minDate={minDeliveryDate}
                    // minDate={minDeliveryDate}
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
          <div className="px-6 max-lg:px-3 max-md:mt-8 max-md:w-full">
            <div className="w-[400px] rounded-3xl bg-gold bg-opacity-10 px-6 py-10 max-xl:w-[340px] max-md:w-full">
              <h2 className="heading-4 font-bold text-gold">{t('order-summary')}</h2>
              <SummaryBlock>
                <CartRows
                  lines={lines}
                  onUpdateClick={async (lineId, quantity) => {
                    try {
                      setUpdatingCart(true);
                      const cart = await onCartUpdate(lineId, quantity);
                      setCart(cart);
                    } finally {
                      setUpdatingCart(false);
                    }
                  }}
                  onDeleteClick={async (lineId) => {
                    try {
                      setUpdatingCart(true);
                      const cart = await onCartDelete(lineId);
                      setCart(cart);
                    } finally {
                      setUpdatingCart(false);
                    }
                  }}
                  disabled={isSubmitInProgress}
                />
              </SummaryBlock>
              <SummaryBlock title={t('promo-code')}>
                {renderCouponForm({ disabled: isSubmitInProgress })}
              </SummaryBlock>
              <SummaryBlock>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('promo-code')}</div>
                  <div className="body-3 px-1">－</div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between">
                  <div className="body-3 px-1">{t('delivery')}</div>
                  <div className="body-3 px-1">
                    {!shippingPrice || shippingPrice.amount === 0 ? (
                      <Price className="font-bold uppercase" value={t('free')} dollorSign={false} />
                    ) : (
                      `$${shippingPrice.amount}`
                    )}
                  </div>
                </div>
                <div className="mt-3"></div>
                <div className="-mx-1 flex flex-wrap justify-between font-bold">
                  <div className="body-2 px-1">{t('{}-colon', { value: t('total') })}</div>
                  <div className="body-2 px-1">${totalPrice?.amount}</div>
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
                <div className="mt-5 text-center">
                  <Button
                    disabled={
                      !stripe || isSubmitInProgress || updatingCart || !isValid || !form.complete
                    }
                  >
                    {t('checkout')}
                  </Button>
                </div>
              </SummaryBlock>
            </div>
          </div>
        </div>
      </Container>
    </form>
  );
}
