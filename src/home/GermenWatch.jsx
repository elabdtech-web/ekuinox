import React from "react";

export default function GermenWatch() {
  return (
    <section className="relative w-full md:min-h-screen h-[50vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#080C14] to-[#080C14]">
      {/* centered watch image */}
      <div className="max-w-7xl w-full flex justify-center">
        <img
          src="/watch.png"
          alt="Garmin Fenix 7 Pro"
          className="pointer-events-none w-full max-w-xs sm:max-w-lg md:max-w-lg lg:max-w-7xl object-contain"
        />
      </div>

      {/* bottom info bar */}
      <div className="w-full bg-gradient-to-t from-[#1D3253]/40 to-[#1728433D]/30 backdrop-blur-sm px-4 md:px-0 py-6 pb-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4 min-w-0 flex-wrap">
          <div className="text-center md:text-left space-y-2.5 flex-1 min-w-0">
            <h3 className="text-white text-3xl sm:text-5xl md:text-6xl font-medium">
              Garmin Fenix 7 Pro
            </h3>
            <p className="mt-1 text-sm sm:text-lg md:text-xl text-white/60 max-w-xs sm:max-w-md md:max-w-[460px] mx-auto md:mx-0">
              Seepohre Solar Edition Titanium Carbon Gray DLC · black silicone
              strap 47 mm watch
            </p>
          </div>

          <div className="flex items-center justify-center w-full md:w-auto">
            <button
              type="button"
              className="w-full max-w-xs md:w-[277px] h-12 md:h-[64px] justify-center rounded-full bg-gradient-to-r from-[#6ea9ff] to-[#4c8eff] px-6 md:px-12 py-2.5 cursor-pointer text-base md:text-xl font-medium text-white shadow-lg hover:brightness-105 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
