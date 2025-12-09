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
    const checkAuth = () => {
      console.log('═══════════════════════════════════════════');
      console.log('🔍 AUTH CHECK RUNNING ON APP LOAD');
      console.log('═══════════════════════════════════════════');
      
      try {
        const token = localStorage.getItem('token');
        const storedUserStr = localStorage.getItem('user');
        
        console.log('🔍 Token from localStorage:', token ? `✅ Found (${token.substring(0, 20)}...)` : '❌ Not found');
        console.log('🔍 User data from localStorage:', storedUserStr ? '✅ Found' : '❌ Not found');
        
        if (token && storedUserStr) {
          try {
            const userData = JSON.parse(storedUserStr);
            console.log('✅ Successfully parsed user data:', userData);
            console.log('✅ Setting isAuthenticated to TRUE');
            console.log('✅ Setting user to:', userData);
            
            setUser(userData);
            setIsAuthenticated(true);
            
            console.log('✅ Auth restored successfully!');
          } catch (parseError) {
            console.error('❌ Failed to parse stored user data:', parseError);
            console.log('❌ Clearing all auth data due to parse error');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('⚠️ Token or user data missing:');
          console.log('   - Token present:', !!token);
          console.log('   - User present:', !!storedUserStr);
          console.log('❌ User NOT authenticated');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Unexpected error in auth check:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        console.log('═══════════════════════════════════════════');
        setLoading(false);
      }
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
      
      // CRITICAL: Verify token was stored after login
      const tokenAfterLogin = localStorage.getItem('token');
      console.log('🔴 AFTER LOGIN - Token in localStorage:', tokenAfterLogin ? `${tokenAfterLogin.substring(0, 20)}...` : 'NULL');
      
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