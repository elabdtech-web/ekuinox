const API_BASE_URL = 'http://localhost:5000/api';

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

  async fetchCities() {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to view your cities.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch cities`);
      }
      
      const cities = await response.json();
      console.log('Fetched cities:', cities);
      return Array.isArray(cities) ? cities : [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async createCity(cityName) {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`, {
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
    try {
      const response = await fetch(`${API_BASE_URL}/cities/${cityId}`, {
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
      const response = await fetch(`${API_BASE_URL}/cities/${cityId}`, {
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