import axios from "axios";

// Log the environment
console.log("🌐 Environment:", import.meta.env.MODE);
console.log("🌐 DEV mode:", import.meta.env.DEV);

// Use proxy in development to avoid CORS, direct URL in production
const isDev = import.meta.env.DEV;
const apiBaseUrl = isDev ? "/api" : "https://vercel-node-api-rho.vercel.app/api";

console.log("🌐 Environment:", import.meta.env.MODE);
console.log("🌐 API Base URL:", apiBaseUrl);
console.log("🌐 Using:", isDev ? "Vite proxy" : "Direct backend URL");

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
  console.log("🔥 REQUEST INTERCEPTOR EXECUTING");
  console.log("🔥 URL:", config.url);
  console.log("🔥 Token exists:", !!token);
  if (token) {
    console.log("🔥 Token (first 30 chars):", token.substring(0, 30));
  }

  if (token) {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }
    // Set Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization header SET");
    console.log("✅ Full header value:", config.headers.Authorization.substring(0, 50) + "...");
  } else {
    console.warn("⚠️ No token found in localStorage - request will be unauthorized");
  }

  console.log("✅ Final headers:", config.headers);
  console.log("═══════════════════════════════════════════");

  return config;
}, (error) => {
  console.error("❌ Request interceptor error:", error);
  return Promise.reject(error);
});

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors globally - but only clear token if it's NOT from getMe or similar auth check calls
    if (error.response?.status === 401) {
      console.log('🚨 401 Unauthorized');
      console.log('🚨 Request that failed:', error.config?.url);
      console.log('🚨 Keeping token for now - let the calling service decide what to do');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;