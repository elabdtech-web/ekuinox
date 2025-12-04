// const API_BASE_URL = "http://localhost:5001/api";
const API_BASE_URL = "https://ekuinox-backend.vercel.app/api";

// Debug logging to help troubleshoot deployment issues
console.log('🔗 API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  apiBaseUrl: API_BASE_URL
});

// Auth endpoints (ALL WORKING NOW)
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  ME: `${API_BASE_URL}/auth/me`,
  UPDATE_DETAILS: `${API_BASE_URL}/auth/updatedetails`,
  UPDATE_PASSWORD: `${API_BASE_URL}/auth/updatepassword`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgotPassword`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verifyOtp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`
};

// Product endpoints (ALL WORKING NOW)
export const PRODUCT_ENDPOINTS = {
  GET_FEATURED: `${API_BASE_URL}/products/featured`,
  GET_POPULAR: `${API_BASE_URL}/products/popular`,
  GET_LATEST: `${API_BASE_URL}/products/latest`,
  GET_BY_CATEGORY: `${API_BASE_URL}/products/category`, // Add ?category=Watch
  GET_ALL: `${API_BASE_URL}/products/getProducts`,
  GET_BY_ID: `${API_BASE_URL}/products/getProduct`, // Add ?id=PRODUCT_ID
  CREATE: `${API_BASE_URL}/products/createProduct`,
  UPDATE: `${API_BASE_URL}/products/updateProduct`, // Add ?id=PRODUCT_ID
  DELETE: `${API_BASE_URL}/products/deleteProduct`, // Add ?id=PRODUCT_ID
  TOGGLE_STATUS: `${API_BASE_URL}/products/toggleStatus` // Add ?id=PRODUCT_ID
};

// Cart endpoints (ALL WORKING)
export const CART_ENDPOINTS = {
  GET_CART: `${API_BASE_URL}/cart/getCart`,
  GET_SUMMARY: `${API_BASE_URL}/cart/summary`,
  ADD_ITEM: `${API_BASE_URL}/cart/addToCart`,
  UPDATE_ITEM: `${API_BASE_URL}/cart/updateItem`,
  REMOVE_ITEM: `${API_BASE_URL}/cart/removeItem`,
  CLEAR_CART: `${API_BASE_URL}/cart/clearCart`,
  CHECKOUT: `${API_BASE_URL}/cart/checkout`
};

// User endpoints (ALL WORKING NOW)
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: `${API_BASE_URL}/users`, // Add /USER_ID
  UPDATE: `${API_BASE_URL}/users`, // PUT /USER_ID
  DELETE: `${API_BASE_URL}/users`, // DELETE /USER_ID
  TOGGLE_STATUS: `${API_BASE_URL}/users` // PATCH /USER_ID/status
};

// Payment endpoints (ALL WORKING)
export const PAYMENT_ENDPOINTS = {
  CREATE_INTENT: `${API_BASE_URL}/payments/create-intent`,
  CONFIRM: `${API_BASE_URL}/payments/confirm`, // Add ?paymentIntentId=INTENT_ID
  GET_USER_PAYMENTS: `${API_BASE_URL}/payments`,
  CANCEL_ORDER: `${API_BASE_URL}/payments/cancel`,
  REQUEST_CANCELLATION: `${API_BASE_URL}/payments/cancel-request`
};

// Order endpoints (ALL WORKING)
export const ORDER_ENDPOINTS = {
  GET_USER_ORDERS: `${API_BASE_URL}/payments`,
  GET_ORDER_BY_ID: `${API_BASE_URL}/payments`, // Add /ORDER_ID
  CANCEL_ORDER: `${API_BASE_URL}/payments/cancel`,
  REQUEST_CANCELLATION: `${API_BASE_URL}/payments/cancel-request`,
  GET_ALL_ORDERS: `${API_BASE_URL}/admin/payments/getAllOrders`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/admin/payments/updateStatus`, // Add ?id=ORDER_ID
  GET_CANCELLATION_REQUESTS: `${API_BASE_URL}/admin/payments/getCancellationRequests`,
  PROCESS_CANCELLATION: `${API_BASE_URL}/admin/payments/processCancellation`, // Add ?id=ORDER_ID
  // GET_ORDER_ANALYTICS: `${API_BASE_URL}/admin/orders/analytics` // Not implemented (you said you don't need it)
};