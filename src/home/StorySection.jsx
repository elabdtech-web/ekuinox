import React from "react";

const Stat = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-base text-white opacity-40">{label}</span>
    <span className="text-4xl font-bold text-[#5695F5]">{value}</span>
  </div>
);

export default function StorySection() {
  return (
    <section className="w-full min-h-screen bg-[#070B13]">
      <div className=" px-6 lg:px-0 py-16 max-w-[1440px] mx-auto ">



        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left text column */}
          <div className="relative lg:col-span-6 text-2xl">
            <div className="absolute bg-white/50 top-0 w-[560px] h-[140px]  overflow-hidden -z-10" />

            <h2 className="text-4xl lg:text-5xl font-medium text-white leading-tight">
              Our Short
              <br />
              Story
            </h2>

            <p className="mt-6 text-slate-300 ">
              Ekuinox is a journey through space and time — a place where
              technology, design, and precision unite. As the Earth rotates
              beneath your fingertips, watch light chase darkness across
              continents, revealing the world’s cities in their true rhythm.
              Beyond just a visual, it’s an experience that captures every
              moment — from sunrise in Tokyo to midnight in New York —
              reminding us that time connects us all.
            </p>

            <p className="mt-4 text-slate-300 ">
              In the endless stretch of stars, time was never constant. On one
              distant planet, a single day lasted a thousand years; on another,
              centuries passed in a blink. Yet, in the middle of this cosmic
              dance, two souls—born light-years apart—shared the same heartbeat.
            </p>

            <div className="mt-8 flex items-center gap-8">
              <Stat label="Trusted by Travelers" value="120K" />
              <Stat label="Cities Connected" value="10K" />
              <Stat label="Precision Watches Sold" value="120K" />
            </div>

            <div className="mt-8">
              <button className="px-6 py-2 bg-[#5695F5] text-white text-sm rounded-full shadow hover:bg-blue-500 transition">
                Learn more
              </button>
            </div>
          </div>

          {/* Right collage column */}
          <div className="lg:col-span-6">
            <div className="relative w-[700px] h-[840px] ">
              {/* Background dark panel */}
              {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070B13]" /> */}
              <img src="/watch.jpg" alt="" className="object-cover w-full h-full" />
              {/* Collage tiles */}

              {/* Large tile */}
              <div className="absolute top-0 w-[560px] h-[140px]  overflow-hidden bg-[#070B13]" />

              {/* small tiles */}
              <div className="absolute top-[140px] w-[140px] h-[280px]  bg-[#070B13]" />
              <div className="absolute left-[140px] top-[420px] w-[140px] h-[140px]  overflow-hidden bg-[#070B13]" />
              <div className="absolute top-[560px] left-[280px] w-[140px] h-[140px]  overflow-hidden bg-[#070B13]" />
              <div className="absolute bottom-0  w-[140px] h-[280px]  overflow-hidden bg-[#070B13]" />
              <div className="absolute bottom-0 left-[140px] w-[140px] h-[140px]  overflow-hidden bg-[#070B13]" />

              <div className="absolute top-[140px] right-0 w-[140px] h-[140px] overflow-hidden bg-[#070B13]" />
              <div className="absolute bottom-0 right-0 w-[280px] h-[140px]  overflow-hidden bg-[#070B13]" />

            </div>
          </div>
        </div>
        {/* Promo hero card (inserted) */}
        <div className="max-w-4xl mx-auto mb-12 mt-36 h-44">
          <div className="relative rounded-2xl p-12  backdrop-blur-md overflow-hidden border border-white/20 bg-gradient-to-b from-white/5 to-white/2"
            style={{
              boxShadow:
                "inset 0 30px 60px rgba(0,0,0,0), inset 0 -18px 40px rgba(0,0,0,0), inset 0 0 120px rgba(78,163,255,0.06)",
            }}
          >
            {/* top glow */}
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full bg-[#5695F5] blur-3xl pointer-events-none"
            />
            {/* subtle vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-black/10 to-transparent" />

            <div className="relative flex flex-col  items-center text-center">

              {/* replace /logo.png with your icon */}
              <img src="/e.svg" alt="Ekuinox" className="w-16 h-16" />

              <h3 className="text-3xl md:text-4xl font-medium pt-6 text-white">
                Own Your Moment in Time
              </h3>

              <p className="mt-3 text-slate-300 max-w-[500px] ">
                Discover handcrafted watches inspired by the rhythm of the Earth.
                Precision, elegance, and timeless design await.
              </p>

              <button className="mt-6 px-6 py-3 bg-[#5695F5] text-white rounded-full shadow hover:bg-blue-500 transition">
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
