import React, { createContext, useContext, useEffect, useState } from "react";
import cityService from "../services/cityService";
import { useAuth } from "./AuthContext";

const CityCartContext = createContext(undefined);

export const useCityCart = () => {
  const context = useContext(CityCartContext);
  if (!context) {
    throw new Error("useCityCart must be used within CityCartProvider");
  }
  return context;
};

export function CityCartProvider({ children }) {
  const [savedCities, setSavedCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cities from backend on mount or when user changes
  useEffect(() => {
    let cancelled = false;
    
    const loadCities = async () => {
      // Check if user is available and has an ID
      if (!user || (!user.id && !user._id)) {
        console.log('User not available or no user ID found, clearing cities');
        setSavedCities([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Load from backend only
        const userId = user.id || user._id;
        console.log('Loading cities for user ID:', userId);
        const cities = await cityService.fetchCities(userId);
        if (!cancelled && Array.isArray(cities)) {
          console.log('Loaded cities for user:', userId, 'Count:', cities.length);
          setSavedCities(cities);
        }
      } catch (error) {
        console.error("Failed to load cities from API:", error);
        // Do not fall back to dummy data, keep empty
        if (!cancelled) {
          setSavedCities([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Clear cities first when user changes, then load new user's cities
    const currentUserId = user?.id || user?._id;
    console.log('CityCartContext: User changed or component mounted. User ID:', currentUserId);
    setSavedCities([]); // Clear previous user's cities immediately
    loadCities();
    
    return () => {
      cancelled = true;
    };
  }, [user]); // Only depend on user, not savedCities.length

  const addCity = async (city) => {
    if (!city || !city.name) {
      console.error("Invalid city data:", city);
      return;
    }

    // Check if already exists locally (using _id from your backend)
    const exists = city._id || city.id 
      ? savedCities.some((c) => c._id === (city._id || city.id) || c.id === (city._id || city.id)) 
      : savedCities.some((c) => c.name === city.name);
    
    if (exists) {
      console.log("City already exists:", city.name);
      return;
    }

    if (savedCities.length >= 50) {
      console.warn("Maximum cities limit reached");
      return;
    }

    try {
      // Create via API
      console.log('Creating city via API:', city.name);
      const createdCity = await cityService.createCity(city.name);
      console.log('City created successfully:', createdCity);
      
      // Add to local state with computed display data
      const cityWithDisplay = {
        ...createdCity,
        ...city, // Include flag, time, timezone, etc. from frontend computation
        addedAt: new Date().toISOString()
      };
      
      setSavedCities(prev => {
        const newCities = [...prev, cityWithDisplay];
        console.log('Updated cities in context. Before:', prev.length, 'After:', newCities.length);
        return newCities;
      });
    } catch (error) {
      console.error("Failed to create city via API, adding locally:", error);
      // Fallback: add to local state only
      setSavedCities(prev => [...prev, { ...city, addedAt: new Date().toISOString() }]);
    }
  };

  // Remove by id (preferred) or by name
  const removeCity = async (cityIdOrName) => {
    try {
      // Find the city to get its ID (using _id from your backend)
      const cityToRemove = savedCities.find(c => 
        (typeof cityIdOrName === "string" && (c._id === cityIdOrName || c.id === cityIdOrName)) ||
        (typeof cityIdOrName === "string" && c.name === cityIdOrName)
      );

      console.log('Removing city:', cityIdOrName, 'Found city:', cityToRemove);

      if (cityToRemove && (cityToRemove._id || cityToRemove.id)) {
        await cityService.deleteCity(cityToRemove._id || cityToRemove.id);
        console.log('City deleted from API successfully');
      }
    } catch (error) {
      console.error("Failed to delete city via API:", error);
      // Continue with local removal even if API fails
    }

    // Remove from local state (using _id from your backend) - always execute this
    setSavedCities((prev) => {
      const newCities = prev.filter((c) => {
        if (typeof cityIdOrName === "string") {
          return c._id !== cityIdOrName && c.id !== cityIdOrName && c.name !== cityIdOrName;
        }
        return true;
      });
      console.log('Updated cities in state. Before:', prev.length, 'After:', newCities.length);
      return newCities;
    });
  };

  const refreshCity = async (cityId) => {
    try {
      const refreshedCity = await cityService.refreshCity(cityId);
      setSavedCities(prev => 
        prev.map(city => 
          (city._id === cityId || city.id === cityId) ? { ...city, ...refreshedCity } : city
        )
      );
    } catch (error) {
      console.error("Failed to refresh city:", error);
    }
  };

  const clearCities = () => {
    setSavedCities([]);
  };

  const value = {
    savedCities,
    addCity,
    removeCity,
    refreshCity,
    clearCities,
    isLoading: isLoading,
  };

  return (
    <CityCartContext.Provider value={value}>
      {children}
    </CityCartContext.Provider>
  );
}



