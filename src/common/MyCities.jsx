import React, { useMemo, useState, useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { MdWbSunny, MdRefresh } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsMoonStarsFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useCityCart } from "../context/CityCartContext";
import { useAuth } from "../context/AuthContext";
import AddCityModal from "../components/AddCityModal";

export default function MyCities() {
  const { savedCities = [], setSavedCities, removeCity, addCity, isLoading: contextLoading } = useCityCart();
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;

  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  //  Add City (memoized)
  const handleAddCity = useCallback(async (cityName) => {
    try {
      const trimmedName = cityName.trim();
      if (!trimmedName || trimmedName.length < 2) {
        throw new Error("Please enter a valid city name.");
      }

      setIsAdding(true);
      
      // Use the context's addCity function instead of duplicating logic
      await addCity({ name: trimmedName });

      toast.success(`🎉 ${trimmedName} added to your collection!`);
      setIsAddOpen(false);
    } catch (err) {
      console.error("Failed to add city:", err);
      throw err;
    } finally {
      setIsAdding(false);
    }
  }, [addCity]);

  // 🧠 Delete City (memoized)
  const handleDeleteCity = useCallback(
    (cityId) => {
      const cityToDelete = savedCities.find((c) => c._id === cityId);
      const cityName = cityToDelete?.name || "this city";

      toast(
        ({ closeToast }) => (
          <div>
            <p className="mb-3">
              Are you sure you want to delete <strong>{cityName}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                onClick={async () => {
                  closeToast();
                  try {
                    // Use the context's removeCity function instead of duplicating logic
                    await removeCity(cityId);
                    toast.success(`${cityName} deleted successfully! 🗑️`);
                  } catch (err) {
                    console.error("Failed to delete city:", err);
                    let msg = "Failed to delete city. Please try again.";
                    if (err.message.includes("401")) msg = "Please log in to delete cities.";
                    else if (err.message.includes("404"))
                      msg = "City not found or you don't have permission to delete it.";
                    toast.error(msg);
                  }
                }}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                onClick={closeToast}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          position: "top-right",
          autoClose: false,
          closeButton: false,
          draggable: false,
        }
      );
    },
    [savedCities, removeCity]
  );

  // 🔍 Filter cities (memoized)
  const cities = useMemo(() => {
    if (!Array.isArray(savedCities)) return [];
    if (!query) return savedCities;
    const q = query.toLowerCase();
    return savedCities.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [savedCities, query]);

  // Formatting utilities (unchanged)
  const formatTemperature = (t) => (t == null ? "N/A" : `${Math.round(t)}°C`);
  const formatWeather = (w, t) => {
    const temp = formatTemperature(t);
    const map = {
      clear: "Clear", clouds: "Cloudy", rain: "Rainy", snow: "Snowy",
      sunny: "Sunny", smoke: "Smoky", haze: "Hazy", unknown: "Unknown",
    };
    return `${temp} ${map[w] || w || "Unknown"}`;
  };

  // 🏳️ Flag Display
  const getFlagComponent = useCallback((city) => {
    if (city.flagImg) {
      return (
        <div className="relative ">
          <img
            src={city.flagImg}
            alt={`${city.country || city.name} flag`}
            className="w-8 h-6 object-cover rounded-sm border border-white/20 shadow-sm"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
          <div
            className="w-8 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-sm border border-white/20 flex items-center justify-center text-xs font-medium text-white/80"
            style={{ display: "none" }}
          >
            🏳️
          </div>
        </div>
      );
    }
    return (
      <div className="w-8 h-6 bg-white/10 rounded-sm flex items-center justify-center text-xs text-white/60 border border-white/20">
        🏳️
      </div>
    );
  }, []);

  const getTimezoneDisplay = useCallback((city) => {
    if (!city.timezone) return null;
    return (
      <div className="flex items-center gap-2 mt-1">
        <FaClock className="text-blue-400 text-xs" />
        <span className="text-sm text-blue-300 font-medium">{city.timezone}</span>
        {city.isDST && (
          <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-400/30 font-medium">
            DST
          </span>
        )}
      </div>
    );
  }, []);

  // 🧩 Conditional rendering (unchanged design)
  if (!isAuthenticated) {
    return (
      <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center text-white">
        <div className="text-4xl mb-2">🔒</div>
        <div className="text-lg font-semibold mb-2">Please login to add cities</div>
        <div className="text-white/60">You must be logged in to view or add your cities.</div>
      </div>
    );
  }

  if (contextLoading && cities.length === 0) {
    return (
      <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <MdRefresh className="animate-spin text-xl" />
          <span>Loading your cities...</span>
        </div>
      </div>
    );
  }

  // 🏙️ Main UI (unchanged design)
  return (
    <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex gap-3 mt-3 justify-between">
          <div className="text-white font-semibold text-lg mb-2">My Cities</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSavedCities([]);
                setError("");
                toast.info("Cities cache reset!");
              }}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-full shadow-md transition-colors"
              title="Reset cities cache"
            >
              <MdRefresh />
              <span className="text-sm">Reset</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddOpen(true);
              }}
              disabled={isAdding}
              className="flex items-center gap-2 bg-[#5695F5] hover:bg-[#4b86e3] disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded-full shadow-md transition-colors"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiPlus />
              )}
              <span className="text-sm">{isAdding ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </div>

        <div className="mt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your cities..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-400/20">
            <div className="text-sm text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* City List */}
      <div className="p-4 space-y-4">
        {isAdding && (
          <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-5 flex items-center gap-4 animate-pulse shadow-lg">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded flex items-center justify-center">🌍</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-200 font-semibold text-lg">Adding your city...</span>
              </div>
              <div className="text-sm text-blue-200/80">🚀 This will appear here instantly once added!</div>
              <div className="text-xs text-purple-200/60 mt-1">No page reload needed ✨</div>
            </div>
          </div>
        )}

        {cities.length === 0 && !isAdding && !error ? (
          <div className="text-center text-white/60 py-8">
            <div className="text-4xl mb-2">🌍</div>
            <div>No cities added yet.</div>
            <div className="text-sm mt-2 text-white/40">
              Click "Add" to start building your city collection!
            </div>
          </div>
        ) : (
          cities.map((city) => (
            <div
              key={city._id}
              className="relative rounded-xl bg-white/7 p-4 shadow-inner border border-white/6 flex items-start gap-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="flex gap-3 items-start mb-3">
                  {getFlagComponent(city)}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-lg">{city.name}</span>
                      {city.country && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-medium">
                          {city.country}
                        </span>
                      )}
                    </div>
                    {getTimezoneDisplay(city)}
                  </div>
                </div>

                <div className="mt-2 flex items-center text-[#6db0ff] gap-3">
                  <div className="text-3xl font-medium">{city.time || "N/A"}</div>
                  <FaCalendarAlt className="text-lg text-[#6db0ff]" />
                </div>

                <div className="mt-2 text-xs text-white/60 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white/80">{city.country || "Unknown Country"}</span>
                  </div>
                  {city.date && <div className="flex items-center gap-2"><span>{city.date}</span></div>}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/90">
                      {formatWeather(city.weather, city.temperature)}
                    </span>
                  </div>
                  {city.lat && city.lng && (
                    <div className="text-xs text-white/40">
                      {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end w-full h-28">
                <div className="text-3xl">
                  {city.isDay ? (
                    <MdWbSunny className="text-yellow-400 drop-shadow-lg" />
                  ) : (
                    <BsMoonStarsFill className="text-blue-300 drop-shadow-lg" />
                  )}
                </div>
                <div className="flex items-center gap-2">
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
          isLoading={isAdding}
        />
      )}
    </div>
  );
}
