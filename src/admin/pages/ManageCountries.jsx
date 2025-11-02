import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGlobe } from 'react-icons/fi';

const ManageCountries = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [formData, setFormData] = useState({
    CountryName: '',
    RegionId: 1
  });

  // Demo data - replace with actual API calls
  const demoCountries = [
    { Id: 1, CountryName: "Afghanistan", RegionId: 2, Resources: [] },
    { Id: 2, CountryName: "Algeria", RegionId: 1, Resources: [] },
    { Id: 3, CountryName: "Angola", RegionId: 1, Resources: [] },
    { Id: 4, CountryName: "Antigua And Barbuda", RegionId: 3, Resources: [] },
    { Id: 5, CountryName: "Armenia", RegionId: 2, Resources: [] },
    { Id: 6, CountryName: "Aruba", RegionId: 3, Resources: [] },
    { Id: 8, CountryName: "Austria", RegionId: 4, Resources: [] },
  ];

  const regions = [
    { id: 1, name: 'Africa' },
    { id: 2, name: 'Asia' },
    { id: 3, name: 'Americas' },
    { id: 4, name: 'Europe' },
    { id: 5, name: 'Oceania' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCountries(demoCountries);
      setFilteredCountries(demoCountries);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.CountryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCountry = () => {
    setFormData({ CountryName: '', RegionId: 1 });
    setEditingCountry(null);
    setShowAddModal(true);
  };

  const handleEditCountry = (country) => {
    setFormData({
      CountryName: country.CountryName,
      RegionId: country.RegionId
    });
    setEditingCountry(country);
    setShowAddModal(true);
  };

  const handleDeleteCountry = (countryId) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      setCountries(prev => prev.filter(c => c.Id !== countryId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCountry) {
      // Update existing country
      setCountries(prev => prev.map(c => 
        c.Id === editingCountry.Id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      // Add new country
      const newCountry = {
        Id: Date.now(),
        ...formData,
        Resources: []
      };
      setCountries(prev => [...prev, newCountry]);
    }
    
    setShowAddModal(false);
    setFormData({ CountryName: '', RegionId: 1 });
    setEditingCountry(null);
  };

  const getRegionName = (regionId) => {
    const region = regions.find(r => r.id === regionId);
    return region ? region.name : 'Unknown';
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
            <h1 className="text-3xl font-bold text-white">Manage Countries</h1>
            <p className="text-white/60 mt-2">Add, edit, and manage countries in the system</p>
          </div>
          <button
            onClick={handleAddCountry}
            className="bg-[#5695F5] hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Country</span>
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
              placeholder="Search countries..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">
              Total: {filteredCountries.length} countries
            </span>
          </div>
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-4 px-6 text-white font-semibold">ID</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Country Name</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Region</th>
                <th className="text-left py-4 px-6 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country) => (
                <tr key={country.Id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-4 px-6 text-white/80">{country.Id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <FiGlobe className="w-4 h-4 text-[#5695F5]" />
                      <span className="text-white">{country.CountryName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/80">{getRegionName(country.RegionId)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditCountry(country)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCountry(country.Id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#070B13] rounded-xl p-6 w-full max-w-md border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingCountry ? 'Edit Country' : 'Add New Country'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Country Name
                </label>
                <input
                  type="text"
                  value={formData.CountryName}
                  onChange={(e) => setFormData({...formData, CountryName: e.target.value})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  placeholder="Enter country name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Region
                </label>
                <select
                  value={formData.RegionId}
                  onChange={(e) => setFormData({...formData, RegionId: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-[#5695F5] focus:ring-1 focus:ring-[#5695F5] transition"
                  required
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id} className="bg-[#070B13]">
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#5695F5] hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                >
                  {editingCountry ? 'Update' : 'Add'} Country
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

export default ManageCountries;