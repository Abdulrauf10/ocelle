import Container from '@/components/Container';
import Section from '../Section';
import { TextField, ThemeProvider, createTheme, useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import SectionBreak from '../SectionBreak';
import DateCalendar from '@/components/controls/DateCalendar';
import CircleTick from '@/components/icons/CircleTick';
import Price from '@/components/Price';
import Button from '@/components/Button';
import Stage from '../Stage';
import { FragmentProps } from '@/components/FragmentRouter';
import CardForm from '@/components/forms/Card';
import AddressForm from '@/components/forms/Address';
import RoundedCheckbox from '@/components/controls/RoundedCheckbox';
import EditButton from '@/components/EditButton';
import { useTranslations } from 'next-intl';

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

export default function CheckoutFragment({ navigate }: FragmentProps<Stage>) {
  const t = useTranslations('general');
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(
    (values: unknown) => {
      console.log(values);
      navigate(Stage.ThankYou);
    },
    [navigate]
  );

  return (
    <ThemeProvider
      theme={createTheme(theme, {
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
      })}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <div className="-mx-6 flex flex-wrap max-lg:-mx-3">
            <div className="flex-1 px-6 max-lg:px-3">
              <Section dense title="User Account Information">
                <div className="-m-2 flex flex-wrap">
                  <div className="w-1/2 p-2">
                    <Controller
                      name="firstname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label={t('first-name')} fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="lastname"
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
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Password"
                          fullWidth
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Confirm Password"
                          fullWidth
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Phone Number" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title={t('delivery-address')}>
                <AddressForm control={control} prefix="delivery" />
                <div className="mt-3">
                  <RoundedCheckbox
                    name="isSameBillingAddress"
                    value={1}
                    control={control}
                    label={t('use-as', { name: t('billing-address') })}
                  />
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title={t('billing-address')}>
                <AddressForm control={control} prefix="billing" />
              </Section>
              <SectionBreak half />
              <Section dense title="Payment Information">
                <CardForm control={control} />
              </Section>
              <SectionBreak half />
              <Section dense title="Delivery Date">
                <p>
                  [Charlie]’s 2-week starter box will be delivered on the [25th of December 2023].{' '}
                  <EditButton onClick={() => {}} />
                </p>
                <p className="mt-3">
                  After checkout, you can adjust your delivery date until the [21st of December]
                  11:59PM.
                </p>
                <div className="mt-4 w-fit">
                  <DateCalendar name="deliveryDate" control={control} minDate={new Date()} />
                </div>
              </Section>
            </div>
            <div className="w-1/3 px-6 max-lg:w-2/5 max-lg:px-3 max-md:mt-8 max-md:w-full">
              <div className="rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
                <h2 className="text-3xl font-bold text-gold">Order Summary</h2>
                <CheckoutBlock title="Your Plan:">
                  <p className="mt-1">
                    Fresh full plan for [Charlie]’s diet, at a total of [$18] per day.
                  </p>
                </CheckoutBlock>
                <CheckoutBlock title="[Charlie]’s Fresh Food Box:">
                  <div className="-mx-1 mt-3 flex flex-wrap justify-between">
                    <div className="px-1">Meal Plan:</div>
                    <div className="px-1">
                      <strong className="mr-1.5">[Fresh Full Plan]</strong>
                      <EditButton onClick={() => {}} />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">Recipes:</div>
                    <div className="px-1">
                      <strong className="mr-1.5">[Chicken]</strong>
                      <EditButton onClick={() => {}} />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">Days of Food</div>
                    <div className="px-1">
                      <strong className="mr-1.5">14 Days</strong>
                      <div className="inline-block w-4">&nbsp;</div>
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">Transition Period</div>
                    <div className="px-1">
                      <strong className="mr-1.5">[Yes]</strong>
                      <EditButton onClick={() => {}} />
                    </div>
                  </div>
                </CheckoutBlock>
                <CheckoutBlock title="Discount Coupon">
                  <div className="-mx-1 mt-3 flex flex-wrap justify-between">
                    <div className="flex-1 px-1">
                      <Controller
                        name="coupon"
                        control={control}
                        rules={{ required: true }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            error={!!error}
                            inputProps={{
                              className: 'bg-white',
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="px-1">
                      <button
                        type="button"
                        className="rounded-lg bg-secondary px-6 py-2 font-bold text-white"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <div className="h-7 w-7 rounded-full bg-secondary p-1">
                      <CircleTick />
                    </div>
                    <p className="ml-2 text-sm">Your coupon was successfully applied</p>
                  </div>
                </CheckoutBlock>
                <CheckoutBlock>
                  <div className="-mx-1 flex flex-wrap justify-between">
                    <div className="px-1">Fresh Food Box Subtotal:</div>
                    <div className="px-1">
                      <Price className="font-bold" value={500} discount />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">With Starter Box Discount:</div>
                    <div className="px-1">
                      <Price className="font-bold" value={250} />
                    </div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">Promo Code</div>
                    <div className="px-1">－</div>
                  </div>
                  <div className="-mx-1 mt-2 flex flex-wrap justify-between">
                    <div className="px-1">Delivery:</div>
                    <div className="px-1">
                      <Price className="font-bold" value="FREE" dollorSign={false} />
                    </div>
                  </div>
                </CheckoutBlock>
                <CheckoutBlock>
                  <div className="-mx-1 flex flex-wrap justify-between text-xl font-bold">
                    <div className="px-1">Today’s Total:</div>
                    <div className="px-1">$250</div>
                  </div>
                  <div className="mt-4 text-center">
                    <Button>Checkout</Button>
                  </div>
                </CheckoutBlock>
              </div>
              <div className="mt-10 rounded-3xl bg-gold bg-opacity-10 px-6 py-10">
                <h2 className="text-3xl font-bold text-gold">Subscription</h2>
                <div className="mt-4 text-gold">
                  <p>Next Order: [8th of January 2024]</p>
                  <p className="mt-3">Delivery Cycle: Every [2 Weeks]</p>
                </div>
                <p className="mt-4">
                  OCELLE is an auto-renewing subscription with no long-term commitment. You can
                  edit, pause, or cancel unprocessed orders anytime. The payment method you choose
                  will automatically be charged at the price and frequency selected.
                </p>
                <p className="mt-4">
                  If you&apos;ve included a transition period in your starter box, your next order
                  will contain full portions for each day of food (price may be affected).
                </p>
              </div>
            </div>
          </div>
        </Container>
      </form>
    </ThemeProvider>
  );
}
