import axiosInstance from '../config/axiosInstance';

class CityService {
  // Fetch all cities. Pass `all = true` to request admin list (uses ?all=true)
  async getAllCities(all = false) {
    try {
      console.log('Fetching all cities from API', { all });
      const url = all ? '/city/getCities?all=true' : '/city/getCities';
      const response = await axiosInstance.get(url);

      console.log('Get all cities response status:', response.status);
      console.log('Fetched all cities:-----', response.data);

      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching all cities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch cities');
    }
  }

  async fetchCities(userId) {
    try {
      console.log('Fetching cities for userId:000', userId);
      const response = await axiosInstance.get(`/city/getCitiesByUserId?userId=${userId}`);
      
      console.log('Fetch cities response status:', response.status);
      
      // If using user endpoint, payload has { success, count, data }
      // If general endpoint, payload is array
      const cities = userId ? (Array.isArray(response.data.data) ? response.data.data : []) : (Array.isArray(response.data) ? response.data : []);
      console.log('Fetched cities:', cities);
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user cities');
    }
  }

  async createCity(cityName) {
    try {
      console.log('🔥 Creating city with name:', cityName);
      console.log('🔥 Token in localStorage BEFORE request:', localStorage.getItem('token'));
      console.log('🔥 Using axiosInstance for city creation');
      
      const response = await axiosInstance.post('/city/createCity', { name: cityName.trim() });
      
      console.log('✅ City created successfully:', response.data);
      
      // Return the city data (handle both direct response and wrapped response)
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Error creating city:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      console.error('❌ Token in localStorage AFTER error:', localStorage.getItem('token'));
      
      if (error.response?.status === 409) {
        throw new Error(`City "${cityName}" already exists in your collection.`);
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.error || 'Invalid city name or data.';
        throw new Error(message);
      } else if (error.response?.status === 401) {
        throw new Error('Not authorized - token missing or invalid. Please login again.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to create city');
      }
    }
  }

  async deleteCity(cityId) {
    console.log('Deleting city with ID:', cityId);
    try {
      const response = await axiosInstance.delete(`/city/deleteCity?id=${cityId}`);
      
      console.log('City deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting city:', error);
      
      if (error.response?.status === 404) {
        throw new Error('City not found or you don\'t have permission to delete it.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to delete city');
      }
    }
  }



  async getCity(cityId) {
    try {
      const response = await axiosInstance.get(`/city/getCity?id=${cityId}`);
      
      console.log('Fetched city:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching city:', error);
      
      if (error.response?.status === 404) {
        throw new Error('City not found or you don\'t have permission to view it.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to fetch city');
      }
    }
  }
}

export default new CityService();