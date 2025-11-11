
export const API_CONFIG = {
  
  DEV_API_URL: 'http://localhost:5001/api',
  
  
  PROD_API_URL: 'https://your-backend-domain.com/api',
  
  // Manual override - set this to force a specific URL
  MANUAL_API_URL: null, // Set to a URL string to override automatic detection
  
  // Get the appropriate API URL based on environment
  getApiUrl: () => {
    // If manual override is set, use it
    if (API_CONFIG.MANUAL_API_URL) {
      return API_CONFIG.MANUAL_API_URL;
    }
    
    // Check if we're running on localhost (development)
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return API_CONFIG.DEV_API_URL;
      }
    }
    
    // For production, return production URL
    return API_CONFIG.PROD_API_URL;
  }
};

// Export the current API URL
export const API_BASE_URL = API_CONFIG.getApiUrl();

// Export individual endpoints for easy access
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  ME: `${API_BASE_URL}/auth/me`,
  UPDATE_DETAILS: `${API_BASE_URL}/auth/updatedetails`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/updatepassword`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`
};

export const PRODUCT_ENDPOINTS = {
  // Public endpoints
  GET_FEATURED: `${API_BASE_URL}/products/featured`,
  GET_POPULAR: `${API_BASE_URL}/products/popular`,
  GET_LATEST: `${API_BASE_URL}/products/latest`,
  GET_BY_CATEGORY: `${API_BASE_URL}/products/category`,
  GET_ALL: `${API_BASE_URL}/products`,
  GET_BY_ID: `${API_BASE_URL}/products`,
  
  // Admin endpoints (protected)
  CREATE: `${API_BASE_URL}/products`,
  UPDATE: `${API_BASE_URL}/products`,
  DELETE: `${API_BASE_URL}/products`,
  TOGGLE_STATUS: `${API_BASE_URL}/products`
};

export const CART_ENDPOINTS = {
  GET_CART: `${API_BASE_URL}/cart`,
  GET_SUMMARY: `${API_BASE_URL}/cart/summary`,
  ADD_ITEM: `${API_BASE_URL}/cart/items`,
  UPDATE_ITEM: `${API_BASE_URL}/cart/items`,
  REMOVE_ITEM: `${API_BASE_URL}/cart/items`,
  CLEAR_CART: `${API_BASE_URL}/cart`,
  CHECKOUT: `${API_BASE_URL}/cart/checkout`
};

export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: `${API_BASE_URL}/users`,
  UPDATE: `${API_BASE_URL}/users`,
  DELETE: `${API_BASE_URL}/users`,
  TOGGLE_STATUS: `${API_BASE_URL}/users`
};

export const PAYMENT_ENDPOINTS = {
  CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
  CONFIRM: `${API_BASE_URL}/payments/confirm`
};

export const ORDER_ENDPOINTS = {
  // User endpoints
  GET_USER_ORDERS: `${API_BASE_URL}/orders/user`,
  GET_ORDER_BY_ID: `${API_BASE_URL}/orders`,
  CANCEL_ORDER: `${API_BASE_URL}/orders/cancel`,
  REQUEST_REFUND: `${API_BASE_URL}/orders/refund/request`,
  
  // Admin endpoints
  GET_ALL_ORDERS: `${API_BASE_URL}/admin/orders`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/admin/orders/status`,
  GET_REFUND_REQUESTS: `${API_BASE_URL}/admin/orders/refunds`,
  PROCESS_REFUND: `${API_BASE_URL}/admin/orders/refunds/process`,
  GET_ORDER_ANALYTICS: `${API_BASE_URL}/admin/orders/analytics`
};

export default API_CONFIG;