import React, { useState } from "react";
import { MdLocationCity } from "react-icons/md";
import { FaGlobeAmericas } from "react-icons/fa";
import { Country, City } from 'country-state-city';

export default function AddCityModal({
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);

  // Get all countries
  const allCountries = Country.getAllCountries();

  // Get cities for selected country
  const citiesOfCountry = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry)
    : [];

  // Handle country change
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedCity("");
    setCityName("");
    setError("");
  };

  // Handle city change
  const handleCityChange = (e) => {
    const cityValue = e.target.value;
    if (cityValue === "custom") {
      setUseCustomCity(true);
      setSelectedCity("");
      setCityName("");
    } else {
      setUseCustomCity(false);
      setSelectedCity(cityValue);
      // Find the city name from the cities list
      const city = citiesOfCountry.find(c => c.name === cityValue);
      setCityName(city ? city.name : cityValue);
    }
    setError("");
  };

  const validateCityName = (name) => {
    const trimmed = name.trim();

    // Check for minimum length
    if (trimmed.length < 2) {
      return "City name must be at least 2 characters long";
    }

    // Check for maximum length
    if (trimmed.length > 50) {
      return "City name must be less than 50 characters";
    }

    // Check for invalid characters (allow letters, spaces, hyphens, apostrophes)
    const validPattern = /^[a-zA-Z\s\-'.]+$/;
    if (!validPattern.test(trimmed)) {
      return "City name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Check for common invalid patterns
    if (/^\d+$/.test(trimmed)) {
      return "City name cannot be just numbers";
    }

    if (/^[^a-zA-Z]*$/.test(trimmed)) {
      return "City name must contain at least one letter";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = cityName.trim();

    if (!selectedCountry) {
      setError("Please select a country");
      return;
    }

    if (!trimmedName) {
      setError("Please enter or select a city name");
      return;
    }

    const validationError = validateCityName(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onConfirm(trimmedName);
      // Modal will be closed by parent component on success
    } catch (error) {
      console.error("Error adding city:", error);

      // Enhanced error handling based on backend responses
      let errorMessage = "Failed to add city. Please try again.";

      if (
        error.message.includes("401") ||
        error.message.includes("Authentication required")
      ) {
        errorMessage =
          "🔒 Please log in to add cities. Authentication required.";
      } else if (
        error.message.includes("409") ||
        error.message.includes("already exists")
      ) {
        errorMessage = `"${trimmedName}" is already in your city collection.`;
      } else if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        errorMessage = `"${trimmedName}" could not be found. Please check the spelling and try again.`;
      } else if (
        error.message.includes("400") ||
        error.message.includes("auto-complete")
      ) {
        errorMessage = `Invalid city name format. Please enter a valid city name.`;
      } else if (error.message.includes("500")) {
        errorMessage = "Server error occurred. Please try again later.";
      }

      setError(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 rounded-2xl bg-gradient-to-br from-[#1e2a3a] to-[#2a3b4f] border border-white/10 text-white shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdLocationCity className="text-blue-400 text-xl" />
            <div className="text-lg font-semibold">Add New City</div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Country Dropdown */}
          <div className="mb-4">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <FaGlobeAmericas className="text-blue-400" />
              Country *
            </label>
            <select
              className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all appearance-none cursor-pointer"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={isLoading}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                paddingRight: '3rem'
              }}
            >
              <option value="" className="bg-[#1e2a3a]">Select a country...</option>
              {allCountries.map((country) => (
                <option key={country.isoCode} value={country.isoCode} className="bg-[#1e2a3a]">
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown or Input */}
          {selectedCountry && (
            <div>
              <label className="text-sm text-white/70 font-medium flex items-center gap-2">
                <MdLocationCity className="text-blue-400" />
                City *
              </label>

              {citiesOfCountry.length > 0 ? (
                <div className="space-y-2">
                  <select
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all appearance-none cursor-pointer"
                    value={useCustomCity ? "custom" : (selectedCity || "")}
                    onChange={handleCityChange}
                    disabled={isLoading}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="" className="bg-[#1e2a3a]">Select a city...</option>
                    {citiesOfCountry.map((city) => (
                      <option key={city.name} value={city.name} className="bg-[#1e2a3a]">
                        {city.name}
                      </option>
                    ))}
                    <option value="custom" className="bg-[#1e2a3a] text-blue-300">
                      ✏️ Enter custom city name...
                    </option>
                  </select>

                  {useCustomCity && (
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Enter city name"
                      value={cityName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      autoFocus
                      maxLength={50}
                    />
                  )}
                </div>
              ) : (
                  <input
                    type="text"
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter city name"
                    value={cityName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    autoFocus
                    maxLength={50}
                  />
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-400/20">
              <div className="text-sm text-red-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

        

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/5 transition-all text-white/90"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cityName.trim() || !selectedCountry || isLoading}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                cityName.trim() && selectedCountry && !isLoading
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg"
                  : "bg-white/10 cursor-not-allowed text-white/50"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                "Add City"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}





