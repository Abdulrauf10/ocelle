import Container from '@/components/Container';
import Section from '../Section';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  createTheme,
  useTheme,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import H2 from '@/components/Heading/H2';
import React from 'react';
import SectionBreak from '../SectionBreak';
import Pen from '@/components/Icon/Pen';
import DateCalendar from '../controls/DateCalendar';
import Image from 'next/image';
import Lock from '@/components/Icon/Lock';
import Stripe from '@/components/Icon/Stripe';
import CircleTick from '@/components/Icon/CircleTick';
import Price from '@/components/Price';
import Button from '@/components/Button';
import FragmentProps from '../FragmentProps';

interface CheckoutBlockProps {
  title?: string;
}

function CheckoutBlock({ title, children }: React.PropsWithChildren<CheckoutBlockProps>) {
  return (
    <div className="border-gold mt-4 border-t pt-4">
      {title && <h3 className="text-gold text-xl font-bold">{title}</h3>}
      {children}
    </div>
  );
}

interface EditButtonProps {
  onClick(): void;
}

function EditButton({ onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center text-primary [&:hover_span]:underline"
      onClick={onClick}
    >
      <span className="font-bold uppercase">Edit</span>
      <Pen className="ml-1.5 w-4" />
    </button>
  );
}

export default function CheckoutFragment({ forward }: FragmentProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = React.useCallback(
    (values: unknown) => {
      console.log(values);
      forward();
    },
    [forward]
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
                        <TextField {...field} label="First Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="lastname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Last Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Email" fullWidth error={!!error} />
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
              <Section dense title="Delivery Address">
                <div className="-m-2 flex flex-wrap">
                  <div className="w-1/2 p-2">
                    <Controller
                      name="deliveryFirstname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="First Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="deliveryLastname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Last Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="deliveryAddress1"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Address Line 1" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="deliveryAddress2"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Address Line 2" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="deliveryDistrict"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="delivery-district-label">District</InputLabel>
                          <Select
                            {...field}
                            labelId="delivery-district-label"
                            label="District"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="11">Testing</MenuItem>
                            <MenuItem value="12">Testing</MenuItem>
                            <MenuItem value="13">Testing</MenuItem>
                            <MenuItem value="14">Testing</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="deliveryRegion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="delivery-region-label">Region</InputLabel>
                          <Select
                            {...field}
                            labelId="delivery-region-label"
                            label="Region"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="11">Testing</MenuItem>
                            <MenuItem value="12">Testing</MenuItem>
                            <MenuItem value="13">Testing</MenuItem>
                            <MenuItem value="14">Testing</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="deliveryCountry"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="delivery-country-label">Country</InputLabel>
                          <Select
                            {...field}
                            labelId="delivery-country-label"
                            label="Country"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="hk">Hong Kong</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title="Billing Address">
                <div className="-m-2 flex flex-wrap">
                  <div className="w-1/2 p-2">
                    <Controller
                      name="billingFirstname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="First Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="billingLastname"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Last Name" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="billingAddress1"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Address Line 1" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="billingAddress2"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Address Line 2" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="billingDistrict"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="billing-district-label">District</InputLabel>
                          <Select
                            {...field}
                            labelId="billing-district-label"
                            label="District"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="11">Testing</MenuItem>
                            <MenuItem value="12">Testing</MenuItem>
                            <MenuItem value="13">Testing</MenuItem>
                            <MenuItem value="14">Testing</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="billingRegion"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="billing-region-label">Region</InputLabel>
                          <Select
                            {...field}
                            labelId="billing-region-label"
                            label="Region"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="11">Testing</MenuItem>
                            <MenuItem value="12">Testing</MenuItem>
                            <MenuItem value="13">Testing</MenuItem>
                            <MenuItem value="14">Testing</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="w-1/3 p-2">
                    <Controller
                      name="billingCountry"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="billing-country-label">Country</InputLabel>
                          <Select
                            {...field}
                            labelId="billing-country-label"
                            label="Country"
                            fullWidth
                            error={!!error}
                          >
                            <MenuItem value="hk">Hong Kong</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </Section>
              <SectionBreak half />
              <Section dense title="Payment Information">
                <div className="-mx-3 my-3 flex flex-wrap items-center">
                  <Stripe className="mx-3 my-2 w-24" />
                  <div className="mx-3 my-2 flex items-center">
                    <Lock className="relative -top-0.5 w-6" />
                    <span className="ml-4 text-lg text-[#7B8D97]">
                      All transactions are secure and encrypted.
                    </span>
                  </div>
                </div>
                <div className="-m-2 flex flex-wrap">
                  <div className="w-full p-2">
                    <Controller
                      name="cardName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Name On Card" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-full p-2">
                    <Controller
                      name="cardNo"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="Card Number" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="cardExp"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Card Expiration Date"
                          fullWidth
                          error={!!error}
                        />
                      )}
                    />
                  </div>
                  <div className="w-1/2 p-2">
                    <Controller
                      name="cardCvc"
                      control={control}
                      rules={{ required: true }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField {...field} label="CVC" fullWidth error={!!error} />
                      )}
                    />
                  </div>
                </div>
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
              <div className="rounded-3xl bg-[#F8F3EB] px-6 py-10">
                <h2 className="text-gold text-3xl font-bold">Order Summary</h2>
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
              <div className="mt-10 rounded-3xl bg-[#F8F3EB] px-6 py-10">
                <h2 className="text-gold text-3xl font-bold">Subscription</h2>
                <div className="text-gold mt-4">
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
