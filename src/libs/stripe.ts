import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

// Ensure we're using the test key format
const stripeKey = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') 
  ? process.env.STRIPE_SECRET_KEY 
  : `sk_test_${process.env.STRIPE_SECRET_KEY}`;

export const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-03-31.basil',
    typescript: true,
});