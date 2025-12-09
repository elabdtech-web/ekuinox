import axiosInstance from '../config/axiosInstance';

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
      
      const url = `/products/getProducts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get products');
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/featured');
      return response.data;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get featured products');
    }
  },  // Get latest products
  getLatestProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/latest');
      return response.data;
    } catch (error) {
      console.error('Get latest products error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get latest products');
    }
  },

  // Get popular products
  getPopularProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/popular');
      return response.data;
    } catch (error) {
      console.error('Get popular products error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get popular products');
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get products by category');
    }
  },

  // Get single product by ID
  getProduct: async (id) => {
    try {
      const response = await axiosInstance.get(`/products/getProduct/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get product');
    }
  },

  // Admin endpoints (authentication required)
  
  // Create new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await axiosInstance.post('/products/createProduct', productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  },

  // Update existing product (Admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await axiosInstance.put(`/products/updateProduct/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    try {
      const response = await axiosInstance.delete(`/products/deleteProduct/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete product error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  // Toggle product status (Admin only)
  toggleProductStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/products/toggleStatus/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Toggle product status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle product status');
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