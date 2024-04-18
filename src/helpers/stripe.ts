'use server';

import Stripe from 'stripe';
import invariant from 'ts-invariant';

invariant(process.env.STRIPE_API_KEY, 'Missing STRIPE_API_KEY environment variable');

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export async function createSetupIntent(params?: Stripe.SetupIntentCreateParams) {
  return stripe.setupIntents.create(params);
}

export async function retrivePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id);
}
}

export async function updatePaymentIntent(id: string, params?: Stripe.PaymentIntentUpdateParams) {
  return stripe.paymentIntents.update(id, params);
}

export async function createCustomer(params?: Stripe.CustomerCreateParams) {
  return stripe.customers.create(params);
}

export async function updateCustomer(id: string, params?: Stripe.CustomerUpdateParams) {
  return stripe.customers.update(id, params);
}

export async function retrieveCustomerPaymentMethod(id: string, cusId: string) {
  return stripe.customers.retrievePaymentMethod(cusId, id);
}

export async function retrievePaymentMethod(id: string) {
  return stripe.paymentMethods.retrieve(id);
}

export async function updatePaymentMethod(id: string, params?: Stripe.PaymentMethodUpdateParams) {
  return stripe.paymentMethods.update(id, params);
}

export async function attachPaymentMethod(id: string, cusId: string) {
  return stripe.paymentMethods.attach(id, { customer: cusId });
}

export async function detachPaymentMethod(id: string) {
  return stripe.paymentMethods.detach(id);
}
