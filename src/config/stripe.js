import { loadStripe } from '@stripe/stripe-js';

// Your Stripe publishable key
const stripePromise = loadStripe('pk_test_51SS9rUQgHGEJc23tzpoOfHR3UdTIdxUx8LWQqyyKCh0a3aovw3vceSDSlTFVcBtppFNVFEzNuVqWtVyvlx594o6Y006fY7LKas');

export default stripePromise;