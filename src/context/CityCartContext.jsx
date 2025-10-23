import React, { createContext, useContext, useState } from "react";

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

  const addCity = (city) => {
    if (!city || !city.name || !city.lat || !city.lng) {
      console.error("Invalid city data:", city);
      return;
    }

    setSavedCities((prev) => {
      // Check if city already exists
      const exists = prev.some(
        (c) => c.name === city.name && c.country === city.country
      );
      if (exists) {
        console.log("City already added:", city.name);
        return prev;
      }

      // Limit to 10 cities
      if (prev.length >= 10) {
        console.log("Maximum cities reached (10)");
        return prev;
      }

      console.log("Adding city:", city.name);
      return [...prev, { ...city, addedAt: new Date().toISOString() }];
    });
  };

  const removeCity = (cityName) => {
    setSavedCities((prev) => prev.filter((c) => c.name !== cityName));
  };

  const clearCities = () => {
    setSavedCities([]);
  };

  const value = {
    savedCities,
    addCity,
    removeCity,
    clearCities,
  };

  return (
    <CityCartContext.Provider value={value}>
      {children}
    </CityCartContext.Provider>
  );
}
