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
      
      console.log('✅ Login successful, full response:', response);
      console.log('✅ response.data:', response.data);
      console.log('🔥 Token from response.data.token:', response.data.token);
      console.log('🔥 Token type:', typeof response.data.token);
      console.log('🔥 Token length:', response.data.token?.length);

      // Store token in localStorage
      if (response.data.token) {
        // Ensure token is a string, not a JSON-encoded string
        let tokenToStore = response.data.token;
        if (typeof tokenToStore === 'string' && (tokenToStore.startsWith('"') || tokenToStore.startsWith("'"))) {
          console.warn('⚠️ Token appears to be JSON-encoded, removing quotes');
          tokenToStore = tokenToStore.replace(/^["']|["']$/g, '');
        }
        
        localStorage.setItem('token', tokenToStore);
        console.log('✅ Token STORED in localStorage');
        console.log('✅ Stored token (first 50 chars):', tokenToStore.substring(0, 50));
        
        // Also store user data for persistence across page refreshes
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('✅ User data STORED in localStorage');
        }
        
        // Verify token was stored correctly
        const storedToken = localStorage.getItem('token');
        console.log('✅ Verification - token in localStorage after storing (first 50 chars):', storedToken.substring(0, 50));
        console.log('✅ Token matches response token:', storedToken === tokenToStore);
      } else {
        console.error('❌ No token in login response!');
        console.error('❌ response.data keys:', Object.keys(response.data));
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
      
      // Remove token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Token and user data cleared from localStorage');
      
      return response.data;
    } catch (error) {
      // Still remove token and user data even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Token and user data cleared from localStorage (after error)');
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
    localStorage.removeItem('user');
    console.log('✅ All auth data cleared');
  }
};

export default authService;