import React from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import { ImArrowRight } from "react-icons/im";
import GlobeEarth from "../components/GlobeEarth";

export default function HeroSection() {
  return (
    <section className="w-full flex  bg-gradient-to-b min-h-screen from-[#061428] via-[#0d2740] to-[#071026] flex-col items-center justify-center relative">
      {/* full-bleed visual so the rings can extend outside the container */}
      <div className=" w-full">
        <div className="hero-visual w-full flex items-center justify-center">
          {/* SVG starfield background (absolute, behind globe) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center">
            <img
              src="/stars.svg"
              alt="starfield background"
              className="w-[140%] max-w-none opacity-60 dark:opacity-40 transform-gpu scale-[1.02]"
              style={{
                filter: "blur(0.6px)",
                mixBlendMode: "screen",
              }}
            />
          </div>
          {/* Animated waves behind the globe */}
          <div className="hero-waves" aria-hidden>
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
          </div>

          {/* Globe component (above waves) */}
          <div className="hero-image w-full mt-16 h-auto flex items-center justify-center">
            <GlobeEarth />
          </div>
        </div>
      </div>

      <div className=" mt-6 mb-12 bg-gradient-to-b from-transparent to-[#071026]  text-center">
        <div className="mt-6">
          <div className="hover-progress-btn px-6 py-3 text-white rounded-full transition-all duration-700 hover:px-12 hover:py-4 relative  group border border-white/20 hover:border-white/40">
            <span className="group-hover:opacity-0 transition-opacity duration-500 delay-100">
              Hover here
            </span>
            <div className="progress-content opacity-0  group-hover:opacity-100 absolute inset-0 flex items-center justify-between px-4 bg-gray-900  transition-opacity duration-500 delay-300 ">
              <span className="text-sm font-medium bg-gray-600 rounded-full py-1 px-2">
                1 Year ago
              </span>
              <button
                type="button"
                className="bg-white ml-2 rounded-full cursor-pointer text-black inline p-1"
              >
                <BiSolidRightArrow />
              </button>
              <div
                className="flex-1 mx-4 h-6 relative flex items-center px-4"
                style={{
                  backgroundImage: "url('/line.png')",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "center",
                  backgroundSize: "", // 2px line + 4px gap
                }}
              ></div>
              <span className="text-sm font-medium bg-gray-600 rounded-full py-1 px-2">
                1 Year ahead
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
