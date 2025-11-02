import { PRODUCT_ENDPOINTS } from '../config/api';

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

// Product Service
export const productService = {
  // Public endpoints (no authentication required)
  
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add query parameters if provided
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = `${PRODUCT_ENDPOINTS.GET_ALL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(PRODUCT_ENDPOINTS.GET_FEATURED, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
    },
  
  //GET latest products
  getLatestProducts: async () => {
    try {
      const response = await fetch(PRODUCT_ENDPOINTS.GET_LATEST, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get latest products error:', error);
      throw error;
    }
  },

  // Get popular products
  getPopularProducts: async () => {
    try {
      const response = await fetch(PRODUCT_ENDPOINTS.GET_POPULAR, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get popular products error:', error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${PRODUCT_ENDPOINTS.GET_BY_CATEGORY}/${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProduct: async (id) => {
    try {
      const response = await fetch(`${PRODUCT_ENDPOINTS.GET_BY_ID}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  // Admin endpoints (authentication required)
  
  // Create new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await fetch(PRODUCT_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // Update existing product (Admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${PRODUCT_ENDPOINTS.UPDATE}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${PRODUCT_ENDPOINTS.DELETE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Toggle product status (Admin only)
  toggleProductStatus: async (id, status) => {
    try {
      const response = await fetch(`${PRODUCT_ENDPOINTS.TOGGLE_STATUS}/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Toggle product status error:', error);
      throw error;
    }
  },

  // Utility functions

  // Format product data for API
  formatProductData: (formData) => {
    return {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      sku: formData.sku,
      stock: parseInt(formData.stock) || 0,
      category: formData.category,
      status: formData.status,
      videoTitle: formData.videoTitle || '',
      videoUrl: formData.videoUrl || '',
      sizes: formData.sizes || [],
      editions: formData.editions || [],
      colors: formData.colors || [],
      stats: formData.stats || [],
      subItems: formData.subItems || []
    };
  },

  // Validate product data
  validateProduct: (productData) => {
    const errors = {};
    
    if (!productData.name || productData.name.trim() === '') {
      errors.name = 'Product name is required';
    }
    
    if (!productData.description || productData.description.trim() === '') {
      errors.description = 'Product description is required';
    }
    
    if (!productData.price || productData.price.trim() === '') {
      errors.price = 'Product price is required';
    }
    
    if (!productData.sku || productData.sku.trim() === '') {
      errors.sku = 'Product SKU is required';
    }
    
    if (productData.stock < 0) {
      errors.stock = 'Stock quantity cannot be negative';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default productService;