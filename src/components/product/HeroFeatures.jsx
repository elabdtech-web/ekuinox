import React from "react";
import { AiOutlinePoweroff, AiOutlineBulb, AiOutlineCloud, AiOutlineCheckCircle, AiOutlineHeart } from "react-icons/ai";
import { IoBluetoothOutline } from "react-icons/io5";
import { MdGpsFixed } from "react-icons/md";
import { PiBatteryChargingVerticalFill, PiFlashlightFill, PiHeartbeatFill, PiSneakerMoveFill, PiSolarPanelFill } from "react-icons/pi";

const FEATURES = [
  { id: 1, icon: <PiSolarPanelFill size={58} />, label: "Power Glass Solar\nCharging Lens" },
  {
    id: 2, icon: <PiBatteryChargingVerticalFill size={58} />, label: "High-Contrast\nDisplay" },
  { id: 3, icon: <PiFlashlightFill size={58} />, label: "Weather\nReady" },
  { id: 4, icon: <PiSneakerMoveFill size={58} />, label: "Smart\nConnectivity" },
  { id: 5, icon: <PiHeartbeatFill size={58} />, label: "Accurate\nTimekeeping" },
  { id: 6, icon: <MdGpsFixed size={58} />, label: "Activity\nTracking" }
];

const HeroFeatures = () => {
  return (
    <section className="w-full min-h-screen bg-[#070B13] text-white">
      {/* large hero image with overlay */}
      <div className="relative w-full overflow-hidden">
        <img
          src="/product-hero.png"
          alt="hero"
          className="w-full object-cover  transform-gpu"
        />
        <div className="absolute inset-0 space-y-6 flex flex-col items-center justify-end text-center bg-gradient-to-t from-[#070B13]  to-[#070B13]/20 px-6">
          {/* <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-wide">FĒNIX 7<br />SERIES</h2> */}
          <div className="mt-3 text-xl md:text-5xl text-white/90 font-medium">ALL DAY, EVERY DAY</div>
          <p className="mt-4 max-w-3xl text-sm md:text-lg text-white/60">
            Precision-crafted watches inspired by the rhythm of the Earth. Discover handcrafted design and
            advanced solar charging for longer adventures.
          </p>
          {/* icons row */}
          <div className="max-w-[1440px]  mx-auto px-6 lg:px-0 mt-6">
            <div className="bg-transparent rounded-xl p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 items-stretch
                               divide-y divide-white/6 lg:divide-y-0 lg:divide-x lg:divide-white/6">
                {FEATURES.map((f) => (
                  <div key={f.id} className="p-1">
                    <div className="px-6 flex flex-col items-center text-center h-full">
                      <div className="w-28 h-28 rounded-lg flex items-center justify-center text-[#5695F5]">
                        {f.icon}
                      </div>
                      <div className="text-lg text-white/90 leading-snug whitespace-pre-line">{f.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-44 bg-[#070B13]" />
      
    </section>
  );
}

export default HeroFeatures;