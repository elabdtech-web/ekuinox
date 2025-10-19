import React from "react";

export default function GermenWatch() {
  return (
    <section className="relative w-full  min-h-screen h-[110vh] flex items-center justify-center bg-gradient-to-b from-[#080C14]  to-[#080C14] ">

      {/* centered watch image */}
      <div className=" max-w-[1440px] flex items-center  justify-center">
        <img
          src="/watch.png"
          alt="Garmin Fenix 7 Pro"
          className="pointer-events-none w-[80%]  md:w-[60%] lg:w-full  object-contain"
        />
      </div>

      {/* bottom info bar */}
      <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#1D3253]/40  to-[#1728433D]/30 backdrop-blur-sm px-6 md:px-0 py-6 pb-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="max-w-[1440px] mx-auto w-full flex  justify-between">
          <div className="text-left space-y-2.5 ">
            <h3 className="text-white text-lg md:text-6xl font-medium">
              Garmin Fenix 7 Pro
            </h3>
            <p className="mt-1 text-xl text-white/60 max-w-[460px]">
              Seepohre Solar Edition Titanium Carbon Gray DLC · black silicone
              strap 47 mm watch
            </p>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="ml-0 md:ml-6 inline-flex items-center w-[277px] h-[64px] justify-center rounded-full bg-gradient-to-r from-[#6ea9ff] to-[#4c8eff] px-12 py-2.5  cursor-pointer text-xl font-medium text-white shadow-lg hover:brightness-105 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
}
