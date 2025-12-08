import { CITY_ENDPOINTS } from '../config/api.js';

class CityService {
  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getAllCities() {
    try {
      console.log('Fetching all cities from API');
      console.log('Using CITY_ENDPOINTS.GET_ALL:', CITY_ENDPOINTS.GET_ALL);
      const response = await fetch(CITY_ENDPOINTS.GET_ALL, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Get all cities response status:', response.status);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to view cities.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch cities`);
      }

      const cities = await response.json();
      console.log('Fetched all cities:-----', cities);
      return Array.isArray(cities) ? cities : [];
    } catch (error) {
      console.error('Error fetching all cities:', error);
      throw error;
    } 
   }

  async fetchCities(userId ) {
    try {
      console.log('Fetching cities for userId:000', userId);
      const url = `${CITY_ENDPOINTS.GET_BY_USER}?userId=${userId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Fetch cities response status:', response);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to view your cities.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch cities`);
      }
      
      const payload = await response.json();
      // If using user endpoint, payload has { success, count, data }
      // If general endpoint, payload is array
      const cities = userId ? (Array.isArray(payload.data) ? payload.data : []) : (Array.isArray(payload) ? payload : []);
      console.log('Fetched cities:', cities);
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async createCity(cityName) {
    try {
      const response = await fetch(CITY_ENDPOINTS.CREATE, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ name: cityName.trim() }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to add cities.');
        } else if (response.status === 409) {
          throw new Error(`City "${cityName}" already exists in your collection.`);
        } else if (response.status === 400) {
          const message = errorData.error || 'Invalid city name or data.';
          throw new Error(message);
        } else {
          throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to create city'}`);
        }
      }
      
      const result = await response.json();
      console.log('City created successfully:', result);
      
      // Return the city data (handle both direct response and wrapped response)
      return result.data || result;
    } catch (error) {
      console.error('Error creating city:', error);
      throw error;
    }
  }

  async deleteCity(cityId) {
    console.log('Deleting city with ID:', cityId);
    try {
      const response = await fetch(`${CITY_ENDPOINTS.DELETE}?id=${cityId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to delete cities.');
        } else if (response.status === 404) {
          throw new Error('City not found or you don\'t have permission to delete it.');
        } else {
          throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to delete city'}`);
        }
      }
      
      const result = await response.json();
      console.log('City deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }



  async getCity(cityId) {
    try {
      const response = await fetch(`${CITY_ENDPOINTS.GET_BY_ID}?id=${cityId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to view city details.');
        } else if (response.status === 404) {
          throw new Error('City not found or you don\'t have permission to view it.');
        } else {
          throw new Error(`HTTP ${response.status}: ${errorData.error || 'Failed to fetch city'}`);
        }
      }
      
      const city = await response.json();
      console.log('Fetched city:', city);
      return city;
    } catch (error) {
      console.error('Error fetching city:', error);
      throw error;
    }
  }
}

export default new CityService();