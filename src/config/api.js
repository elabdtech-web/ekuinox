// Production backend base URL (no trailing path beyond /api)
const API_BASE_URL = "https://vercel-node-api-rho.vercel.app/api";

// Health check endpoint (convenience)
export const HEALTH_ENDPOINT = `${API_BASE_URL}/health`;

// Export API_BASE_URL in case it's needed elsewhere
export const API_BASE_URL_EXPORT = API_BASE_URL;

// Debug logging to help troubleshoot deployment issues
console.log('🔗 API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  apiBaseUrl: API_BASE_URL,
  healthEndpoint: HEALTH_ENDPOINT
});

// Note: All endpoint constants have been moved to axiosInstance.js
// Services now use axiosInstance.get('/auth/login') instead of AUTH_ENDPOINTS.LOGIN
// This provides better maintainability and automatic token handling