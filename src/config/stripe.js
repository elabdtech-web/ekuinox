import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment variable or use backend's matching key
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SaFKxKPprvXpEVvkZQS55ADzcyA39VQ68UfdRfBpHpDmMkuEEMqP8hX1O7fhba5X3hwaXZuKSzLLXLrWa034YIc008v4pBPnf';

console.log('🔑 Using Stripe publishable key:', publishableKey.substring(0, 20) + '...');

const stripePromise = loadStripe(publishableKey);

export default stripePromise;