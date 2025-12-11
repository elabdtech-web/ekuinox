import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiMap } from 'react-icons/fi';
import { toast } from 'react-toastify';
import cityService from '../../services/cityService';

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: ''
  });

  // Demo data - replace with actual API calls
  const demoCities = useMemo(() => [
    { label: "Algiers", value: "1" },
    { label: "Annaba", value: "2" },
    { label: "Batna", value: "3" },
    { label: "Biskra", value: "4" },
    { label: "Blida", value: "5" },
    { label: "Constantine", value: "6" },
    { label: "Djelfa", value: "7" },
    { label: "El Oued", value: "8" },
    { label: "Ghardaia", value: "9" },
    { label: "Jijel", value: "10" }
  ], []);

  const loadCities = useCallback(async () => {
    try {
      setLoading(true);
      // Call with all=true to get all cities for admin view
      const response = await cityService.getAllCities(true);
      console.log('Load cities response:', response);
      
      // The response should be an array of cities
      const citiesData = Array.isArray(response) ? response : [];

      // Transform API data to match component format if needed
      const formattedCities = citiesData.map((city, index) => ({
        id: city._id || city.id || index,
        label: city.name || city.label || city.city,
        value: city._id || city.id || city.value || index.toString(),
        country: city.country || 'Unknown',
        createdAt: city.createdAt || new Date().toISOString(),
        userId: city.userId || 'System'
      }));

      setCities(formattedCities);
      setFilteredCities(formattedCities);
    } catch (error) {
      console.error('Error loading cities:', error);
      toast.error('Failed to load cities. Please try again.');
      // Fallback to demo data
      setCities(demoCities);
      setFilteredCities(demoCities);
    } finally {
      setLoading(false);
    }
  }, [demoCities]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  useEffect(() => {
    const filtered = cities.filter(city =>
      city.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCity = () => {
    setFormData({ label: '', value: '' });
    setEditingCity(null);
    setShowAddModal(true);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCity) {
      // Update existing city
        await cityService.updateCity(editingCity.value, {
          label: formData.label,
          value: formData.value || editingCity.value
        });
        toast.success('City updated successfully!');
      } else {
        // Add new city
        await cityService.addCity({
          label: formData.label,
          value: formData.value
        });
        toast.success('City added successfully!');
      }

      // Reload cities from API
      await loadCities();
      setShowAddModal(false);
      setFormData({ label: '', value: '' });
      setEditingCity(null);
    } catch (error) {
      console.error('Error saving city:', error);
      toast.error('Failed to save city. Please try again.');
    }
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
            <h1 className="text-3xl font-bold text-white">Manage Cities</h1>
            <p className="text-white/60 mt-2">Add, edit, and manage cities in the system</p>
          </div>
          <button
            onClick={handleAddCity}
            className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add City</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">
              Total: {filteredCities.length} cities
            </span>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCities.map((city) => (
          <div key={city.value} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#5695F5]/20 rounded-lg flex items-center justify-center">
                  <FiMap className="w-5 h-5 text-[#5695F5]" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{city.label}</h3>
                  <p className="text-white/60 text-sm">Country: {city.country}</p>
                </div>
              </div>
              {/* <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditCity(city)}
                  className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCity(city)}
                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <FiMap className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No cities found</h3>
          <p className="text-white/60 mb-4">
            {searchTerm ? 'No cities match your search criteria.' : 'No cities have been added yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddCity}
              className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Your First City
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#070B13] rounded-xl p-6 w-full max-w-md border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingCity ? 'Edit City' : 'Add New City'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  City Name
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="Enter city name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  City ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="Auto-generated if empty"
                />
                <p className="text-white/60 text-xs mt-1">
                  Leave empty to auto-generate an ID
                </p>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#5695F5] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                >
                  {editingCity ? 'Update' : 'Add'} City
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCities;