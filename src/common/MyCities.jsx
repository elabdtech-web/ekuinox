



// import React, { useMemo, useState } from "react";
// import { FiPlus } from "react-icons/fi";
// import { FaCalendarAlt } from "react-icons/fa";
// import { MdWbSunny, MdRefresh } from "react-icons/md";
// import { RiDeleteBin5Fill } from "react-icons/ri";
// import { BsMoonStarsFill } from "react-icons/bs";
// import { useCityCart } from "../context/CityCartContext";
// import AddCityModal from "../components/AddCityModal";

// export default function MyCities() {
//   const { savedCities = [], addCity, removeCity, refreshCity } = useCityCart();
//   const [query, setQuery] = useState("");
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refreshingIds, setRefreshingIds] = useState(new Set());

//   const handleAddCity = async (cityName) => {
//     try {
//       setLoading(true);
//       await addCity({ name: cityName });
//       setIsAddOpen(false);
//     } catch (error) {
//       console.error('Failed to add city:', error);
//       alert('Failed to add city. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteCity = async (cityId) => {
//     try {
//       await removeCity(cityId);
//     } catch (error) {
//       console.error('Failed to delete city:', error);
//       alert('Failed to delete city. Please try again.');
//     }
//   };

//   const handleRefreshCity = async (cityId) => {
//     try {
//       setRefreshingIds(prev => new Set(prev).add(cityId));
//       await refreshCity(cityId);
//     } catch (error) {
//       console.error('Failed to refresh city:', error);
//       alert('Failed to refresh city weather. Please try again.');
//     } finally {
//       setRefreshingIds(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(cityId);
//         return newSet;
//       });
//     }
//   };

//   const cities = useMemo(() => {
//     if (!Array.isArray(savedCities)) return [];
//     if (!query) return savedCities;
//     const q = query.toLowerCase();
//     return savedCities.filter((c) => (c.name || "").toLowerCase().includes(q));
//   }, [savedCities, query]);

//   const formatTemperature = (temp) => {
//     if (temp === null || temp === undefined) return "N/A";
//     return `${Math.round(temp)}°C`;
//   };

//   const formatWeather = (weather, temperature) => {
//     const tempStr = formatTemperature(temperature);
//     const weatherMap = {
//       clear: "Clear",
//       clouds: "Cloudy", 
//       rain: "Rainy",
//       snow: "Snowy",
//       sunny: "Sunny",
//       unknown: "Unknown"
//     };
//     const weatherStr = weatherMap[weather] || weather || "Unknown";
//     return `${tempStr} ${weatherStr}`;
//   };

//   // Extract country code from various sources in your backend data
//   const getCountryCode = (city) => {
//     // Try direct countryCode field first
//     if (city.countryCode) return city.countryCode;
    
//     // Extract from flagImg URL (e.g., "https://flagcdn.com/w320/jp.png" -> "jp")
//     if (city.flagImg) {
//       const match = city.flagImg.match(/\/([a-z]{2})\.png$/i);
//       if (match) return match[1];
//     }
    
//     // Extract from id field (e.g., "jp_tokyo" -> "jp")
//     if (city.id && typeof city.id === 'string') {
//       const parts = city.id.split('_');
//       if (parts.length >= 2 && parts[0].length === 2) {
//         return parts[0];
//       }
//     }
    
//     // Extract from externalId field (e.g., "jp-tokyo" -> "jp")
//     if (city.externalId && typeof city.externalId === 'string') {
//       const parts = city.externalId.split('-');
//       if (parts.length >= 2 && parts[0].length === 2) {
//         return parts[0];
//       }
//     }
    
//     return null;
//   };

//   if (loading && cities.length === 0) {
//     return (
//       <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center text-white">
//         Loading cities...
//       </div>
//     );
//   }

//   return (
//     <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
//       <div className="p-4 border-b border-white/5">
//         <div className="flex gap-3 mt-3 justify-between">
//           <div className="text-white font-semibold text-lg mb-2">My Cities</div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => window.location.reload()}
//               disabled={loading}
//               className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1 rounded-full shadow-md"
//             >
//               <MdRefresh className={loading ? "animate-spin" : ""} />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsAddOpen(true);
//               }}
//               className="flex items-center gap-2 bg-[#5695F5] hover:bg-[#4b86e3] text-white px-3 py-1 rounded-full shadow-md"
//             >
//               <FiPlus />
//               <span className="text-sm">Add</span>
//             </button>
//           </div>
//         </div>

//         <div className="mt-2">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search city..."
//             className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500"
//           />
//         </div>
//       </div>

//       {/* Cities List */}
//       <div className="p-4 space-y-4">
//         {cities.length === 0 ? (
//           <div className="text-center text-white/60 py-8">
//             No cities added yet. Click "Add" to get started!
//           </div>
//         ) : (
//           cities.map((city) => {
//             // Debug logging to check city data structure
//             console.log(`City data for ${city.name}:`, {
//               flagImg: city.flagImg,
//               id: city.id,
//               externalId: city.externalId,
//               countryCode: getCountryCode(city),
//               timezone: city.timezone
//             });
            
//             return (
//             <div key={city._id} className="relative rounded-xl bg-white/7 p-4 shadow-inner border border-white/6 flex items-start gap-3">
//               <div className="flex-shrink-0">
//                 <div className="flex gap-3 items-center">
//                   {/* Flag Display */}
//                   <div className="flex-shrink-0">
//                     {city.flagImg ? (
//                       <img 
//                         src={city.flagImg} 
//                         alt={`${city.name} flag`} 
//                         className="w-8 h-6 object-cover rounded-sm border border-white/20" 
//                         onError={(e) => {
//                           console.log(`Flag failed to load for ${city.name}:`, city.flagImg);
//                           e.target.style.display = 'none';
//                           e.target.nextElementSibling.style.display = 'block';
//                         }}
//                         onLoad={() => {
//                           console.log(`Flag loaded successfully for ${city.name}:`, city.flagImg);
//                         }}
//                       />
//                     ) : null}
//                     {/* Fallback for broken/missing flag */}
//                     <div 
//                       className="w-8 h-6 bg-white/10 rounded-sm flex items-center justify-center text-xs text-white/60" 
//                       style={{ display: city.flagImg ? 'none' : 'flex' }}
//                     >
//                       {getCountryCode(city) || '🏳️'}
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col">
//                     <div className="flex items-center gap-2">
//                       <span className="text-white font-medium text-lg">{city.name}</span>
//                       {/* Country Code Badge - inline with name */}
//                       {getCountryCode(city) && (
//                         <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
//                           {getCountryCode(city).toUpperCase()}
//                         </span>
//                       )}
//                     </div>
//                     {/* Show timezone prominently */}
//                     {city.timezone && (
//                       <span className="text-sm text-white/80 mt-0.5">
//                         {city.timezone}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-2 flex items-center text-[#6db0ff] gap-3">
//                   <div className="text-3xl font-medium">
//                     {city.time || "N/A"}
//                     {city.isDST && (
//                       <span className="align-middle ml-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/30">DST</span>
//                     )}
//                   </div>
//                   <FaCalendarAlt className="text-lg text-[#6db0ff]" />
//                 </div>

//                 <div className="mt-2 text-xs text-white/60">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span>{city.country || "Unknown"}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm">
//                       {city.date && <span>{city.date}</span>}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-sm">
//                       {formatWeather(city.weather, city.temperature)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col justify-between items-end w-full h-28">
//                 {/* Day/Night Icon */}
//                 <div className="text-3xl">
//                   {city.isDay ? (
//                     <MdWbSunny className="text-yellow-400" />
//                   ) : (
//                     <BsMoonStarsFill className="text-blue-300" />
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleRefreshCity(city._id);
//                     }}
//                     disabled={refreshingIds.has(city._id)}
//                     className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-50"
//                   >
//                     <MdRefresh 
//                       size={20} 
//                       className={`text-blue-400 ${refreshingIds.has(city._id) ? 'animate-spin' : ''}`} 
//                     />
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDeleteCity(city._id);
//                     }}
//                     className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
//                   >
//                     <RiDeleteBin5Fill size={20} className="text-red-500" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//           })
//         )}
//       </div>

//       {isAddOpen && (
//         <AddCityModal
//           onClose={() => setIsAddOpen(false)}
//           onConfirm={(cityName) => handleAddCity(cityName)}
//         />
//       )}
//     </div>
//   );
// }



import React, { useMemo, useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { MdWbSunny, MdRefresh } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsMoonStarsFill } from "react-icons/bs";
import { useCityCart } from "../context/CityCartContext";
import AddCityModal from "../components/AddCityModal";
import cityService from "../services/cityService";

export default function MyCities() {
  const { savedCities = [], setSavedCities } = useCityCart();
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshingIds, setRefreshingIds] = useState(new Set());

  // Load cities from backend API on mount
  useEffect(() => {
    const loadInitialCities = async () => {
      try {
        setLoading(true);
        const cities = await cityService.fetchCities();
        console.log('Loaded cities from API:', cities);
        setSavedCities && setSavedCities(cities);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialCities();
  }, [setSavedCities]);

  const loadCities = async () => {
    try {
      setLoading(true);
      const cities = await cityService.fetchCities();
      console.log('Loaded cities from API:', cities);
      setSavedCities && setSavedCities(cities);
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async (cityName) => {
    try {
      setLoading(true);
      
      // Validate city name
      const trimmedName = cityName.trim();
      if (!trimmedName) {
        alert('Please enter a valid city name.');
        return;
      }
      
      if (trimmedName.length < 2) {
        alert('City name must be at least 2 characters long.');
        return;
      }

      const newCity = await cityService.createCity(trimmedName);
      console.log('Created new city:', newCity);
      
      // Auto-reload to show new city immediately
      await loadCities();
      setIsAddOpen(false);
      
      // Show success message with brief delay
      setTimeout(() => {
        alert(`✅ Successfully added ${newCity.name || trimmedName}!`);
      }, 100);
    } catch (error) {
      console.error('Failed to add city:', error);
      
      // Better error handling based on common issues
      let errorMessage = 'Failed to add city.';
      
      if (error.message.includes('401') || error.message.includes('Authentication required')) {
        errorMessage = '🔒 Please log in to add cities. You need to be authenticated to perform this action.';
      } else if (error.message.includes('404')) {
        errorMessage = `"${cityName}" is not a valid city name or could not be found. Please check the spelling and try again.`;
      } else if (error.message.includes('400')) {
        errorMessage = `Invalid city name format. Please enter a valid city name like "Tokyo" or "New York".`;
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        errorMessage = `Error: ${error.message || 'Please check the city name spelling and try again.'}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCity = async (cityId) => {
    try {
      await cityService.deleteCity(cityId);
      // Remove from local state
      setSavedCities && setSavedCities(prev => prev.filter(city => city._id !== cityId));
    } catch (error) {
      console.error('Failed to delete city:', error);
      
      let errorMessage = 'Failed to delete city. Please try again.';
      if (error.message.includes('401') || error.message.includes('Authentication required')) {
        errorMessage = '🔒 Please log in to delete cities. You need to be authenticated to perform this action.';
      }
      
      alert(errorMessage);
    }
  };

  const handleRefreshCity = async (cityId) => {
    try {
      setRefreshingIds(prev => new Set(prev).add(cityId));
      const updatedCity = await cityService.refreshCity(cityId);
      console.log('Refreshed city:', updatedCity);
      
      // Update city in local state
      setSavedCities && setSavedCities(prev => 
        prev.map(city => city._id === cityId ? updatedCity : city)
      );
    } catch (error) {
      console.error('Failed to refresh city:', error);
      
      let errorMessage = 'Failed to refresh city weather. Please try again.';
      if (error.message.includes('401') || error.message.includes('Authentication required')) {
        errorMessage = '🔒 Please log in to refresh cities. You need to be authenticated to perform this action.';
      }
      
      alert(errorMessage);
    } finally {
      setRefreshingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(cityId);
        return newSet;
      });
    }
  };

  const cities = useMemo(() => {
    if (!Array.isArray(savedCities)) return [];
    if (!query) return savedCities;
    const q = query.toLowerCase();
    return savedCities.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [savedCities, query]);

  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return "N/A";
    return `${Math.round(temp)}°C`;
  };

  const formatWeather = (weather, temperature) => {
    const tempStr = formatTemperature(temperature);
    const weatherMap = {
      clear: "Clear",
      clouds: "Cloudy", 
      rain: "Rainy",
      snow: "Snowy",
      sunny: "Sunny",
      unknown: "Unknown"
    };
    const weatherStr = weatherMap[weather] || weather || "Unknown";
    return `${tempStr} ${weatherStr}`;
  };

  // Extract country code from backend response
  const getCountryCode = (city) => {
    console.log(`Extracting country code for ${city.name}:`, {
      flagImg: city.flagImg,
      externalId: city.externalId,
      id: city.id
    });
    
    // Extract from flagImg URL (https://flagcdn.com/w320/jp.png -> JP)
    if (city.flagImg) {
      const match = city.flagImg.match(/\/([a-z]{2})\.png$/i);
      if (match) return match[1].toUpperCase();
    }
    
    // Extract from externalId (jp-tokyo -> JP)
    if (city.externalId && typeof city.externalId === 'string') {
      const parts = city.externalId.split('-');
      if (parts.length >= 2 && parts[0].length === 2) {
        return parts[0].toUpperCase();
      }
    }
    
    // Extract from id field (jp_tokyo -> JP)
    if (city.id && typeof city.id === 'string') {
      const parts = city.id.split('_');
      if (parts.length >= 2 && parts[0].length === 2) {
        return parts[0].toUpperCase();
      }
    }
    
    return null;
  };

  // Enhanced flag display with country-flag-icons
  const getFlagComponent = (city) => {
    const countryCode = getCountryCode(city);
    
    if (city.flagImg) {
      return (
        <div className="relative">
          <img 
            src={city.flagImg}
            alt={`${city.name} flag`} 
            className="w-8 h-6 object-cover rounded-sm border border-white/20 shadow-sm" 
            onError={(e) => {
              console.log(`Flag failed to load for ${city.name}:`, e.target.src);
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div 
            className="w-8 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-sm border border-white/20 flex items-center justify-center text-xs font-medium text-white/80" 
            style={{ display: 'none' }}
          >
            {countryCode || '🏳️'}
          </div>
        </div>
      );
    }
    
    // Fallback flag using country-flag-icons CDN
    if (countryCode) {
      const flagUrl = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
      return (
        <div className="relative">
          <img 
            src={flagUrl}
            alt={`${city.name} flag`} 
            className="w-8 h-6 object-cover rounded-sm border border-white/20 shadow-sm" 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div 
            className="w-8 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-sm border border-white/20 flex items-center justify-center text-xs font-medium text-white/80" 
            style={{ display: 'none' }}
          >
            {countryCode}
          </div>
        </div>
      );
    }
    
    // Ultimate fallback
    return (
      <div className="w-8 h-6 bg-white/10 rounded-sm flex items-center justify-center text-xs text-white/60 border border-white/20">
        🏳️
      </div>
    );
  };

  // Enhanced timezone display
  const getTimezoneDisplay = (city) => {
    if (!city.timezone) return null;
    
    return (
      <div className="flex items-center gap-2 mt-1">
        <FaClock className="text-blue-400 text-xs" />
        <span className="text-sm text-blue-300 font-medium">
          {city.timezone}
        </span>
        {city.isDST && (
          <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-400/30 font-medium">
            DST
          </span>
        )}
      </div>
    );
  };

  if (loading && cities.length === 0) {
    return (
      <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <MdRefresh className="animate-spin text-xl" />
          <span>Loading cities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex gap-3 mt-3 justify-between">
          <div className="text-white font-semibold text-lg mb-2">My Cities</div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadCities}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1 rounded-full shadow-md transition-colors"
            >
              <MdRefresh className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddOpen(true);
              }}
              className="flex items-center gap-2 bg-[#5695F5] hover:bg-[#4b86e3] text-white px-3 py-1 rounded-full shadow-md transition-colors"
            >
              <FiPlus />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>
      </div>

      {/* Cities List */}
      <div className="p-4 space-y-4">
        {cities.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            <div className="text-4xl mb-2">🌍</div>
            <div>No cities added yet. Click "Add" to get started!</div>
          </div>
        ) : (
          cities.map((city) => (
            <div key={city._id} className="relative rounded-xl bg-white/7 p-4 shadow-inner border border-white/6 flex items-start gap-4 hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex gap-3 items-start mb-3">
                  {/* Enhanced Flag Display */}
                  {getFlagComponent(city)}
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{city.name}</span>
                      {getCountryCode(city) && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-medium">
                          {getCountryCode(city)}
                        </span>
                      )}
                    </div>
                    
                    {/* Enhanced Timezone Display */}
                    {getTimezoneDisplay(city)}
                  </div>
                </div>

                <div className="mt-2 flex items-center text-[#6db0ff] gap-3">
                  <div className="text-3xl font-medium">
                    {city.time || "N/A"}
                  </div>
                  <FaCalendarAlt className="text-lg text-[#6db0ff]" />
                </div>

                <div className="mt-2 text-xs text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80">{city.country || "Unknown"}</span>
                  </div>
                  {city.date && (
                    <div className="flex items-center gap-2">
                      <span>{city.date}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/90">
                      {formatWeather(city.weather, city.temperature)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end w-full h-28">
                {/* Day/Night Icon */}
                <div className="text-3xl">
                  {city.isDay ? (
                    <MdWbSunny className="text-yellow-400 drop-shadow-lg" />
                  ) : (
                    <BsMoonStarsFill className="text-blue-300 drop-shadow-lg" />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefreshCity(city._id);
                    }}
                    disabled={refreshingIds.has(city._id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-50 transition-all duration-200"
                    title="Refresh weather data"
                  >
                    <MdRefresh 
                      size={20} 
                      className={`text-blue-400 ${refreshingIds.has(city._id) ? 'animate-spin' : ''}`} 
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCity(city._id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-200"
                    title="Delete city"
                  >
                    <RiDeleteBin5Fill size={20} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddOpen && (
        <AddCityModal
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAddCity}
        />
      )}
    </div>
  );
}