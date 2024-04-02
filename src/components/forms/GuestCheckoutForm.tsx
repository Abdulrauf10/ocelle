'use client';

import React from 'react';
import clsx from 'clsx';
import Container from '@/components/Container';
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import DateCalendar from '@/components/controls/DateCalendar';
import Price from '@/components/Price';
import Button from '@/components/Button';
import PartialCardForm from './partial/Card';
import PartialAddressForm, { IPartialAddressForm } from './partial/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';
import { isUnavailableDeliveryDate } from '@/helpers/dog';
import { formatDate } from '@/helpers/date';
import { CalendarEvent } from '@/types';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '@/contexts/cart';
import CartRows from '../CartRows';
import { CartReturn } from '@/types/dto';
import { colon } from '@/helpers/translation';

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
        <h2 className="heading-4 mb-4 font-bold text-primary">{title}</h2>
        {description && <p className="body-3 mb-2 italic text-primary">{description}</p>}
      </div>
      <div className={clsx(!dense && 'mt-4')}>{children}</div>
    </>
  );
}

function SummaryBlock({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  return (
    <div className="mt-4 border-t border-gold pt-4">
      {title && <h3 className="body-2 font-bold text-gold">{title}</h3>}
      {children}
    </div>
  );
}

interface IGuestCheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  receiveNews: boolean;
  isSameBillingAddress: boolean;
  deliveryDate: Date;
  deliveryAddress: IPartialAddressForm;
  billingAddress: IPartialAddressForm;
}

type IGuestCheckoutFormAction = Omit<IGuestCheckoutForm, 'billingAddress' | 'confirmPassword'> & {
  billingAddress?: IPartialAddressForm;
};

export default function GuestCheckoutForm({
  clientSecret,
  closestDeliveryDate,
  calendarEvents,
  couponForm,
  onCartUpdate,
  onCartDelete,
  onBeforeTransaction,
  onCompleteTransaction,
}: {
  clientSecret: string;
  closestDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
  couponForm: React.ReactNode;
  onCartUpdate(lineId: string, quantity: number): Promise<CartReturn>;
  onCartDelete(lineId: string): Promise<CartReturn>;
  onBeforeTransaction(data: IGuestCheckoutFormAction): Promise<void>;
  onCompleteTransaction(): Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { lines, totalPrice, setLines, setTotalPrice } = useCart();
  const t = useTranslations();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IGuestCheckoutForm>({
    defaultValues: {
      isSameBillingAddress: true,
      deliveryDate: closestDeliveryDate,
    },
  });
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);

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
        await onBeforeTransaction(
          values.isSameBillingAddress ? values : { ...values, billingAddress }
        );
        const card = elements.getElement(CardNumberElement);
        if (!card) {
          throw new Error('cannot find card element');
        }
        const address = values.isSameBillingAddress ? values.deliveryAddress : billingAddress!;
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
        await onCompleteTransaction();
      } catch (e) {
        console.error(e);
      } finally {
        setIsSubmitInProgress(false);
      }
    },
    [stripe, elements, isSubmitInProgress, clientSecret, onBeforeTransaction, onCompleteTransaction]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <div className="-mx-6 flex flex-wrap max-lg:-mx-3">
          <div className="flex-1 px-6 max-lg:px-3">
            <Section dense title={t('customer-details')}>
              <div className="-m-2 flex flex-wrap">
                <div className="w-1/2 p-2">
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: true }}
                    disabled={isSubmitInProgress}
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
                    disabled={isSubmitInProgress}
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
                    disabled={isSubmitInProgress}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label={t('email')} fullWidth error={!!error} />
                    )}
                  />
                </div>
                <div className="w-full p-2">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    disabled={isSubmitInProgress}
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
            <Section dense title={t('billing-address')}>
              <PartialAddressForm
                control={control}
                watch={watch}
                prefix="billingAddress"
                disabled={watch('isSameBillingAddress') || isSubmitInProgress}
              />
            </Section>
            <div className="mt-10"></div>
            <Section dense title={t('payment-information')}>
              <PartialCardForm />
            </Section>
            <div className="mt-10"></div>
            <Section dense title={t('delivery-date')}>
              <p className="body-3">
                {t.rich('your-order-will-be-delivered-on-the-{}', {
                  date: formatDate(t, watch('deliveryDate'), true),
                })}{' '}
                <EditButton onClick={() => {}} />
              </p>
              <div className="mt-4 w-fit">
                <DateCalendar
                  name="deliveryDate"
                  control={control}
                  minDate={closestDeliveryDate}
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
              <SummaryBlock>
                <CartRows
                  lines={lines}
                  onUpdateClick={async (lineId, quantity) => {
                    const { lines, totalPrice } = await onCartUpdate(lineId, quantity);
                    setLines(lines);
                    setTotalPrice(totalPrice);
                  }}
                  onDeleteClick={async (lineId) => {
                    const { lines, totalPrice } = await onCartDelete(lineId);
                    setLines(lines);
                    setTotalPrice(totalPrice);
                  }}
                />
              </SummaryBlock>
              <SummaryBlock title={colon(t, 'promo-code')}>{couponForm}</SummaryBlock>
              <SummaryBlock>
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
                <div className="body-2 -mx-1 mt-2 flex flex-wrap justify-between font-bold">
                  <div className="px-1">{t('{}-colon', { value: t('todays-total') })}</div>
                  <div className="px-1">${totalPrice?.amount}</div>
                </div>
                <div className="mt-4 text-center">
                  <Button disabled={!stripe || isSubmitInProgress}>{t('checkout')}</Button>
                </div>
              </SummaryBlock>
            </div>
          </div>
        </div>
      </Container>
    </form>
  );
}
