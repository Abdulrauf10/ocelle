import Stripe from 'stripe';
import invariant from 'ts-invariant';

invariant(process.env.STRIPE_API_KEY, 'Missing STRIPE_API_KEY environment variable');

const stripe = new Stripe(process.env.STRIPE_API_KEY);

class StripeClient {
  async createSetupIntent(params?: Stripe.SetupIntentCreateParams) {
    return stripe.setupIntents.create(params);
  }

  async retrivePaymentIntent(id: string) {
    return stripe.paymentIntents.retrieve(id);
  }

  async updatePaymentIntent(id: string, params?: Stripe.PaymentIntentUpdateParams) {
    return stripe.paymentIntents.update(id, params);
  }

  async createCustomer(params?: Stripe.CustomerCreateParams) {
    return stripe.customers.create(params);
  }

  async updateCustomer(id: string, params?: Stripe.CustomerUpdateParams) {
    return stripe.customers.update(id, params);
  }

  async retrieveCustomerPaymentMethod(id: string, cusId: string) {
    return stripe.customers.retrievePaymentMethod(cusId, id);
  }

  async retrievePaymentMethod(id: string) {
    return stripe.paymentMethods.retrieve(id);
  }

  async updatePaymentMethod(id: string, params?: Stripe.PaymentMethodUpdateParams) {
    return stripe.paymentMethods.update(id, params);
  }

  async attachPaymentMethod(id: string, cusId: string) {
    return stripe.paymentMethods.attach(id, { customer: cusId });
  }

  async detachPaymentMethod(id: string) {
    return stripe.paymentMethods.detach(id);
  }
}

const stripeClient = new StripeClient();

export default stripeClient;
