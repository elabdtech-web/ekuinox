


export const API_CONFIG = {
  DEV_API_URL: 'http://localhost:5001/api',
  PROD_API_URL: 'https://your-backend-domain.com/api',
  
  // Manual override - set this to force a specific URL
  MANUAL_API_URL: null,

  getApiUrl: () => {
    if (API_CONFIG.MANUAL_API_URL) return API_CONFIG.MANUAL_API_URL;

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return API_CONFIG.DEV_API_URL;
      }
    }

    return API_CONFIG.PROD_API_URL;
  }
};

// Export the current API URL
export const API_BASE_URL = API_CONFIG.getApiUrl();

// Auth endpoints
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

// Product endpoints
export const PRODUCT_ENDPOINTS = {
  GET_FEATURED: `${API_BASE_URL}/products/featured`,
  GET_POPULAR: `${API_BASE_URL}/products/popular`,
  GET_LATEST: `${API_BASE_URL}/products/latest`,
  GET_BY_CATEGORY: `${API_BASE_URL}/products/category`,
  GET_ALL: `${API_BASE_URL}/products`,
  GET_BY_ID: `${API_BASE_URL}/products`,
  CREATE: `${API_BASE_URL}/products`,
  UPDATE: `${API_BASE_URL}/products`,
  DELETE: `${API_BASE_URL}/products`,
  TOGGLE_STATUS: `${API_BASE_URL}/products`
};

// Cart endpoints
export const CART_ENDPOINTS = {
  GET_CART: `${API_BASE_URL}/cart`,
  GET_SUMMARY: `${API_BASE_URL}/cart/summary`,
  ADD_ITEM: `${API_BASE_URL}/cart/items`,
  UPDATE_ITEM: `${API_BASE_URL}/cart/items`,
  REMOVE_ITEM: `${API_BASE_URL}/cart/items`,
  CLEAR_CART: `${API_BASE_URL}/cart`,
  CHECKOUT: `${API_BASE_URL}/cart/checkout`
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: `${API_BASE_URL}/users`,
  UPDATE: `${API_BASE_URL}/users`,
  DELETE: `${API_BASE_URL}/users`,
  TOGGLE_STATUS: `${API_BASE_URL}/users`
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
  CONFIRM: `${API_BASE_URL}/payments/confirm`,
  GET_USER_PAYMENTS: `${API_BASE_URL}/payments/user`,
  CANCEL_ORDER: `${API_BASE_URL}/payments/cancel`,
  REQUEST_CANCELLATION: `${API_BASE_URL}/payments/cancel-request`
};

// Order endpoints
export const ORDER_ENDPOINTS = {
  GET_USER_ORDERS: `${API_BASE_URL}/payments/user`,
  GET_ORDER_BY_ID: `${API_BASE_URL}/payments`,
  CANCEL_ORDER: `${API_BASE_URL}/payments/cancel`,
  REQUEST_CANCELLATION: `${API_BASE_URL}/payments/cancel-request`,
  GET_ALL_ORDERS: `${API_BASE_URL}/admin/orders`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/admin/orders/status`,
  GET_CANCELLATION_REQUESTS: `${API_BASE_URL}/admin/cancellation-requests`,
  PROCESS_CANCELLATION: `${API_BASE_URL}/admin/payments`,
  GET_ORDER_ANALYTICS: `${API_BASE_URL}/admin/orders/analytics`
};

export default API_CONFIG;
