import { loadStripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const PRODUCTS = {
  teste: {
    id: 'prod_SLwHR3OqcLxOXm',
    priceId: 'price_1RREP8Pvl1mw1yRdPkr1rKjd',
    mode: 'subscription' as const,
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;