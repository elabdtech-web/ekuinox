import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import * as THREE from "three";
import { DateTime } from "luxon";
import citiesData from "../data/citiesData.json";
import { useCityCart } from "../context/CityCartContext";
import tz_lookup from "tz-lookup";
// Removed page-level Loader usage; a global splash loader will cover initial load

const EXAMPLE_CITIES = citiesData.cities;

function computeSubsolarPointUTC(now = DateTime.utc()) {
  const utcDecimalHours = now.hour + now.minute / 60 + now.second / 3600;
  let lon = -15 * utcDecimalHours;
  if (lon < -180) lon += 360;
  const dayOfYear = now.ordinal;
  const decl = 23.44 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365);
  const lat = decl;
  return { lat, lon };
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
  const [cities] = useState(EXAMPLE_CITIES.slice(0, 10));
  // const [activeCity, setActiveCity] = useState(null);
  const [hoverCity, setHoverCity] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [sunPoint, setSunPoint] = useState(() => computeSubsolarPointUTC());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [manualTime, setManualTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addCity } = useCityCart();

  useEffect(() => {
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
    globe.pointsData(cities);
    globe.pointLat((d) => d.lat);
    globe.pointLng((d) => d.lng);
    globe.pointAltitude(0.001);
    globe.pointRadius(1);
    globe.pointColor(() => "#10aaff");
    // globe.onPointClick((d) => setActiveCity(d));
    globe.onPointHover((d) => setHoverCity(d || null));
    
  // globe.pointOfView({ lat: 0, lng: 0, altitude: 0.7 }, 400);
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
  }, [cities]); // Removed isPlaying from dependencies to prevent recreation

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

  return (
    <div className={`relative globe-earth-wrapper ${className}`}>
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div ref={containerRef} className=" " />
      </div>

    

      {/* Hover preview card */}
      {hoverCity &&
        (() => {
          const tz = (function (lat, lng) {
            try {
              return tz_lookup(lat, lng);
            } catch {
              return "UTC";
            }
          })(hoverCity.lat, hoverCity.lng);

          const dt = manualTime
            ? manualTime.setZone(tz)
            : DateTime.now().setZone(tz);
          const offsetHours = dt.offset / 60;
          const offsetLabel = `UTC${
            offsetHours >= 0 ? "+" + offsetHours : offsetHours
          }`;
          const dateLabel = dt.toFormat("d LLLL yyyy");
          const flagUrl = hoverCity.countryCode
            ? `https://flagcdn.com/w80/${hoverCity.countryCode.toLowerCase()}.png`
            : null;

          // Position card near mouse with corrected offset
          const offsetX = -120; // Small offset
          const offsetY = -180;
          const cardWidth = 320;
          const cardHeight = 160;
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
              className="w-64 backdrop-blur-2xl text-white bg-white/5 rounded-2xl p-4 shadow-inner flex gap-3 items-start z-30 pointer-events-none"
            >
              <div className="flex-shrink-0">
                {flagUrl ? (
                  <img
                    src={flagUrl}
                    alt={`${hoverCity.country} flag`}
                    className="w-7 h-5 rounded-sm object-cover"
                  />
                ) : (
                  <div className="w-10 h-7 bg-white/10 rounded-sm" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{hoverCity.name}</div>
                  <div className="text-yellow-400 text-lg">☀️</div>
                </div>
                <div className="mt-2 text-xl font-semibold text-sky-400">
                  {dt.toFormat("HH:mm")}{" "}
                  <span className="text-sm text-white/60">{offsetLabel}</span>
                </div>
                <div className="text-xs text-white/60 mt-1">{dateLabel}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <div className="w-4 h-4 bg-white/10 rounded-full" />
                    <div>22 C Sunny</div>
                  </div>
                  <button
                    className="bg-sky-500 text-white px-3 py-1 rounded-full pointer-events-auto hover:bg-sky-600 transition"
                    onClick={() => addCity(hoverCity)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}



