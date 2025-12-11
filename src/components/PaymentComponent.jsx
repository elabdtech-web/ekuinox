// Example usage in your Payment component
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import paymentService from '../services/paymentService';
import { cartService } from '../services/cartService';

export const PaymentComponent = ({ cartItems, cartTotal, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setPaymentError('Stripe not loaded');
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      // Format payment data
      const paymentData = paymentService.formatPaymentData(
        customerInfo, // Your form data
        cartItems,    // Cart items
        cartTotal     // Total amount
      );

      console.log('🔄 Starting payment process...');

      // Use the complete payment flow
      const result = await paymentService.handlePaymentFlow(stripe, elements, paymentData);

      if (result.success) {
        console.log('✅ Payment completed successfully!');
        setPaymentSuccess(true);
        
        // Optional: Clear cart after successful payment
        await cartService.clearCart();
        
        // Redirect or show success message
        // window.location.href = '/payment-success';
      }

    } catch (error) {
      console.error('❌ Payment error:', error.message);
      setPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Alternative: Step-by-step approach (if you need more control)
  const handlePaymentStepByStep = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      // Step 1: Create payment intent
      const paymentData = paymentService.formatPaymentData(customerInfo, cartItems, cartTotal);
      
      console.log('Creating payment intent...');
      const intentResponse = await paymentService.createPaymentIntent(paymentData);
      
      if (!intentResponse.success) {
        throw new Error(intentResponse.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = intentResponse.data;
      console.log('Payment intent created:', paymentIntentId);

      // Step 2: Confirm with Stripe
      console.log('Confirming payment with Stripe...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            phone: customerInfo.phone
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded with Stripe');
        
        // Step 3: Confirm on backend
        const confirmResponse = await paymentService.confirmPayment(paymentIntent.id);
        
        console.log('Payment confirmed on backend');
        setPaymentSuccess(true);
      }

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful! 🎉</h2>
        <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      {/* Card Element */}
      <div className="p-4 border rounded">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' }
              }
            }
          }}
        />
      </div>

      {/* Error Display */}
      {paymentError && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          ❌ {paymentError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-6 rounded font-medium ${
          processing 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </span>
        ) : (
          `Pay $${cartTotal}`
        )}
      </button>
    </form>
  );
};

export default PaymentComponent;