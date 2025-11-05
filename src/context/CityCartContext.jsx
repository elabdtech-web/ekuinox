import React, { createContext, useContext, useEffect, useState } from "react";
import cityService from "../services/cityService";

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

  // Load cities from backend on mount, fall back to local JSON
  useEffect(() => {
    let cancelled = false;
    
    const loadCities = async () => {
      if (savedCities.length > 0) return; // Already loaded
      
      setIsLoading(true);
      try {
        // Try backend first
        const cities = await cityService.fetchCities();
        if (!cancelled && Array.isArray(cities)) {
          setSavedCities(cities);
        }
      } catch {
        // Fall back to local seed data
        try {
          const mod = await import("../data/mycityData.json");
          const data = Array.isArray(mod.default) ? mod.default : mod;
          if (!cancelled && Array.isArray(data)) setSavedCities(data);
        } catch {
          // ignore fallback errors
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadCities();
    return () => {
      cancelled = true;
    };
  }, [savedCities.length]);

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
      const createdCity = await cityService.createCity(city.name);
      
      // Add to local state with computed display data
      const cityWithDisplay = {
        ...createdCity,
        ...city, // Include flag, time, timezone, etc. from frontend computation
        addedAt: new Date().toISOString()
      };
      
      setSavedCities(prev => [...prev, cityWithDisplay]);
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

      if (cityToRemove && (cityToRemove._id || cityToRemove.id)) {
        await cityService.deleteCity(cityToRemove._id || cityToRemove.id);
      }
    } catch (error) {
      console.error("Failed to delete city via API:", error);
      // Continue with local removal even if API fails
    }

    // Remove from local state (using _id from your backend)
    setSavedCities((prev) => {
      return prev.filter((c) => {
        if (typeof cityIdOrName === "string") {
          return c._id !== cityIdOrName && c.id !== cityIdOrName && c.name !== cityIdOrName;
        }
        return true;
      });
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



