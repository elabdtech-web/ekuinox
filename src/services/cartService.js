import axiosInstance from '../config/axiosInstance';

// Cart Service
export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await axiosInstance.get('/cart/getCart');
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get cart');
    }
  },

  // Get cart summary
  getCartSummary: async () => {
    try {
      const response = await axiosInstance.get('/cart/summary');
      return response.data;
    } catch (error) {
      console.error('Get cart summary error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get cart summary');
    }
  },

  // Add item to cart
  addToCart: async (itemData) => {
    try {
      const response = await axiosInstance.post('/cart/addToCart', itemData);
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  // Update cart item
  updateCartItem: async (itemId, updateData) => {
    try {
      const response = await axiosInstance.put(`/cart/updateItem/${itemId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/cart/removeItem/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from cart');
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await axiosInstance.delete('/cart/clearCart');
      return response.data;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  },

  // Checkout cart
  checkoutCart: async (checkoutData = {}) => {
    try {
      const response = await axiosInstance.post('/cart/checkout', checkoutData);
      return response.data;
    } catch (error) {
      console.error('Checkout cart error:', error);
      throw new Error(error.response?.data?.message || 'Failed to checkout cart');
    }
  },

  // Create Payment Intent for Stripe
  createPaymentIntent: async (paymentData) => {
    try {
      console.log('Creating payment intent with data:', paymentData);
      
      const response = await axiosInstance.post('/payments/create-intent', {
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        customerInfo: {
          firstName: paymentData.customerInfo?.firstName || '',
          lastName: paymentData.customerInfo?.lastName || '',
          email: paymentData.customerInfo?.email || '',
          phone: paymentData.customerInfo?.phone || ''
        },
        shippingAddress: paymentData.shippingAddress || {},
        billingAddress: paymentData.billingAddress || {},
        items: paymentData.items || [],
        paymentMethod: 'card'
      });
      
      console.log('Payment Intent Response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to create payment intent');
      }
      
      if (!response.data.data?.clientSecret) {
        throw new Error('No client secret received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Create payment intent error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  // Confirm Payment Intent (after Stripe confirmation)
  confirmPayment: async (paymentIntentId, paymentData = {}) => {
    try {
      const response = await axiosInstance.post('/payments/confirm-payment', {
        paymentIntentId,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  },

  // Utility functions

  // Format cart item data for API
  formatCartItem: (itemData) => {
    console.log('Formatting cart item for API:', itemData);

    return {
      productId: itemData.productId || itemData.id || itemData._id,
      quantity: itemData.qty || itemData.quantity || 1,
      image: itemData.colors?.[0]?.thumb || itemData.img || itemData.image,
      colors: itemData.colors || [], // Include full colors array
      // Optional options
      size: itemData.size,
      color: itemData.color,
      edition: itemData.edition
    };
  },

  // Calculate cart totals
  calculateTotals: (items) => {
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price?.replace(/[^0-9.-]+/g, '') || 0);
      return sum + (price * (item.quantity || item.qty || 1));
    }, 0);

    const delivery = subtotal > 100 ? 0 : 10; // Free delivery over $100
    const total = subtotal + delivery;

    return {
      subtotal: subtotal.toFixed(2),
      delivery: delivery.toFixed(2),
      total: total.toFixed(2)
    };
  }
};

export default cartService;