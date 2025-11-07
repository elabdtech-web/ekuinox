import { CART_ENDPOINTS } from '../config/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Cart Service
export const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await fetch(CART_ENDPOINTS.GET_CART, {
        method: 'GET',
        headers: getAuthHeaders(),  
        
      });

      console.log('Get cart response:', response);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  },

  // Get cart summary
  getCartSummary: async () => {
    try {
      const response = await fetch(CART_ENDPOINTS.GET_SUMMARY, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get cart summary error:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (itemData) => {
    try {
      const response = await fetch(CART_ENDPOINTS.ADD_ITEM, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  },

  // Update cart item
  updateCartItem: async (itemId, updateData) => {
    try {
      const response = await fetch(`${CART_ENDPOINTS.UPDATE_ITEM}/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await fetch(`${CART_ENDPOINTS.REMOVE_ITEM}/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  },

  // Clear entire cart
  clearCart: async () => {
    try {
      const response = await fetch(CART_ENDPOINTS.CLEAR_CART, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  },

  // Checkout cart
  checkoutCart: async (checkoutData = {}) => {
    try {
      const response = await fetch(CART_ENDPOINTS.CHECKOUT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(checkoutData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Checkout cart error:', error);
      throw error;
    }
  },

  // Utility functions

  // Format cart item data for API
  formatCartItem: (itemData) => {
    return {
      productId: itemData.productId || itemData.id || itemData._id,
      quantity: itemData.qty || itemData.quantity || 1,
      image: itemData.colors?.[0]?.thumb || itemData.img || itemData.image, // Include image from colors
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