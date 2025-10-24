import React, { createContext, useContext, useEffect, useState } from "react";

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

  // load initial seed data once on mount if not already present
  useEffect(() => {
    if (savedCities && savedCities.length) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    (async () => {
      try {
        const mod = await import("../data/mycityData.json");
        const data = Array.isArray(mod.default) ? mod.default : mod;
        if (!cancelled && Array.isArray(data)) setSavedCities(data);
      } catch (_err) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addCity = (city) => {
    if (!city || !city.name) {
      console.error("Invalid city data:", city);
      return;
    }

    setSavedCities((prev) => {
      // check by id if present otherwise by name
      const exists = city.id ? prev.some((c) => c.id === city.id) : prev.some((c) => c.name === city.name);
      if (exists) {
        // already present
        return prev;
      }

      if (prev.length >= 50) {
      // arbitrary guard
        return prev;
      }

      return [...prev, { ...city, addedAt: new Date().toISOString() }];
    });
  };

  // remove by id (preferred) or by name
  const removeCity = (cityIdOrName) => {
    setSavedCities((prev) => {
      if (typeof cityIdOrName === "number") {
        return prev.filter((c) => c.id !== cityIdOrName);
      }
      if (typeof cityIdOrName === "string") {
        return prev.filter((c) => c.name !== cityIdOrName);
      }
      return prev;
    });
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
