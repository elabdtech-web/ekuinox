// API Configuration
export const API_CONFIG = {
  // Development API URL (your local backend)
  DEV_API_URL: 'http://localhost:5000/api',
  
  // Production API URL (update this when you deploy your backend)
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
  LOGOUT: `${API_BASE_URL}/auth/logout`
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

export default API_CONFIG;