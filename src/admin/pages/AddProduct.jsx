import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiPlus } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { toast } from 'react-toastify';

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
    features: [] // New field for product features
  });

  // Dynamic field states
  const [newSize, setNewSize] = useState('');
  const [newEdition, setNewEdition] = useState('');
  const [newColor, setNewColor] = useState({
    id: '',
    alt: '',
    thumb: '',
    gallery: [''],
  });
  const [newStat, setNewStat] = useState({
    label: '',
    value: ''
  });




  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        features: editingProduct.features || []
      });
    }
  }, [isEditMode, editingProduct]);


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
    if (newColor.thumb && newColor.alt) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, {
          ...newColor,
          id: `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gallery: newColor.gallery.filter(g => g.trim())
        }]
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



  // Features management functions
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    icon: '',
    image: ''
  });

  const addFeature = () => {
    if (newFeature.title && newFeature.description) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature, id: Date.now() }]
      }));
      setNewFeature({
        title: '',
        description: '',
        icon: '',
        image: ''
      });
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? { ...f, [field]: value } : f)
    }));
  };

  // Form validation functions
  const validateForm = () => {
    const errors = {};

    // Basic Information Validation
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      errors.price = 'Please enter a valid price';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.sku.trim()) {
      errors.sku = 'SKU is required';
    } else if (!/^[A-Z0-9-_]+$/i.test(formData.sku)) {
      errors.sku = 'SKU can only contain letters, numbers, hyphens, and underscores';
    }

    if (formData.stock === '' || formData.stock < 0) {
      errors.stock = 'Stock quantity must be 0 or greater';
    }

    // Sizes validation - at least one size required
    if (formData.sizes.length === 0) {
      errors.sizes = 'At least one size is required';
    }

    // Colors validation - at least one color required
    if (formData.colors.length === 0) {
      errors.colors = 'At least one color is required';
    } else {
      // Validate each color
      formData.colors.forEach((color, index) => {
        if (!color.alt.trim()) {
          errors[`color_${index}_alt`] = `Color name is required for color ${index + 1}`;
        }
        if (!color.thumb.trim()) {
          errors[`color_${index}_thumb`] = `Thumbnail image is required for color ${index + 1}`;
        } else if (!isValidUrl(color.thumb)) {
          errors[`color_${index}_thumb`] = `Please enter a valid URL for thumbnail image`;
        }
      });
    }

    // Stats validation - if any stat is partially filled, require both fields
    formData.stats.forEach((stat, index) => {
      if (stat.label.trim() && !stat.value.trim()) {
        errors[`stat_${index}_value`] = `Value is required for statistic "${stat.label}"`;
      }
      if (!stat.label.trim() && stat.value.trim()) {
        errors[`stat_${index}_label`] = `Label is required for statistic with value "${stat.value}"`;
      }
    });

    // Features validation - if any feature is partially filled, require title and description
    formData.features.forEach((feature, index) => {
      if (feature.title.trim() && !feature.description.trim()) {
        errors[`feature_${index}_description`] = `Description is required for feature "${feature.title}"`;
      }
      if (!feature.title.trim() && feature.description.trim()) {
        errors[`feature_${index}_title`] = `Title is required for feature with description`;
      }
      if (feature.image && feature.image.trim() && !isValidUrl(feature.image)) {
        errors[`feature_${index}_image`] = `Please enter a valid URL for feature image`;
      }
    });

    // Video validation - if video title provided, URL should be valid
    if (formData.videoTitle.trim() && formData.videoUrl.trim() && !isValidUrl(formData.videoUrl)) {
      errors.videoUrl = 'Please enter a valid video URL';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: String(formData.price).trim(), // backend expects string
        stock: Number(formData.stock),
        category: formData.category || 'Watch',
        colors: formData.colors
          .filter(c => c.alt && c.thumb) // remove incomplete ones
          .map(c => ({
            id: c.id.trim(),
            alt: c.alt.trim(),
            thumb: c.thumb.trim(),
            hexColor: c.hexColor || '#000000', // Include hex color
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
        relatedProducts: formData.relatedProducts || [],
        features: formData.features
          .filter(f => f.title && f.description)
          .map(f => ({
            title: f.title.trim(),
            description: f.description.trim(),
            icon: f.icon?.trim() || '',
            image: f.image?.trim() || ''
          }))
      };


      if (isEditMode && editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast.success('Product added successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);

      // try to extract server validation info
      const serverMsg = error?.response?.data?.message || error?.message || '';
      const serverErrors = error?.response?.data?.errors || null;

      // Prepare a new errors object merging with existing validationErrors
      const newErrors = { ...validationErrors };

      // If backend returned structured errors (map), copy them
      if (serverErrors && typeof serverErrors === 'object' && Object.keys(serverErrors).length) {
        for (const key of Object.keys(serverErrors)) {
          // serverErrors[key] could be string or object { msg }
          newErrors[key] = serverErrors[key].msg || serverErrors[key] || String(serverErrors[key]);
        }
      }

      // Detect duplicate key / unique constraint errors and map to SKU
      if (/duplicate/i.test(serverMsg) || /E11000/i.test(serverMsg) || /Duplicate field value/i.test(serverMsg)) {
        newErrors.sku = newErrors.sku || 'SKU already exists. Please choose a unique SKU.';
      }

      // If we have any validation errors from server/local, show them inline
      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        // scroll to first error field
        const firstKey = Object.keys(newErrors)[0];
        const el = document.getElementById(firstKey);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // fallback toast for unexpected errors
        toast.error('Unexpected error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
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
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      clearFieldError('name');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${validationErrors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="Enter product name"
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Price *
                  </label>
                  <input
                    id="price"
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      clearFieldError('price');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${validationErrors.price
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="$0.00"
                  />
                  {validationErrors.price && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    clearFieldError('description');
                  }}
                  rows="4"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition resize-none ${validationErrors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                    }`}
                  placeholder="Product description"
                />
                {validationErrors.description && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    SKU *
                  </label>
                  <input
                    id="sku"
                    type="text"
                    value={formData.sku}
                    onChange={(e) => {
                      setFormData({ ...formData, sku: e.target.value });
                      clearFieldError('sku');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${validationErrors.sku
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="Product SKU"
                  />
                  {validationErrors.sku && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.sku}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => {
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 });
                      clearFieldError('stock');
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${validationErrors.stock
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                      }`}
                    placeholder="0"
                    min="0"
                  />
                  {validationErrors.stock && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.stock}</p>
                  )}
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

            {/* Sizes Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Available Sizes *
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

              {validationErrors.sizes && (
                <p className="text-red-400 text-sm mb-4">{validationErrors.sizes}</p>
              )}

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
                Product Colors *
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
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded border border-white/30"
                        style={{ backgroundColor: color.hexColor || '#000000' }}
                      ></div>
                      <span className="text-white/60 text-xs font-mono">{color.hexColor || '#000000'}</span>
                    </div>
                    <img src={color.thumb} alt={color.alt} className="w-full h-20 object-cover rounded" />
                  </div>
                ))}
              </div>

              {validationErrors.colors && (
                <p className="text-red-400 text-sm mb-4">{validationErrors.colors}</p>
              )}

              {/* Add New Color Form */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3">Add New Color</h4>

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



            {/* Features Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Product Features
              </h2>

              {/* Existing Features */}
              {formData.features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white/90">Current Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.features.map((feature, index) => (
                      <div key={feature.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-medium">{feature.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateFeature(index, 'title', e.target.value)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                            placeholder="Feature title"
                          />
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            rows="2"
                            className="w-full px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm resize-none"
                            placeholder="Feature description"
                          />
                          <input
                            type="text"
                            value={feature.image}
                            onChange={(e) => updateFeature(index, 'image', e.target.value)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-sm"
                            placeholder="Feature image URL"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Feature Form */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FiPlus className="w-5 h-5 mr-2" />
                  Add New Feature
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Feature Title</label>
                    <input
                      type="text"
                      value={newFeature.title}
                      onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="e.g., Health Monitoring"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-white/80 text-sm font-medium mb-2">Feature Image URL (Optional)</label>
                    <input
                      type="text"
                      value={newFeature.image}
                      onChange={(e) => setNewFeature({ ...newFeature, image: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="/feature-image.jpg"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition resize-none"
                    placeholder="Describe the feature"
                  />
                </div>


                <button
                  type="button"
                  onClick={addFeature}
                  className="w-full px-4 py-2 bg-[#5695F5] hover:bg-blue-600 text-white rounded-lg transition font-medium"
                >
                  Add Feature
                </button>
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
                  id="videoUrl"
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, videoUrl: e.target.value });
                    clearFieldError('videoUrl');
                  }}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition ${validationErrors.videoUrl
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-white/30 focus:border-[#5695F5] focus:ring-[#5695F5]/20'
                    }`}
                  placeholder="/watch-video.jpg"
                />
                {validationErrors.videoUrl && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.videoUrl}</p>
                )}
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
                disabled={isSubmitting}
                className={`flex-1 py-4 px-6 rounded-lg transition font-semibold text-lg ${isSubmitting
                    ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                    : 'bg-[#5695F5] hover:bg-blue-600 text-white'
                  }`}
              >
                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                disabled={isSubmitting}
                className={`flex-1 py-4 px-6 rounded-lg transition font-semibold text-lg ${isSubmitting
                    ? 'bg-gray-500/20 cursor-not-allowed text-gray-400'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
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