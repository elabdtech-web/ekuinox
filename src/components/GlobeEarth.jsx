import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import * as THREE from "three";
import { DateTime } from "luxon";
import SunCalc from "suncalc";
import { useCityCart } from "../context/CityCartContext";
import tz_lookup from "tz-lookup";
import cityService from "../services/cityService";

// --- ADDED: determine day/night for cities ---
function determineDayOrNight(cityList = []) {
  return cityList.map((city) => {
    try {
      const tz = tz_lookup(city.lat, city.lng);
      const dt = DateTime.now().setZone(tz);
      const hour = dt.hour;
      const isDay = hour >= 6 && hour < 18; // 6:00-17:59 considered day
      return {
        ...city,
        isDay,
        timezone: city.timezone || tz,
        isDST: dt.isInDST || false,
      };
    } catch (e) {
      return {
        ...city,
        isDay: true,
        timezone: city.timezone || "UTC",
        isDST: false,
      };
    }
  });
}
// --- END ADDED ---

function computeSubsolarPointUTC(now = DateTime.utc()) {
  // Use SunCalc for physically accurate subsolar point
  const date = now.toJSDate();
  const pos = SunCalc.getPosition(date, 0, 0); // position at equator/prime meridian
  const subsolarLat = (pos.altitude * 180) / Math.PI;
  const subsolarLon = ((-pos.azimuth) * 180) / Math.PI;
  return { lat: subsolarLat, lon: subsolarLon };
}

function latLngToCartesian(latDeg, lonDeg) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const x = Math.cos(lat) * Math.cos(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.sin(lon);
  return new THREE.Vector3(x, y, z);
}

export default function GlobeEarth({
  className = "",
  isPlaying = false,
  timeOfDay = 50,
}) {
  const containerRef = useRef();
  const globeRef = useRef();
  
  // Use cities from your backend API instead of static data
  const { savedCities = [] } = useCityCart();
  const [cities, setCities] = useState([]);
  const [hoverCity, setHoverCity] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [sunPoint, setSunPoint] = useState(() => computeSubsolarPointUTC());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [manualTime, setManualTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  // Load cities from your backend API
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        
        // First try to use cities from context
        if (savedCities && savedCities.length > 0) {
          console.log('Using cities from context:', savedCities.length);
          setCities(determineDayOrNight(savedCities));
        } else {
          // Fallback: fetch from API
          console.log('Fetching cities from API...');
          const apiCities = await cityService.fetchCities();
          console.log('Loaded cities from API:', apiCities.length);
          setCities(determineDayOrNight(apiCities));
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities([]); // Set empty array on error
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [savedCities]);

  // Initialize globe when cities are loaded
  useEffect(() => {
    if (loadingCities || !containerRef.current) return;
    
    console.log('Initializing globe with cities:', cities.length);
    
    const globe = Globe();
    globe.globeImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-day.jpg"
    );
    globe.bumpImageUrl(
      "https://unpkg.com/three-globe/example/img/earth-topology.png"
    );
    globe.backgroundImageUrl(
      "https://unpkg.com/three-globe/example/img/night-sky.png"
    );
    globe.showAtmosphere(false);
    
    // Set cities data with proper coordinates
    globe.pointsData(cities);
    globe.pointLat((d) => {
      console.log(`City ${d.name}: lat=${d.lat}`);
      return d.lat || 0;
    });
    globe.pointLng((d) => {
      console.log(`City ${d.name}: lng=${d.lng}`);
      return d.lng || 0;
    });
    globe.pointAltitude(0.002); // Slightly higher to make them more visible
    globe.pointRadius(1.5); // Slightly larger for better visibility
    globe.pointColor((d) => {
      // Use different colors based on day/night or weather
      if (d.isDay) return "#ffaa00"; // Golden for day
      return "#10aaff"; // Blue for night
    });
    
    globe.onPointHover((d) => {
      setHoverCity(d || null);
      // Change cursor when hovering over cities
      if (d) {
        containerRef.current.style.cursor = 'pointer';
      } else {
        containerRef.current.style.cursor = 'grab';
      }
    });
    
    // Set initial view
    const screenWidth = window.innerWidth;
    const altitude = screenWidth < 768 ? 2.8 : screenWidth < 1366 ? 2.2 : 1.85;
    globe.pointOfView({ lat: 0, lng: 0, altitude }, 800);
    
    globe(containerRef.current);
    const mountNode = containerRef.current;
    globeRef.current = globe;

    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = false;
      controls.autoRotate = false; // Start with autoRotate off
      controls.autoRotateSpeed = 0.5;
    }

    return () => {
      if (mountNode && mountNode.firstChild) {
        mountNode.removeChild(mountNode.firstChild);
      }
    };
  }, [cities, loadingCities]);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = isPlaying;
      controls.autoRotateSpeed = isPlaying ? 0.5 : 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const hours = (timeOfDay / 100) * 24;
    const now = DateTime.utc().set({
      hour: Math.floor(hours),
      minute: (hours % 1) * 60,
    });
    setSunPoint(computeSubsolarPointUTC(now));
    setManualTime(now);
  }, [timeOfDay, isPlaying]);

  useEffect(() => {
    if (manualTime || isPlaying) return;
    const t = setInterval(() => setSunPoint(computeSubsolarPointUTC()), 60_000);
    return () => clearInterval(t);
  }, [manualTime, isPlaying]);

  // Update shader sun direction when sun position changes
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;
    const material = globe.userData?.dayNightMaterial;

    if (material && material.uniforms && material.uniforms.sunDirection) {
      const sunDir = latLngToCartesian(sunPoint.lat, sunPoint.lon);
      material.uniforms.sunDirection.value.copy(sunDir);
    }
  }, [sunPoint]);

  useEffect(() => {
    const onMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "n" || e.key === "N") setNightMode((s) => !s);
      if (e.key === "r" || e.key === "R") setManualTime(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;
    const loader = new THREE.TextureLoader();

    Promise.all([
      new Promise((resolve) =>
        loader.load(
          "https://unpkg.com/three-globe/example/img/earth-day.jpg",
          resolve
        )
      ),
      new Promise((resolve) =>
        loader.load(
          "https://unpkg.com/three-globe/example/img/earth-night.jpg",
          resolve
        )
      ),
    ])
      .then(([dayMap, nightMap]) => {
        // Custom shader for day/night blending
        const material = new THREE.ShaderMaterial({
          uniforms: {
            dayTexture: { value: dayMap },
            nightTexture: { value: nightMap },
            sunDirection: {
              value: latLngToCartesian(sunPoint.lat, sunPoint.lon),
            },
          },
          vertexShader: `
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
          fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform vec3 sunDirection;
          varying vec3 vNormal;
          varying vec2 vUv;

          void main() {
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;

            // Calculate how much this point faces the sun
            float sunIntensity = dot(normalize(vNormal), normalize(sunDirection));

            // Create smooth transition between day and night
            // smoothstep creates a nice gradient at the terminator (day/night boundary)
            float mixFactor = smoothstep(-0.1, 0.1, sunIntensity);

            // Blend day and night textures
            vec3 color = mix(nightColor, dayColor, mixFactor);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
        });

        globe.globeMaterial(material);

        // Store material reference to update sun position
        if (!globe.userData) globe.userData = {};
        globe.userData.dayNightMaterial = material;

        // Globe is now fully loaded
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load textures:", error);
        setIsLoading(false); // Set loading to false even on error
      });
  }, [sunPoint, nightMode]);

  // Helper function to format temperature
  const formatTemperature = (temp) => {
    if (temp === null || temp === undefined) return "N/A";
    return `${Math.round(temp)}°C`;
  };

  // Helper function to format weather
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

  // Show loading state while cities are being loaded
  if (loadingCities) {
    return (
      <div className={`relative globe-earth-wrapper ${className} flex items-center justify-center h-96`}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <div>Loading your cities...</div>
        </div>
      </div>
    );
  }

  // Show message if no cities are added
  if (cities.length === 0) {
    return (
      <div className={`relative globe-earth-wrapper ${className} flex items-center justify-center h-96`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🌍</div>
          <div className="text-lg mb-2">No cities added yet</div>
          <div className="text-white/60">Add some cities to see them on the globe!</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative globe-earth-wrapper ${className}`}>
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div ref={containerRef} className="" />
      </div>

      {/* Cities count indicator */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        🌍 {cities.length} {cities.length === 1 ? 'city' : 'cities'}
      </div>

    

      {/* Hover preview card - NO ADD BUTTON */}
      {hoverCity &&
        (() => {
          // Use timezone from backend data or compute it
          const timezone = hoverCity.timezone || (() => {
            try {
              const tz = tz_lookup(hoverCity.lat, hoverCity.lng);
              const dt = DateTime.now().setZone(tz);
              const offsetHours = dt.offset / 60;
              return `UTC${offsetHours >= 0 ? "+" + offsetHours : offsetHours}`;
            } catch {
              return "UTC";
            }
          })();

          // Use time from backend or compute current time
          const displayTime = hoverCity.time || (() => {
            try {
              const tz = tz_lookup(hoverCity.lat, hoverCity.lng);
              return DateTime.now().setZone(tz).toFormat("HH:mm");
            } catch {
              return DateTime.now().toFormat("HH:mm");
            }
          })();

          // Use date from backend or compute current date
          const displayDate = hoverCity.date || (() => {
            try {
              const tz = tz_lookup(hoverCity.lat, hoverCity.lng);
              return DateTime.now().setZone(tz).toFormat("d LLLL yyyy");
            } catch {
              return DateTime.now().toFormat("d LLLL yyyy");
            }
          })();

          // Get flag URL
          const flagUrl = hoverCity.flagImg;

          // Position card near mouse with corrected offset
          const offsetX = -120;
          const offsetY = -180;
          const cardWidth = 320;
          const cardHeight = 140; // Reduced height since no button
          const margin = 0;
          let clampedX = mousePos.x + offsetX;
          let clampedY = mousePos.y + offsetY;

          // Adjust position if card would go off-screen
          if (clampedX + cardWidth > window.innerWidth - margin) {
            clampedX = mousePos.x - cardWidth - offsetX; // Place to left
          }
          if (clampedY + cardHeight > window.innerHeight - margin) {
            clampedY = mousePos.y - cardHeight - offsetY; // Place above
          }
          clampedX = Math.max(
            margin,
            Math.min(clampedX, window.innerWidth - cardWidth - margin)
          );
          clampedY = Math.max(
            margin,
            Math.min(clampedY, window.innerHeight - cardHeight - margin)
          );

          return (
            <div
              style={{
                left: `${clampedX}px`,
                top: `${clampedY}px`,
                position: "absolute",
                transition: "left 0.1s ease, top 0.1s ease",
              }}
              className="w-64 backdrop-blur-2xl text-white bg-white/5 rounded-2xl p-4 shadow-inner flex gap-3 items-start z-30 pointer-events-none border border-white/10"
            >
              <div className="flex-shrink-0">
                {flagUrl ? (
                  <img
                    src={flagUrl}
                    alt={`${hoverCity.country} flag`}
                    className="w-7 h-5 rounded-sm object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-7 h-5 bg-white/10 rounded-sm border border-white/20" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{hoverCity.name}</div>
                  <div className="text-yellow-400 text-lg">
                    {hoverCity.isDay ? "☀️" : "🌙"}
                  </div>
                </div>
                <div className="mt-2 text-xl font-semibold text-sky-400">
                  {displayTime}{" "}
                  <span className="text-sm text-white/60">{timezone}</span>
                  {hoverCity.isDST && (
                    <span className="ml-1 text-xs bg-yellow-500/20 text-yellow-300 px-1 py-0.5 rounded border border-yellow-400/30">
                      DST
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/60 mt-1">{displayDate}</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <div className={`w-3 h-3 rounded-full ${
                    hoverCity.weather === 'clear' ? 'bg-yellow-400' :
                    hoverCity.weather === 'clouds' ? 'bg-gray-400' :
                    hoverCity.weather === 'rain' ? 'bg-blue-400' :
                    hoverCity.weather === 'snow' ? 'bg-white' :
                    'bg-white/10'
                  }`} />
                  <div>{formatWeather(hoverCity.weather, hoverCity.temperature)}</div>
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {hoverCity.country} • {hoverCity.lat?.toFixed(2)}°, {hoverCity.lng?.toFixed(2)}°
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}






