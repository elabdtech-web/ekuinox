import axiosInstance from '../config/axiosInstance';

// Authentication Service
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      
      // Store token if registration includes auto-login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user
  login: async (credentials) => {
    console.log('🔐 authService login called with:', {
      email: credentials.email,
      password: credentials.password ? '[REDACTED]' : 'MISSING',
      passwordLength: credentials.password?.length || 0
    });
    
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      console.log('✅ Login successful, response data:', response.data);

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Get current user profile
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgotPassword', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to send password reset email');
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await axiosInstance.post('/auth/verifyOtp', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Reset password
  resetPassword: async ({ token, newPassword }) => {
    try {
      const response = await axiosInstance.put('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  // Update user details
  updateDetails: async (userDetails) => {
    try {
      const response = await axiosInstance.put('/auth/updatedetails', userDetails);
      return response.data;
    } catch (error) {
      console.error('Update details error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update details');
    }
  },

  // Update password
  updatePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/auth/updatepassword', passwordData);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await axiosInstance.get('/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      return response.data;
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      console.error('Logout error:', error);
      throw new Error(error.response?.data?.message || 'Logout failed');
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