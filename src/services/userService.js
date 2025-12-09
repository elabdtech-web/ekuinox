import axiosInstance from '../config/axiosInstance';

// User Service
export const userService = {
  // Get all users (Admin only)
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters if provided
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await axiosInstance.get(url);
      
      console.log('Get users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  },

  // Get user by ID (Admin only)
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  // Toggle user status (Admin only)
  toggleUserStatus: async (id, isActive) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle user status');
    }
  },

  // Utility functions

  // Format user data for API
  formatUserData: (formData) => {
    return {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };
  },

  // Validate user data
  validateUser: (userData) => {
    const errors = {};
    
    if (!userData.name || userData.name.trim() === '') {
      errors.name = 'Name is required';
    }
    
    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email is invalid';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default userService;