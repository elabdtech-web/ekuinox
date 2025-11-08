import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          // Verify token with backend and get user data
          const userData = await authService.getMe();
          setUser(userData.data || userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          authService.clearAuth();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function with real API integration
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Clear any existing user state first
      setUser(null);
      setIsAuthenticated(false);
      
      const response = await authService.login({ email, password });
      
      // Set user data from API response
      const userData = response.data || response.user;
      console.log('Login successful for user:', userData?.id || userData?._id, userData?.email);
      
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, message: 'Login successful', data: response };
    } catch (error) {
      setLoading(false);
      console.error('❌ AuthContext login error:', {
        message: error.message,
        status: error.status,
        data: error.data,
        fullError: error
      });
      
      // Provide more specific error messages based on status
      let userMessage = error.message || 'Login failed. Please check your credentials and try again.';
      
      if (error.status === 401) {
        userMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.status === 404) {
        userMessage = 'Login service not found. Please contact support.';
      } else if (error.status === 429) {
        userMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
      } else if (error.status >= 500) {
        userMessage = 'Server error. Please try again later.';
      }
      
      return { 
        success: false, 
        message: userMessage,
        status: error.status,
        originalError: error.message
      };
    }
  };

  // Logout function with API integration
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API response
      console.log('Logging out user:', user?.email);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authService.register(userData);
      
      // If registration includes auto-login
      if (response.token) {
        setUser(response.data || response.user);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
      return { success: true, message: 'Registration successful', data: response };
    } catch (error) {
      setLoading(false);
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Update user details
  const updateDetails = async (userDetails) => {
    try {
      const response = await authService.updateDetails(userDetails);
      
      // Update local user data
      setUser(response.data || response.user);
      
      return { success: true, message: 'Details updated successfully', data: response };
    } catch (error) {
      console.error('Update details error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update details. Please try again.' 
      };
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      const response = await authService.updatePassword(passwordData);
      
      return { success: true, message: 'Password updated successfully', data: response };
    } catch (error) {
      console.error('Update password error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to update password. Please try again.' 
      };
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register,
    updateDetails,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};