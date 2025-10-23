import React, { useState } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import { ImArrowRight } from "react-icons/im";
import GlobeEarth from "../components/GlobeEarth";

export default function HeroSection() {
  const [hoverProgress, setHoverProgress] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0); // 0-100%
  const [timeOfDay, setTimeOfDay] = useState(50); // 0=midnight, 50=noon, 100=midnight

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
      <div className="hero-visual w-full flex flex-col items-center justify-center relative">
        {/* SVG starfield background (absolute, behind globe) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
          <img
            src="/stars.svg"
            alt="starfield background"
            className="w-[180vw] max-w-none opacity-60 dark:opacity-40 transform-gpu scale-[1.02]"
            style={{
              filter: "blur(0.6px)",
              mixBlendMode: "screen",
            }}
          />
        </div>
        {/* Animated waves behind the globe */}
        <div
          className="hero-waves absolute w-full h-full top-0 left-0"
          aria-hidden
        >
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>

        {/* Globe component (above waves) */}
        <div className="hero-image w-full mt-8 md:mt-16 h-[50vh] md:h-[80vh] flex items-center justify-center">
          {/* pass hover state and a target view (lat,lng,alt) so globe moves on hover */}
          <GlobeEarth
            hoverActive={hoverProgress}
            hoverView={{ lat: 20, lng: -60, altitude: 1.6 }}
            isPlaying={isPlaying}
            timeOfDay={timeOfDay}
          />
        </div>
      </div>

      {/* Responsive hover-progress button section */}
      <div className="my-8 md:my-12 px-2 w-full max-w-lg mx-auto absolute -bottom-12 z-50 text-center">
        <div>
          <div
            className="hover-progress-btn px-4 md:px-6 py-3 text-white hover:overflow-hidden rounded-full transition-all duration-700 hover:px-12 hover:py-4 w-36 mx-auto relative group border border-white/20 hover:border-white/40"
            onMouseEnter={() => setHoverProgress(true)}
            onMouseLeave={() => setHoverProgress(false)}
            onFocus={() => setHoverProgress(true)}
            onBlur={() => setHoverProgress(false)}
          >
            <span className="group-hover:opacity-0 transition-opacity duration-500 delay-100">
              Hover here
            </span>
            <div className="progress-content opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-between px-2 md:px-4 bg-gray-900 rounded-full transition-opacity duration-500 delay-300">
              <span className="text-xs md:text-sm font-medium bg-gray-600 rounded-full py-1 px-2">
                1 Year ago
              </span>
              <button
                type="button"
                className="bg-white ml-2 rounded-full cursor-pointer text-black inline p-1 hover:bg-gray-200 transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
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
              <div
                className="flex-1 mx-2 md:mx-4 h-6 relative flex items-center px-2 md:px-4 overflow-hidden rounded-full"
                style={{
                  backgroundImage: "url('/line.png')",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                  backgroundSize: "",
                }}
              >
                {/* Progress indicator with day/night cycle */}
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${rotationProgress}%`,
                    background: `linear-gradient(90deg, 
                      rgba(30, 58, 138, 0.6) 0%,
                      rgba(59, 130, 246, 0.6) 25%,
                      rgba(251, 191, 36, 0.8) 50%,
                      rgba(239, 68, 68, 0.6) 75%,
                      rgba(30, 58, 138, 0.6) 100%
                    )`,
                  }}
                />

                {/* Moving sun/moon indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear z-10"
                  style={{
                    left: `${rotationProgress}%`,
                    transform: `translateX(-50%) translateY(-50%)`,
                  }}
                >
                  {timeOfDay < 25 || timeOfDay > 75 ? (
                    // Night: Moon
                    <div className="w-4 h-4 rounded-full bg-blue-800 shadow-lg flex items-center justify-center text-xs">
                    
                    </div>
                  ) : timeOfDay >= 25 && timeOfDay <= 75 ? (
                    // Day: Sun
                    <div className="w-4 h-4 rounded-full bg-blue-400 shadow-lg flex items-center justify-center text-xs animate-pulse">
                      ☀️
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium bg-gray-600 rounded-full py-1 px-2">
                1 Year ahead
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
