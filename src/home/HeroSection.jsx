import React, { useState, useEffect } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import GlobeEarth from "../components/GlobeEarth";

export default function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState(50);
  const [hovered, setHovered] = useState(false);

  // Rotation animation for globe
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setRotationProgress((prev) => (prev + 0.5) % 100);
      setTimeOfDay((prev) => (prev + 0.5) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="w-full bg-[#070B13]  flex flex-col items-center justify-center relative">
      {/* Background & Globe */}
      <div className="w-full flex flex-col items-center justify-center relative">
        <div
          className="hero-waves absolute z-50 w-full h-full top-0 left-0"
          aria-hidden
        >
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>

        <div className="w-full  flex items-center overflow-hidden justify-center">
          <GlobeEarth
            className=" "
            hoverActive={hovered}
            hoverView={{ lat: 20, lng: -60, altitude: 1.6 }}
            isPlaying={isPlaying}
            timeOfDay={timeOfDay}
          />
        </div>
      </div>

      {/* Smooth expanding section */}
      <div className="px-2  w-full max-w-4xl mx-auto absolute -bottom-1 z-50 text-center">
        <div
          className={`mx-auto rounded-full border bg-[#070B13] text-white/70 font-medium cursor-pointer overflow-hidden transition-all duration-700 ease-in-out ${
            hovered ? "w-full max-w-3xl py-3 px-4" : "w-[160px] py-3 px-6"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!hovered ? (
            <span className="inline-block transition-opacity duration-500">
              Hover Here
            </span>
          ) : (
            <div className="flex items-center justify-between gap-4 transition-all duration-700 ease-in-out">
              {/* Play / Pause Button */}
              <div className="flex items-center gap-3 min-w-[160px]">
                <button
                  type="button"
                  aria-label="play"
                  onClick={() => setIsPlaying((v) => !v)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
                >
                  {isPlaying ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <BiSolidRightArrow />
                  )}
                </button>
                <div className="text-sm text-white/60">6 mon ago</div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 px-4">
                <div className="relative h-4 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b1320,#0b1320)]" />
                  <div className="absolute inset-0 bg-[url('/dotted-line.png')] bg-repeat-x opacity-30" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5695F5] shadow-md z-10 transition-all ease-linear"
                    style={{ left: `calc(${rotationProgress}% - 12px)` }}
                  />
                </div>
              </div>

              {/* Right-side buttons */}
              <div className="flex items-center gap-3">
                <div className="text-xs md:text-sm font-medium bg-[#111827] text-white/80 rounded-full py-2 px-3">
                  6 mon Ahead
                </div>
                <button className="text-xs md:text-sm font-medium bg-[#5695F5] text-white rounded-full py-2 px-4">
                  Return Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
