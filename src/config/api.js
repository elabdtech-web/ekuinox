// const API_BASE_URL = "http://localhost:5001/api";
// Production backend base URL (no trailing path beyond /api)
const API_BASE_URL = "https://vercel-node-api-rho.vercel.app/api";

// Health check endpoint (convenience)
export const HEALTH_ENDPOINT = `${API_BASE_URL}/health`;

// Debug logging to help troubleshoot deployment issues
console.log('🔗 API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  apiBaseUrl: API_BASE_URL,
  healthEndpoint: HEALTH_ENDPOINT
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

// City endpoints (ALL WORKING)
export const CITY_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/city/getCities`,
  GET_BY_USER: `${API_BASE_URL}/city/getCitiesByUserId`, // Add ?userId=USER_ID
  GET_BY_ID: `${API_BASE_URL}/city/getCity`, // Add ?id=CITY_ID
  CREATE: `${API_BASE_URL}/city/createCity`,
  UPDATE: `${API_BASE_URL}/city/updateCity`, // Add ?id=CITY_ID
  DELETE: `${API_BASE_URL}/city/deleteCity`, // Add ?id=CITY_ID
  REFRESH: `${API_BASE_URL}/city/refreshCity` // Add ?id=CITY_ID
};

// Country endpoints (ALL WORKING NOW)
export const COUNTRY_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/countries`, // Add ?continent=Asia&page=1&limit=10&sort=name&search=united&isActive=true
  GET_BY_ID: `${API_BASE_URL}/countries`, // Add /COUNTRY_ID  
  CREATE: `${API_BASE_URL}/countries/create`, // Admin only
  UPDATE: `${API_BASE_URL}/countries/update`, // Admin only - Add ?id=COUNTRY_ID
  DELETE: `${API_BASE_URL}/countries/delete`, // Admin only - Add ?id=COUNTRY_ID
  TOGGLE_STATUS: `${API_BASE_URL}/countries/toggle-status` // Admin only - Add ?id=COUNTRY_ID
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
  GET_BY_ID: `${API_BASE_URL}/payments`, // Add /PAYMENT_ID
  CANCEL_ORDER: `${API_BASE_URL}/payments/cancel`,
  REQUEST_CANCELLATION: `${API_BASE_URL}/payments/cancel-request`,
  REFUND: `${API_BASE_URL}/payments/refund`, // Add ?paymentIntentId=INTENT_ID
  WEBHOOK: `${API_BASE_URL}/payments/webhook` // Stripe webhook endpoint
};

// Admin endpoints (ALL WORKING)
export const ADMIN_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  INIT: `${API_BASE_URL}/admin/init`,
  SYSTEM: `${API_BASE_URL}/admin/system`,
  DELETE_ORDER: `${API_BASE_URL}/admin/payments/deleteOrder` // Add ?id=ORDER_ID
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
  PROCESS_CANCELLATION: `${API_BASE_URL}/admin/payments/processCancellation` // Add ?id=ORDER_ID
  // GET_ORDER_ANALYTICS: `${API_BASE_URL}/admin/orders/analytics` // Not implemented (you said you don't need it)
};

// Export all endpoint collections for easy import
// export {
//   AUTH_ENDPOINTS,
//   PRODUCT_ENDPOINTS,
//   CART_ENDPOINTS,
//   CITY_ENDPOINTS,
//   COUNTRY_ENDPOINTS,
//   USER_ENDPOINTS,
//   PAYMENT_ENDPOINTS,
//   ADMIN_ENDPOINTS,
//   ORDER_ENDPOINTS
// };

// Default export for backwards compatibility
export default {
  API_BASE_URL,
  HEALTH_ENDPOINT,
  AUTH_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  CART_ENDPOINTS,
  CITY_ENDPOINTS,
  COUNTRY_ENDPOINTS,
  USER_ENDPOINTS,
  PAYMENT_ENDPOINTS,
  ADMIN_ENDPOINTS,
  ORDER_ENDPOINTS
};