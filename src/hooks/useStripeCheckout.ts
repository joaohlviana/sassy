import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCTS, ProductId, stripePromise } from '@/stripe-config';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (productId: ProductId) => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const product = PRODUCTS[productId];
      
      const response = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      router.push('/checkout/error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCheckout,
    isLoading
  };
}