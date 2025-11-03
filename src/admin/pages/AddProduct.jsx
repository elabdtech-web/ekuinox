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
    relatedProducts: [], // New field for related products
    images: [], // New field for product images
    features: [] // New field for product features
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


  // Related products states
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Images and features states
  const [newImage, setNewImage] = useState({
    url: '',
    alt: '',
    isMain: false
  });
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    icon: '',
    image: ''
  });

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
        relatedProducts: editingProduct.relatedProducts || [],
        images: editingProduct.images || [],
        features: editingProduct.features || []
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
        // Show all products in the dropdown - API returns data array
        setAvailableProducts(response.data || response.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAvailableProducts([]);
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



  // Related products management functions
  const removeRelatedProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter(id => id !== productId)
    }));
  };

  // Images management functions
  const addImage = () => {
    if (newImage.url && newImage.alt) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { ...newImage, id: Date.now() }]
      }));
      setNewImage({
        url: '',
        alt: '',
        isMain: false
      });
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((image, i) =>
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  // Features management functions
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
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      )
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
        relatedProducts: formData.relatedProducts || [],
        images: formData.images
          .filter(img => img.url && img.alt)
          .map(img => ({
            url: img.url.trim(),
            alt: img.alt.trim(),
            isMain: Boolean(img.isMain)
          })),
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
                    <div className="text-center py-8">
                      <p className="text-white/70 mb-2">No products available</p>
                      <p className="text-white/50 text-sm">Create some products first to select related products</p>
                    </div>
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-2 focus:ring-[#5695F5]/20 transition min-h-[220px]"
                        size={Math.min(availableProducts.length, 8)} // Show up to 8 items at once
                  >
                    {availableProducts.map((product) => (
                        <option 
                        key={product._id || product.id}
                        value={product._id || product.id}
                        className="bg-[#070B13] py-2 px-3 hover:bg-[#5695F5]/10"
                        >
                        {product.name || 'Unnamed Product'} - ${product.price || '0'} (SKU: {product.sku || 'N/A'})
                        </option>
                      ))}
                  </select>
                )}
                
                <p className="text-white/60 text-xs">
                  Hold Ctrl (Cmd on Mac) to select multiple products. Selected products will appear as tags above.
                </p>
              </div>
            </div>

            {/* Images Management */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-white/20 pb-3">
                Product Images
              </h2>

              {/* Existing Images */}
              {formData.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white/90">Current Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={image.id || index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-medium text-sm">{image.alt}</h4>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <img src={image.url} alt={image.alt} className="w-full h-24 object-cover rounded mb-3" />

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => updateImage(index, 'url', e.target.value)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-xs"
                            placeholder="Image URL"
                          />
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => updateImage(index, 'alt', e.target.value)}
                            className="w-full px-2 py-1 bg-white/10 border border-white/30 rounded text-white placeholder-white/50 text-xs"
                            placeholder="Alt text"
                          />
                          <label className="flex items-center text-white/70 text-xs">
                            <input
                              type="checkbox"
                              checked={image.isMain}
                              onChange={(e) => updateImage(index, 'isMain', e.target.checked)}
                              className="mr-2"
                            />
                            Main image
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Image Form */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <FiPlus className="w-5 h-5 mr-2" />
                  Add New Image
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      value={newImage.url}
                      onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Alt Text</label>
                    <input
                      type="text"
                      value={newImage.alt}
                      onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                      placeholder="Image description"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center text-white/80 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={newImage.isMain}
                      onChange={(e) => setNewImage({ ...newImage, isMain: e.target.checked })}
                      className="mr-2"
                    />
                    Set as main image
                  </label>
                </div>

                <button
                  type="button"
                  onClick={addImage}
                  className="w-full px-4 py-2 bg-[#5695F5] hover:bg-blue-600 text-white rounded-lg transition font-medium"
                >
                  Add Image
                </button>
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