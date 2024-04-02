export function getStripeAppId() {
  return process.env.SALEOR_STRIPE_APP_ID ?? 'app.saleor.stripe';
}
