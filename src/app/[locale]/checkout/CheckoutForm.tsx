'use client';

import {
  applyCoupon,
  deleteCartLine,
  finalizeCheckout,
  updateCartLine,
  updateCheckoutData,
} from './actions';

import CouponForm from '@/components/forms/Coupon';
import GuestCheckoutForm from '@/components/forms/GuestCheckout';
import { CalendarEvent } from '@/types';

export default function CheckoutForm({
  clientSecret,
  minDeliveryDate,
  calendarEvents,
}: {
  clientSecret: string;
  minDeliveryDate: Date;
  calendarEvents: CalendarEvent[];
}) {
  return (
    <GuestCheckoutForm
      clientSecret={clientSecret}
      minDeliveryDate={minDeliveryDate}
      calendarEvents={calendarEvents}
      renderCouponForm={({ disabled }) => <CouponForm disabled={disabled} action={applyCoupon} />}
      onCartUpdate={updateCartLine}
      onCartDelete={deleteCartLine}
      onBeforeTransaction={updateCheckoutData}
      onCompleteTransaction={finalizeCheckout}
    />
  );
}
