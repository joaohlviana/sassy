import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!stripeSecretKey.startsWith('sk_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY format. Must start with "sk_"');
}

export const stripe = new Stripe(stripeSecretKey.trim(), {
    apiVersion: '2025-03-31.basil',
    typescript: true,
    maxNetworkRetries: 3,
});