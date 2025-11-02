import { AUTH_ENDPOINTS } from '../config/api';

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

// Authentication Service
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await handleResponse(response);
      
      // Store token if registration includes auto-login
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
    login: async (credentials) => {
      console.log('authService login called with:', credentials);
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await handleResponse(response);

      console.log('Login response received');
      console.log('Login response data:', data);

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user profile
  getMe: async () => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.ME, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Update user details
  updateDetails: async (userDetails) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.UPDATE_DETAILS, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userDetails),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Update details error:', error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (passwordData) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.UPDATE_PASSWORD, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      // Remove token from localStorage regardless of response
      localStorage.removeItem('token');
      
      return await handleResponse(response);
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem('token');
  }
};

export default authService;