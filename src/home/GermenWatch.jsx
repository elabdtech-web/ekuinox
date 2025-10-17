import React from "react";

export default function GermenWatch() {
  return (
    <section className="w-full">
      <div className="mx-auto ">
        <div
          className="relative overflow-hidden py-16 shadow-2xl"
          style={{
            background: "linear-gradient(90deg, #080C14 0%, #1C2F4F 100%)",
          }}
        >
          {/* centered watch image */}
          <div className="relative w-full py-16 flex items-center justify-center">
            <img
              src="/watch.png"
              alt="Garmin Fenix 7 Pro"
              className="pointer-events-none w-[80%]  max-w-[920px] md:w-[60%] lg:w-[50%] -mt-8 object-contain"
            />
          </div>

          {/* bottom info bar */}
          <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-r from-black/40 via-white/5 to-black/30 backdrop-blur-sm px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-white text-lg md:text-4xl font-semibold">
                Garmin Fenix 7 Pro
              </h3>
              <p className="mt-1 text-sm text-white/60 max-w-xl">
                Seepohre Solar Edition Titanium Carbon Gray DLC · black silicone
                strap 47 mm watch
              </p>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                className="ml-0 md:ml-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#6ea9ff] to-[#4c8eff] px-12 py-2.5  cursor-pointer text-sm font-medium text-white shadow-lg hover:brightness-105 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
