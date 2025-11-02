import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiEye, FiDollarSign } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);



  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      const productsData = response.data || response.products || response || [];
      
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = () => {
    navigate('/admin/add-product');
  };

  const handleEditProduct = (product) => {
    // Navigate to edit product page with product data
    navigate(`/admin/add-product?edit=${product.id}`, { state: { product } });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowPreviewModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        // Remove from local state after successful API call
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const toggleProductStatus = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      const newStatus = product.status === 'Active' ? 'Inactive' : 'Active';
      
      await productService.toggleProductStatus(productId, newStatus);
      
      // Update local state after successful API call
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, status: newStatus }
          : p
      ));
      
      alert(`Product status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Failed to update product status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5695F5]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Products</h1>
            <p className="text-white/60 mt-2">Add, edit, and manage your product catalog</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <FiPackage className="w-8 h-8 text-[#5695F5]" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Products</p>
              <p className="text-2xl font-bold text-green-400">
                {products.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-blue-400">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
            <FiPackage className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Categories</p>
              <p className="text-2xl font-bold text-purple-400">
                {new Set(products.map(p => p.category)).size}
              </p>
            </div>
            <FiDollarSign className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition w-full"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
              {product.colors && product.colors[0] ? (
                <img
                  src={product.colors[0].thumb}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage className="w-16 h-16 text-white/60" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {product.status}
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-medium line-clamp-2">{product.name}</h3>
                <span className="text-[#5695F5] font-semibold">{product.price}</span>
              </div>
              
              <p className="text-white/60 text-sm line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                <span>SKU: {product.sku}</span>
                <span>Stock: {product.stock}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleViewProduct(product)}
                  className="flex-1 p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition text-center"
                  title="View Details"
                >
                  <FiEye className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition text-center"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition text-center"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No products found</h3>
          <p className="text-white/60 mb-4">
            {searchTerm ? 'No products match your search criteria.' : 'No products have been added yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddProduct}
              className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}



      {/* Preview Modal */}
      {showPreviewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#070B13] rounded-xl p-6 w-full max-w-4xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Product Details</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="bg-white/5 rounded-xl p-4">
                {selectedProduct.colors && selectedProduct.colors[0] ? (
                  <img
                    src={selectedProduct.colors[0].thumb}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-white/10 rounded-lg">
                    <FiPackage className="w-16 h-16 text-white/60" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                  <p className="text-white/60">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Price:</span>
                    <p className="text-[#5695F5] font-semibold text-lg">{selectedProduct.price}</p>
                  </div>
                  <div>
                    <span className="text-white/60">SKU:</span>
                    <p className="text-white">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Category:</span>
                    <p className="text-white">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Stock:</span>
                    <p className="text-white">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedProduct.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Created:</span>
                    <p className="text-white">{formatDate(selectedProduct.createdAt)}</p>
                  </div>
                </div>

                {/* Colors */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-2">Available Colors:</span>
                    <div className="flex space-x-2">
                      {selectedProduct.colors.map((color, index) => (
                        <div key={index} className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                          <img src={color.thumb} alt={color.alt} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-2">Available Sizes:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {selectedProduct.stats && selectedProduct.stats.length > 0 && (
                  <div>
                    <span className="text-white/60 block mb-2">Product Stats:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.stats.map((stat, index) => (
                        <div key={index} className="text-center bg-white/5 rounded-lg p-2">
                          <p className="text-[#5695F5] font-semibold">{stat.value}</p>
                          <p className="text-white/60 text-xs">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;