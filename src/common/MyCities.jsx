import React, { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import { useCityCart } from "../context/CityCartContext";
import citiesData from "../data/mycityData.json"; // local seed data for initial population
import { MdWbSunny } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function MyCities() {
  const { savedCities = [], addCity, removeCity } = useCityCart();
  const [query, setQuery] = useState("");

  // prefer savedCities from context, fallback to JSON file
  const cities = useMemo(() => {
    const source = Array.isArray(savedCities) && savedCities.length ? savedCities : citiesData;
    if (!query) return source;
    const q = query.toLowerCase();
    return source.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [savedCities, query]);

  return (
    <div className="absolute min-w-sm rounded-b-2xl bg-[#293A5180] max-h-[90vh] overflow-y-auto backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-white/5">

        {/* Search */}
        <div className="flex gap-3 mt-3 justify-between">
          {/* heading */}
          <div className="text-white font-semibold text-lg mb-2">My Cities</div>
          {/* + Add button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // addCity && addCity(city);
            }}
            className="flex items-center gap-2 bg-[#5695F5] hover:bg-[#4b86e3] text-white px-3 py-1 rounded-full shadow-md"
          >
            <FiPlus />
            <span className="text-sm">Add</span>
          </button>

        </div>
      </div>

      {/* Cities List */}
      <div className="p-4 space-y-4">
        {cities.map((city) => (
          <div key={city.id} className="relative rounded-xl bg-white/7 p-4 shadow-inner border border-white/6 flex items-start gap-3">


            {/* flag + name */}
            <div className="flex-shrink-0 ">
              <div className="flex gap-3">
                {city.flagImg ? (
                  <img src={city.flagImg} alt={`${city.name} flag`} className="w-8 h-6 object-cover rounded-sm" />
                ) : (
                  <span className="text-2xl">{city.flag}</span>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-lg">{city.name}</span>
                </div>
              </div>
              {/* Big time + timezone + calendar */}
              <div className="mt-2 flex items-center text-[#6db0ff] gap-3">
                <div className="text-3xl font-medium ">
                  {city.time} {city.timezone}
                </div>
                <FaCalendarAlt className="text-lg text-[#6db0ff]" />
              </div>

              {/* date and weather */}
              <div className="mt-2 text-xs text-white/60 items-center gap-3">
                <div>{city.date}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{city.weather === "sunny" ? "22 C Sunny" : city.weather === "cloudy" ? "18 C Cloudy" : "20 C"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end w-full h-28">
              {/* sun icon top-right */}
              <div className=" text-yellow-400 text-3xl">
                <MdWbSunny />
              </div>

              {/* trash button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // pass numeric id to context removeCity
                  removeCity && removeCity(city.id);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <RiDeleteBin5Fill size={24} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
