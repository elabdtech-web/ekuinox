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
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
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
        body: JSON.stringify({ name: cityName }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to add cities.');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
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
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to delete cities.');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting city:', error);
      throw error;
    }
  }

  async refreshCity(cityId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/${cityId}/refresh`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to refresh cities.');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error refreshing city:', error);
      throw error;
    }
  }
}

export default new CityService();
