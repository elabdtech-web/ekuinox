import React, { useState, useEffect } from "react";

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition
      ${checked ? "bg-blue-500/80" : "bg-white/15"}
      border border-white/15`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white shadow
        transition-all ${checked ? "right-1" : "left-1"}`}
    />
  </button>
);

export default function Setting({ onReset }) {
  const [toggles, setToggles] = useState({
    majorCities: true,
    tropicLines: true,
    equator: true,
    polarCircles: false,
    solarDeclination: false,
  });

  const update = (key) =>
    setToggles((t) => {
      const next = { ...t, [key]: !t[key] };
      return next;
    });

  useEffect(() => {
    // hook here if you want to notify parent about changes
  }, [toggles]);

  const reset = () => {
    const def = {
      majorCities: true,
      tropicLines: true,
      equator: true,
      polarCircles: false,
      solarDeclination: false,
    };
    setToggles(def);
    onReset?.(def);
  };

  return (
    <div className="w-[300px] rounded-2xl  text-white border border-white/10 shadow-2xl bg-[#293A5180] backdrop-blur-xl p-4">
      <div className="text-xs tracking-widest text-white/80 uppercase">
        Earth Components
      </div>
      <div className="my-3 border-t border-white/10" />

      <div className="space-y-4 text-[15px]">
        <div className="flex items-center justify-between">
          <span>Major Cities</span>
          <Toggle
            checked={toggles.majorCities}
            onChange={() => update("majorCities")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Tropic Lines</span>
          <Toggle
            checked={toggles.tropicLines}
            onChange={() => update("tropicLines")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Equator</span>
          <Toggle
            checked={toggles.equator}
            onChange={() => update("equator")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Polar Circles</span>
          <Toggle
            checked={toggles.polarCircles}
            onChange={() => update("polarCircles")}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Solar Declination</span>
          <Toggle
            checked={toggles.solarDeclination}
            onChange={() => update("solarDeclination")}
          />
        </div>
      </div>

      <button
        onClick={reset}
        className="mt-5 w-full h-11 rounded-full bg-[#5695F5] hover:bg-[#4b86e3] transition font-medium"
      >
        Reset View
      </button>
    </div>
  );
}
