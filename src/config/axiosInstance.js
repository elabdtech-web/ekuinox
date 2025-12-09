import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vercel-node-api-rho.vercel.app/api",
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
      // Clear invalid token
      localStorage.removeItem('token');
      
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;