import React, { useState } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import { ImArrowRight } from "react-icons/im";
import GlobeEarth from "../components/GlobeEarth";

export default function HeroSection() {
  const [hoverProgress, setHoverProgress] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0); // 0-100%
  const [timeOfDay, setTimeOfDay] = useState(50); // 0=midnight, 50=noon, 100=midnight
  const [showSection, setShowSection] = useState(false);

  // Update rotation progress when playing
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRotationProgress((prev) => {
        const next = prev + 0.5; // Increment by 0.5% every 100ms
        if (next >= 100) return 0; // Reset after full rotation
        return next;
      });

      // Update time of day (cycle through 24 hours)
      setTimeOfDay((prev) => {
        const next = prev + 0.5;
        if (next >= 100) return 0;
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="w-full flex flex-col items-center justify-center  relative">
      {/* full-bleed visual so the rings can extend outside the container */}
      <div className=" w-full flex flex-col items-center justify-center relative">
        {/* Animated waves behind the globe */}
        <div
          className="hero-waves absolute z-50 w-full h-full top-0 left-0"
          aria-hidden
        >
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>

        {/* Globe component (above waves) */}
        <div className=" w-full flex items-center overflow-hidden justify-center">
          {/* pass hover state and a target view (lat,lng,alt) so globe moves on hover */}
          <GlobeEarth
            hoverActive={hoverProgress}
            hoverView={{ lat: 20, lng: -60, altitude: 1.6 }}
            isPlaying={isPlaying}
            timeOfDay={timeOfDay}
          />
        </div>
      </div>

      {/* Responsive hover-progress control (expanded style) */}
      <div className="my-8 md:my-12 px-2 w-full max-w-4xl mx-auto absolute bottom-6 z-50 text-center">
        {/* Show the button only when section is hidden */}
        {!showSection && (
          <span
            className="mb-4 inline-block text-base text-white/60 py-3 px-6 font-medium rounded-full bg-[#070B13] border cursor-pointer"
            onMouseEnter={() => setShowSection(true)}
            onFocus={() => setShowSection(true)}
            tabIndex={0}
          >
            Hover Here
          </span>
        )}
        {/* Show the section only when showSection is true */}
        {showSection && (
          <div
            className={`w-full transition-all duration-700 ease-in-out ${showSection ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
              } overflow-hidden`}
            onMouseLeave={() => setShowSection(false)}
          >
            <div className="w-full relative group">
              <div className="rounded-full bg-[#0b1320]/80 border border-white/10 px-4 py-3 flex items-center gap-4 shadow-inner">
                {/* Left: play + label */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  <button
                    type="button"
                    aria-label="play"
                    onClick={() => setIsPlaying((v) => !v)}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                {/* Center: dotted track */}
                <div className="flex-1 px-4">
                  <div className="relative h-4  overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b1320,#0b1320)]" />
                    <div className="absolute inset-0 bg-[url('/dotted-line.png')] bg-repeat-x opacity-30" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#5695F5] shadow-md z-10 transition-all ease-linear"
                      style={{ left: `calc(${rotationProgress}% - 12px)` }}
                    />
                  </div>
                </div>
                {/* Right: action pills */}
                <div className="flex items-center gap-3">
                  <div className="text-xs md:text-sm font-medium bg-[#111827] text-white/80 rounded-full py-2 px-3">
                    6 mon Ahead
                  </div>
                  <button className="text-xs md:text-sm font-medium bg-[#5695F5] text-white rounded-full py-2 px-4">
                    Return Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
