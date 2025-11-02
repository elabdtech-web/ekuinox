import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiPlus } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') !== null;
  const editingProduct = location.state?.product;


  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    sku: '',
    stock: 0,
    category: 'Watch',
    status: 'Active',
    videoTitle: '',
    videoUrl: '',
    sizes: [],
    editions: [],
    colors: [],
    stats: [],
    subItems: [], // New field for sub-items
    relatedProducts: [] // New field for related products
  });

  // Dynamic field states
  const [newSize, setNewSize] = useState('');
  const [newEdition, setNewEdition] = useState('');
  const [newColor, setNewColor] = useState({
    id: '',
    alt: '',
    thumb: '',
    gallery: ['']
  });
  const [newStat, setNewStat] = useState({
    label: '',
    value: ''
  });
  const [newSubItem, setNewSubItem] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  // Related products states
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Load product data when in edit mode
  useEffect(() => {
    if (isEditMode && editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        price: editingProduct.price || '',
        description: editingProduct.description || '',
        sku: editingProduct.sku || '',
        stock: editingProduct.stock || 0,
        category: editingProduct.category || 'Watch',
        status: editingProduct.status || 'Active',
        videoTitle: editingProduct.videoTitle || '',
        videoUrl: editingProduct.videoUrl || '',
        sizes: editingProduct.sizes || [],
        editions: editingProduct.editions || [],
        colors: editingProduct.colors || [],
        stats: editingProduct.stats || [],
        subItems: editingProduct.subItems || [],
        relatedProducts: editingProduct.relatedProducts || []
      });
    }
  }, [isEditMode, editingProduct]);

  // Fetch available products for related products selection
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await productService.getProducts();
        console.log('Fetched products for related selection:', response);
        // Show all products in the dropdown
        setAvailableProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchAvailableProducts();
  }, []);

  // Helper functions for dynamic fields
  const addSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const addEdition = () => {
    if (newEdition.trim()) {
      setFormData(prev => ({
        ...prev,
        editions: [...prev.editions, newEdition.trim()]
      }));
      setNewEdition('');
    }
  };

  const removeEdition = (index) => {
    setFormData(prev => ({
      ...prev,
      editions: prev.editions.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (newColor.id && newColor.thumb && newColor.alt) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { ...newColor, gallery: newColor.gallery.filter(g => g.trim()) }]
      }));
      setNewColor({
        id: '',
        thumb: '',
        gallery: [''],
        alt: ''
      });
    }
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = (index, value) => {
    setNewColor(prev => ({
      ...prev,
      gallery: prev.gallery.map((img, i) => i === index ? value : img)
    }));
  };

  const addGalleryImage = () => {
    setNewColor(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const removeGalleryImage = (index) => {
    setNewColor(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addStat = () => {
    if (newStat.label && newStat.value) {
      setFormData(prev => ({
        ...prev,
        stats: [...prev.stats, { ...newStat }]
      }));
      setNewStat({
        label: '',
        value: ''
      });
    }
  };

  const removeStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  // Sub-items management functions
  const addSubItem = () => {
    if (newSubItem.name && newSubItem.price) {
      setFormData(prev => ({
        ...prev,
        subItems: [...prev.subItems, { ...newSubItem, id: Date.now() }]
      }));
      setNewSubItem({
        name: '',
        price: '',
        description: '',
        image: ''
      });
    }
  };

  const removeSubItem = (index) => {
    setFormData(prev => ({
      ...prev,
      subItems: prev.subItems.filter((_, i) => i !== index)
    }));
  };

  const updateSubItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subItems: prev.subItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Related products management functions
  const removeRelatedProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter(id => id !== productId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: String(formData.price).trim(), // backend expects string
        stock: Number(formData.stock),
        category: formData.category || 'Watch',
        colors: formData.colors
          .filter(c => c.id && c.alt && c.thumb) // remove incomplete ones
          .map(c => ({
            id: c.id.trim(),
            alt: c.alt.trim(),
            thumb: c.thumb.trim(),
            gallery: Array.isArray(c.gallery)
              ? c.gallery.filter(Boolean)
              : []
          })),
        stats: formData.stats
          .filter(s => s.label && s.value)
          .map(s => ({
            label: s.label.trim(),
            value: s.value.trim()
          })),
        subItems: formData.subItems
          .filter(s => s.name && s.price)
          .map(s => ({
            name: s.name.trim(),
            price: String(s.price).trim(),
            description: s.description?.trim() || '',
            image: s.image?.trim() || ''
          })),
        relatedProducts: formData.relatedProducts || []
      };


      if (isEditMode && editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        alert('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        alert('Product added successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      console.log('Final payload before error:', error);

      // show validation errors from backend
      if (error.response?.data?.errors) {
        console.table(error.response.data.errors);
        alert('Validation failed. Please check your form fields.');
      } else {
        alert('Unexpected error. Please try again.');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070B13] via-[#0A0E18] to-[#0D1117] p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-white/70 hover:text-white transition mr-4"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-white">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition resize-none"
                  placeholder="Product description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                    placeholder="Product SKU"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                  >
                    <option value="Watch" className="bg-[#070B13]">Watch</option>
                    <option value="Electronics" className="bg-[#070B13]">Electronics</option>
                    <option value="Accessories" className="bg-[#070B13]">Accessories</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-Items Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Sub-Items Management
              </h2>
              
              {/* Existing Sub-Items */}
              {formData.subItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white/90">Current Sub-Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.subItems.map((subItem, index) => (
                      <div key={subItem.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-medium">{subItem.name}</h4>
                          <button
                            type="button"
                            onClick={() => removeSubItem(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={subItem.name}
                            onChange={(e) => updateSubItem(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                            placeholder="Sub-item name"
                          />
                          <input
                            type="text"
                            value={subItem.price}
                            onChange={(e) => updateSubItem(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                            placeholder="Price"
                          />
                          <textarea
                            value={subItem.description}
                            onChange={(e) => updateSubItem(index, 'description', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm resize-none"
                            placeholder="Description"
                          />
                          <input
                            type="text"
                            value={subItem.image}
                            onChange={(e) => updateSubItem(index, 'image', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                            placeholder="Image URL"
                          />
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <span className="text-[#5695F5] font-semibold text-lg">{subItem.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Sub-Item Form */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FiPlus className="w-5 h-5 mr-2" />
                  Add New Sub-Item
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Sub-Item Name</label>
                    <input
                      type="text"
                      value={newSubItem.name}
                      onChange={(e) => setNewSubItem({...newSubItem, name: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="e.g., Watch Band, Charger"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Price</label>
                    <input
                      type="text"
                      value={newSubItem.price}
                      onChange={(e) => setNewSubItem({...newSubItem, price: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="$0.00"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newSubItem.description}
                    onChange={(e) => setNewSubItem({...newSubItem, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition resize-none"
                    placeholder="Sub-item description"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newSubItem.image}
                    onChange={(e) => setNewSubItem({...newSubItem, image: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="/sub-item-image.jpg"
                  />
                </div>

                <button
                  type="button"
                  onClick={addSubItem}
                  className="w-full px-4 py-2 bg-[#5695F5] hover:bg-blue-600 text-white rounded-lg transition font-medium"
                >
                  Add Sub-Item
                </button>
              </div>
            </div>

            {/* Sizes Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Available Sizes
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.sizes.map((size, index) => (
                  <span key={index} className="flex items-center bg-[#5695F5]/20 text-[#5695F5] px-3 py-1 rounded-full text-sm">
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="e.g., 42 MM, 47 MM"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-[#5695F5] hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Add Size
                </button>
              </div>
            </div>

            {/* Editions Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Product Editions
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.editions.map((edition, index) => (
                  <span key={index} className="flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {edition}
                    <button
                      type="button"
                      onClick={() => removeEdition(index)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEdition}
                  onChange={(e) => setNewEdition(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="e.g., Pro Solar, Pro Solar No Wifi"
                />
                <button
                  type="button"
                  onClick={addEdition}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  Add Edition
                </button>
              </div>
            </div>

            {/* Colors Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Product Colors
              </h2>
              
              {/* Existing Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {formData.colors.map((color, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{color.alt}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <img src={color.thumb} alt={color.alt} className="w-full h-20 object-cover rounded" />
                    <p className="text-white/60 text-xs mt-1">ID: {color.id}</p>
                  </div>
                ))}
              </div>

              {/* Add New Color Form */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3">Add New Color</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Color ID</label>
                    <input
                      type="text"
                      value={newColor.id}
                      onChange={(e) => setNewColor({...newColor, id: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="e.g., silver, black"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Color Name</label>
                    <input
                      type="text"
                      value={newColor.alt}
                      onChange={(e) => setNewColor({...newColor, alt: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="e.g., Silver, Black"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={newColor.thumb}
                    onChange={(e) => setNewColor({...newColor, thumb: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="/watch-1.png"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Gallery Images</label>
                  {newColor.gallery.map((img, imgIndex) => (
                    <div key={imgIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => updateGalleryImage(imgIndex, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                        placeholder="/watch-1.png"
                      />
                      {newColor.gallery.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(imgIndex)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-3 py-1 bg-white/10 text-white/70 rounded text-sm hover:bg-white/20 transition"
                  >
                    + Add Gallery Image
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addColor}
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition"
                >
                  Add Color
                </button>
              </div>
            </div>

            {/* Stats Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Product Statistics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{stat.label}</span>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[#5695F5] text-xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3">Add New Statistic</h4>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newStat.label}
                    onChange={(e) => setNewStat({...newStat, label: e.target.value})}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="Statistic Label (e.g., Product Sale)"
                  />
                  <input
                    type="text"
                    value={newStat.value}
                    onChange={(e) => setNewStat({...newStat, value: e.target.value})}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                    placeholder="Value (e.g., 20K +)"
                  />
                  <button
                    type="button"
                    onClick={addStat}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                  >
                    Add Stat
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Related Products
              </h2>
              
              {/* Selected Related Products */}
              {formData.relatedProducts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white/90">Selected Related Products</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.relatedProducts.map((productId) => {
                      const product = availableProducts.find(p => p._id === productId);
                      return product ? (
                        <span key={productId} className="flex items-center bg-[#5695F5]/20 text-[#5695F5] px-3 py-1 rounded-full text-sm">
                          {product.name}
                          <button
                            type="button"
                            onClick={() => removeRelatedProduct(productId)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Product Selection Dropdown */}
              <div className="space-y-4">
                <label className="block text-white/80 text-sm font-medium">
                  Select Related Products
                </label>
                
                {isLoadingProducts ? (
                  <div className="flex items-center space-x-2 text-white/70">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#5695F5]"></div>
                    <span>Loading products...</span>
                  </div>
                ) : availableProducts.length === 0 ? (
                  <p className="text-white/70">No other products available</p>
                ) : (
                  <select
                    multiple
                    value={formData.relatedProducts}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setFormData(prev => ({
                        ...prev,
                        relatedProducts: selectedOptions
                      }));
                    }}
                    className="w-full px-4 py-3 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition min-h-[220px]"
                  >
                    {availableProducts.map((product) => (
                        <option 
                          key={product._id} 
                          value={product._id}
                          className="b py-1"
                        >
                          {product.name} - ${product.price} (SKU: {product.sku})
                        </option>
                      ))}
                  </select>
                )}
                
                <p className="text-white/60 text-xs">
                  Hold Ctrl (Cmd on Mac) to select multiple products. Selected products will appear as tags above.
                </p>
              </div>
            </div>

            {/* Video Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Video Information
              </h2>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={formData.videoTitle}
                  onChange={(e) => setFormData({...formData, videoTitle: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                  placeholder="Experience True Elegance With Modern Craftsmanship"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Video Thumbnail URL
                </label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                  placeholder="/watch-video.jpg"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition"
                >
                  <option value="Active" className="bg-[#070B13]">Active</option>
                  <option value="Inactive" className="bg-[#070B13]">Inactive</option>
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-white/20">
              <button
                type="submit"
                className="flex-1 bg-[#5695F5] hover:bg-blue-600 text-white py-4 px-6 rounded-lg transition font-semibold text-lg"
              >
                {isEditMode ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-lg transition font-semibold text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;