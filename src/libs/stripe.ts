import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  throw new Error('Stripe configuration error');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-03-31.basil',
    typescript: true,
    maxNetworkRetries: 3,
});