import axiosInstance from '../config/axiosInstance';

// Payment Service for Stripe integration
class PaymentService {
  
  // Create Payment Intent
  async createPaymentIntent(paymentData) {
    try {
      console.log('🔄 Creating payment intent with data:', paymentData);
      
      // Validate required fields
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Valid amount is required');
      }
      
      if (!paymentData.customerInfo?.email) {
        throw new Error('Customer email is required');
      }
      
      const requestData = {
        amount: Math.round(paymentData.amount * 100), // Convert to cents
        currency: paymentData.currency || 'usd',
        customerInfo: {
          firstName: paymentData.customerInfo?.firstName || '',
          lastName: paymentData.customerInfo?.lastName || '',
          email: paymentData.customerInfo?.email || '',
          phone: paymentData.customerInfo?.phone || ''
        },
        shippingAddress: paymentData.shippingAddress || {},
        billingAddress: paymentData.billingAddress || paymentData.shippingAddress || {},
        items: paymentData.items || [],
        paymentMethod: 'card',
        metadata: paymentData.metadata || {}
      };
      
      console.log('📤 Sending payment intent request:', requestData);
      
      const response = await axiosInstance.post('/payments/create-intent', requestData);
      
      console.log('📥 Payment Intent Response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create payment intent');
      }
      
      if (!response.data.data?.clientSecret) {
        throw new Error('No client secret received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Create payment intent error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create payment intent');
    }
  }

  // Confirm Payment Intent (after successful Stripe confirmation)
  async confirmPayment(paymentIntentId, additionalData = {}) {
    try {
      console.log('🔄 Confirming payment for intent:', paymentIntentId);
      
      if (!paymentIntentId) {
        throw new Error('Payment Intent ID is required');
      }
      
      const response = await axiosInstance.post('/payments/confirm-payment', {
        paymentIntentId,
        ...additionalData
      });
      
      console.log('✅ Payment confirmed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Confirm payment error:', error);
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  }

  // Get Payment Status
  async getPaymentStatus(paymentIntentId) {
    try {
      const response = await axiosInstance.get(`/payments/status/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get payment status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }

  // Handle Payment Flow (Complete flow from intent creation to confirmation)
  async handlePaymentFlow(stripe, elements, paymentData) {
    try {
      console.log('🔄 Starting complete payment flow');
      
      if (!stripe || !elements) {
        throw new Error('Stripe not initialized');
      }

      // Step 1: Create payment intent
      console.log('📝 Step 1: Creating payment intent');
      const paymentIntentResponse = await this.createPaymentIntent(paymentData);
      
      const { clientSecret, paymentIntentId } = paymentIntentResponse.data;
      
      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      console.log('✅ Payment intent created:', paymentIntentId);
      console.log('🔑 Client secret received (first 20 chars):', clientSecret.substring(0, 20) + '...');

      // Step 2: Confirm payment with Stripe
      console.log('💳 Step 2: Confirming payment with Stripe');
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement('card') || elements.getElement('cardNumber'),
          billing_details: {
            name: `${paymentData.customerInfo?.firstName || ''} ${paymentData.customerInfo?.lastName || ''}`.trim(),
            email: paymentData.customerInfo?.email || '',
            phone: paymentData.customerInfo?.phone || '',
            address: paymentData.billingAddress ? {
              line1: paymentData.billingAddress.address,
              city: paymentData.billingAddress.city,
              state: paymentData.billingAddress.state,
              postal_code: paymentData.billingAddress.zipCode,
              country: paymentData.billingAddress.country || 'US'
            } : undefined
          }
        }
      });

      if (error) {
        console.error('❌ Stripe payment confirmation error:', error);
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded with Stripe:', paymentIntent.id);
        
        // Step 3: Confirm payment on backend
        console.log('📝 Step 3: Confirming payment on backend');
        const confirmResponse = await this.confirmPayment(paymentIntent.id, {
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        });
        
        console.log('✅ Payment flow completed successfully');
        return {
          success: true,
          paymentIntent,
          confirmation: confirmResponse
        };
      } else {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      }

    } catch (error) {
      console.error('❌ Payment flow error:', error);
      throw error;
    }
  }

  // Format payment data for API
  formatPaymentData(formData, cartItems, cartTotal) {
    return {
      amount: parseFloat(cartTotal), // Will be converted to cents in createPaymentIntent
      currency: 'usd',
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country || 'US'
      },
      billingAddress: formData.billingAddress || {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country || 'US'
      },
      items: cartItems.map(item => ({
        productId: item.productId || item.id,
        name: item.name || item.title,
        quantity: item.quantity || item.qty || 1,
        price: item.price,
        image: item.image
      })),
      metadata: {
        orderSource: 'web',
        timestamp: new Date().toISOString()
      }
    };
  }
}

export default new PaymentService();