import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import * as THREE from "three";
import { DateTime } from "luxon";
import tzlookup from "tz-lookup";
import citiesData from "../data/citiesData.json";
import { useCityCart } from "../context/CityCartContext";

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
  const [activeCity, setActiveCity] = useState(null);
  const [hoverCity, setHoverCity] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [sunPoint, setSunPoint] = useState(() => computeSubsolarPointUTC());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [manualTime, setManualTime] = useState(null);
  const { addCity } = useCityCart();

  useEffect(() => {
    if (!containerRef.current) return;

    const globe = Globe()
      .globeImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-topology.png"
      )
      .backgroundImageUrl(
        "https://unpkg.com/three-globe/example/img/night-sky.png"
      )
      .showAtmosphere(false)
      .pointsData(cities)
      .pointLat((d) => d.lat)
      .pointLng((d) => d.lng)
      .pointAltitude(0.001)
      .pointRadius(1)
      .pointColor(() => "#10aaff")
      .onPointClick((d) => setActiveCity(d))
      .onPointHover((d) => setHoverCity(d || null));

    globe(containerRef.current);
    globeRef.current = globe;

    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = false;
      controls.autoRotate = isPlaying;
      controls.autoRotateSpeed = isPlaying ? 0.5 : 0;
    }

    return () => {
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [cities, isPlaying]);

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
      })
      .catch((error) => console.error("Failed to load textures:", error));
  }, [sunPoint, nightMode]);

  return (
    <div className={`relative globe-earth-wrapper ${className}`}>
      <div className="hidden md:block">
        <div ref={containerRef} />
      </div>
      <div className="md:hidden w-full flex justify-center items-center">
        <img
          src="/hero.png"
          alt="earth"
          className="w-full max-w-xs sm:max-w-sm h-auto object-contain"
        />
      </div>
    </div>
  );
}
