import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import citiesData from '../data/citiesData.json';

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

export default function GlobeEarth({ className = '' }) {
  const globeRef = useRef();
  const [cities] = useState(EXAMPLE_CITIES.slice(0, 10));
  // const [activeCity, setActiveCity] = useState(null);
  const [hoverCity, setHoverCity] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [sunPoint, setSunPoint] = useState(() => computeSubsolarPointUTC());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [manualTime, setManualTime] = useState(null); // null for auto, DateTime for manual

  // Update sun position every minute (auto mode only)
  useEffect(() => {
    if (manualTime) return; // Skip auto updates in manual mode
    const t = setInterval(() => setSunPoint(computeSubsolarPointUTC()), 60_000);
    return () => clearInterval(t);
  }, [manualTime]);

  // Disable zoom
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    try {
      const controls = globe.controls();
      if (controls) controls.enableZoom = false;
    } catch {
      // Ignore if controls not available
    }
  }, []);

  // Track mouse position
  useEffect(() => {
    const onMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Scroll to control sun position
  useEffect(() => {
    const onWheel = (e) => {
      if (!globeRef.current) return;
      // Toggle to manual mode on first scroll
      setManualTime((prev) => prev || DateTime.utc());
      // Adjust time by 15 minutes per 100 pixels scrolled
      const timeDelta = (e.deltaY / 100) * 15; // Positive scroll = forward in time
      setManualTime((prev) => {
        const newTime = prev.plus({ minutes: timeDelta });
        setSunPoint(computeSubsolarPointUTC(newTime));
        return newTime;
      });
    };
    window.addEventListener('wheel', onWheel);
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // Globe material and lighting
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const loader = new THREE.TextureLoader();
    const loadTexture = (url) =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        );
      });

    Promise.all([
      loadTexture('https://unpkg.com/three-globe/example/img/earth-day.jpg'),
      loadTexture('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      loadTexture('https://unpkg.com/three-globe/example/img/earth-night.jpg')
    ])
      .then(([dayMap,  nightMap]) => {
        // Custom shader for day-night blending
        const vertexShader = `
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform vec3 lightDirection;
          varying vec3 vNormal;
          varying vec2 vUv;
          void main() {
            float intensity = dot(normalize(vNormal), normalize(lightDirection));
            intensity = clamp(intensity, 0.0, 1.0);
            intensity = pow(intensity, ${nightMode ? '0.5' : '1.0'}); // Adjust contrast with night mode
            vec4 dayColor = texture2D(dayTexture, vUv);
            vec4 nightColor = texture2D(nightTexture, vUv);
            gl_FragColor = mix(nightColor, dayColor, intensity);
          }
        `;

        const material = new THREE.ShaderMaterial({
          uniforms: {
            dayTexture: { value: dayMap },
            nightTexture: { value: nightMap },
            lightDirection: { value: latLngToCartesian(sunPoint.lat, sunPoint.lon).multiplyScalar(100) }
          },
          vertexShader,
          fragmentShader
        });

        globe.globeMaterial = material;

        const scene = globe.scene();
        scene.userData._ek_lights?.forEach((l) => scene.remove(l));

        const ambient = new THREE.AmbientLight(0xffffff, nightMode ? 0.05 : 0.1);
        const dir = new THREE.DirectionalLight(0xffffff, nightMode ? 0.8 : 1.2);
        const vec = latLngToCartesian(sunPoint.lat, sunPoint.lon).multiplyScalar(100);
        dir.position.set(vec.x, vec.y, vec.z);
        dir.castShadow = false;

        scene.add(ambient);
        scene.add(dir);
        scene.userData._ek_lights = [ambient, dir];

        // remove existing starfield if present
        if (scene.userData._ek_stars) {
          scene.remove(scene.userData._ek_stars);
          if (scene.userData._ek_stars.geometry) scene.userData._ek_stars.geometry.dispose();
          if (scene.userData._ek_stars.material) scene.userData._ek_stars.material.dispose();
          scene.userData._ek_stars = null;
        }

        // add a large inward-facing sphere with a star texture for background
        try {
          const starMap = loader.load('https://unpkg.com/three-globe/example/img/galaxy_starfield.png');
          const starGeo = new THREE.SphereGeometry(400, 60, 40);
          const starMat = new THREE.MeshBasicMaterial({ map: starMap, side: THREE.BackSide, transparent: true, opacity: nightMode ? 1.0 : 0.0 });
          const starMesh = new THREE.Mesh(starGeo, starMat);
          scene.add(starMesh);
          scene.userData._ek_stars = starMesh;
        } catch {
          // ignore if star texture fails to load
        }

        // Add atmosphere
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(1.01, 64, 64),
          new THREE.ShaderMaterial({
            uniforms: {
              c: { value: 0.5 },
              p: { value: 5.0 }
            },
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform float c;
              uniform float p;
              varying vec3 vNormal;
              void main() {
                float intensity = pow(c - dot(vNormal, vec3(0, 0, 1.0)), p);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
              }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
          })
        );
        scene.add(atmosphere);

        if (globe.renderer()) {
          globe.renderer().outputEncoding = THREE.sRGBEncoding;
        }
      })
      .catch((error) => {
        console.error('Failed to load textures:', error);
        globe.globeMaterial = new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          roughness: 1
        });
      });
  }, [sunPoint, nightMode]);

  // Night mode toggle on 'n' key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'n' || e.key === 'N') setNightMode((s) => !s);
      if (e.key === 'r' || e.key === 'R') setManualTime(null); // Reset to auto mode
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // function formatLocalTime(lat, lng) {
  //   try {
  //     const tz = tzlookup(lat, lng);
  //     const dt = manualTime ? manualTime.setZone(tz) : DateTime.now().setZone(tz);
  //     return { time: dt.toFormat('HH:mm:ss'), zone: tz, iso: dt.toISO() };
  //   } catch {
  //     const dt = manualTime ? manualTime : DateTime.utc();
  //     return { time: dt.toFormat('HH:mm:ss'), zone: 'UTC', iso: dt.toISO() };
  //   }
  // }

  return (
    <div className={`relative globe-earth-wrapper ${className}`}>
      {/* Responsive Globe: show canvas on md+, fallback image on mobile */}
      <div className="hidden md:block">
        <Globe
          ref={globeRef}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(23,32,42,0)"
          pointsData={cities}
          pointLat={(d) => d.lat}
          pointLng={(d) => d.lng}
          pointAltitude={() => 0.001}
          pointRadius={1}
          pointColor={() => '#10aaff'}
          // onPointClick={(d) => setActiveCity(d)}
          onPointHover={(d) => setHoverCity(d || null)}
          animateIn
          width={860}
          height={860}
        />
      </div>
      {/* Mobile fallback: static image, smaller and centered */}
      <div className="block md:hidden w-full flex justify-center items-center">
        <img
          src="/hero.png"
          alt="earth"
          className="w-full max-w-xs sm:max-w-sm h-auto object-contain"
        />
      </div>

      {/* Hover preview card */}
      {hoverCity && (() => {
        const tz = (function (lat, lng) {
          try {
            return tzlookup(lat, lng);
          } catch {
            return 'UTC';
          }
        })(hoverCity.lat, hoverCity.lng);

        const dt = manualTime ? manualTime.setZone(tz) : DateTime.now().setZone(tz);
        const offsetHours = dt.offset / 60;
        const offsetLabel = `UTC${offsetHours >= 0 ? '+' + offsetHours : offsetHours}`;
        const dateLabel = dt.toFormat('d LLLL yyyy');
        const flagUrl = hoverCity.countryCode ? `https://flagcdn.com/w80/${hoverCity.countryCode.toLowerCase()}.png` : null;

        // Position card near mouse with corrected offset
        const offsetX = -500; // Small offset
        const offsetY = -120;
        const cardWidth = 320;
        const cardHeight = 160;
        const margin = 8;
        let clampedX = mousePos.x + offsetX;
        let clampedY = mousePos.y + offsetY;

        // Adjust position if card would go off-screen
        if (clampedX + cardWidth > window.innerWidth - margin) {
          clampedX = mousePos.x - cardWidth - offsetX; // Place to left
        }
        if (clampedY + cardHeight > window.innerHeight - margin) {
          clampedY = mousePos.y - cardHeight - offsetY; // Place above
        }
        clampedX = Math.max(margin, Math.min(clampedX, window.innerWidth - cardWidth - margin));
        clampedY = Math.max(margin, Math.min(clampedY, window.innerHeight - cardHeight - margin));

        return (
          <div
            style={{
              left: `${clampedX}px`,
              top: `${clampedY}px`,
              position: 'absolute',
              transition: 'left 0.1s ease, top 0.1s ease'
            }}
            className="w-80 backdrop-blur-2xl text-white bg-white/5 rounded-2xl p-4 shadow-inner  flex gap-3 items-start z-30 pointer-events-none"
          >
            <div className="flex-shrink-0">
              {flagUrl ? (
                <img src={flagUrl} alt={`${hoverCity.country} flag`} className="w-10 h-7 rounded-sm object-cover" />
              ) : (
                <div className="w-10 h-7 bg-white/10 rounded-sm" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{hoverCity.name}</div>
                <div className="text-yellow-400 text-lg">☀️</div>
              </div>
              <div className="mt-2 text-3xl font-semibold text-sky-400">
                {dt.toFormat('HH:mm')} <span className="text-sm text-white/60">{offsetLabel}</span>
              </div>
              <div className="text-xs text-white/60 mt-1">{dateLabel}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <div className="w-4 h-4 bg-white/10 rounded-full" />
                  <div>22 C Sunny</div>
                </div>
                <button className="bg-sky-500 text-white px-3 py-1 rounded-full pointer-events-auto">+ Add</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}