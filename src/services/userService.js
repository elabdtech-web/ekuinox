import { USER_ENDPOINTS } from '../config/api';

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
      
      const url = `${USER_ENDPOINTS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

        console.log('Get users response:', response.data);
      return await handleResponse(response);
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  // Get single user by ID (Admin only)
  getUser: async (id) => {
    try {
      const response = await fetch(`${USER_ENDPOINTS.GET_BY_ID}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    try {
      const response = await fetch(`${USER_ENDPOINTS.UPDATE}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${USER_ENDPOINTS.DELETE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // Toggle user status (Admin only)
  toggleUserStatus: async (id, status) => {
    try {
      const response = await fetch(`${USER_ENDPOINTS.TOGGLE_STATUS}/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
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