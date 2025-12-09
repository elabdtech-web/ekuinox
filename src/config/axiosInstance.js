import axios from "axios";

// Log the environment
console.log("🌐 Environment:", import.meta.env.MODE);
console.log("🌐 DEV mode:", import.meta.env.DEV);

// Determine the API base URL based on environment
const isDev = import.meta.env.DEV;
const apiBaseUrl = isDev ? "/api" : "https://vercel-node-api-rho.vercel.app/api";

console.log("🌐 API Base URL:", apiBaseUrl);

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("✅ axiosInstance created with baseURL:", apiBaseUrl);

// Automatically add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("═══════════════════════════════════════════");
  console.log("🔥 REQUEST INTERCEPTOR FIRED FOR:", config.url);
  console.log("🔥 Token in localStorage:", token ? `${token.substring(0, 20)}...` : 'NULL');
  console.log("🔥 Full token:", token);
  console.log("🔥 Headers before setting:", config.headers);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header SET");
  } else {
    console.error("❌ NO TOKEN FOUND - Authorization header NOT set");
  }

  console.log("🔥 Headers after setting:", config.headers);
  console.log("═══════════════════════════════════════════");

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized - clearing token');
      console.log('🚨 Request that failed:', error.config?.url);
      console.log('🚨 Current token before clearing:', localStorage.getItem('token'));
      
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;