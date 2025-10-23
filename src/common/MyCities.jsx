import React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useCityCart } from "../context/CityCartContext";
import citiesData from "../data/mycityData.json"; // <-- use JSON data

export default function MyCities() {
  const { savedCities = [], addCity, removeCity } = useCityCart();

  // prefer savedCities from context, fallback to JSON file
  const cities =
    Array.isArray(savedCities) && savedCities.length ? savedCities : citiesData;

  return (
    <div className="min-w-[290px] rounded-2xl bg-[#1a2332]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
     

      {/* Cities List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-white/70 uppercase tracking-wide">
            MY CITIES
          </span>
          <button
            className="flex items-center gap-1 text-sm text-[#5695F5] hover:text-[#4b86e3] transition"
            onClick={() =>
              addCity &&
              addCity({
                id: Date.now(),
                name: "New City",
                flag: "🌍",
                timezone: "UTC+0",
                time: "00:00",
                weather: "clear",
                isOnline: true,
              })
            }
          >
            <FiPlus size={14} />
            Add New
          </button>
        </div>

        {cities.map((city) => (
          <div
            key={city.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{city.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{city.name}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      city.isOnline ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>
                    {city.time} {city.timezone}
                  </span>
                  <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center">
                    <span className="text-xs">📋</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {city.weather === "sunny" ? "☀️" : "🌥️"}
              </span>
              <button
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition"
                onClick={() => removeCity && removeCity(city.id)}
              >
                <FiX size={12} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
