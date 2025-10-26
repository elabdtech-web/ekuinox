import React from "react";
import { motion } from "framer-motion";
import { MdGpsFixed } from "react-icons/md";
import {
  PiBatteryChargingVerticalFill,
  PiFlashlightFill,
  PiHeartbeatFill,
  PiSneakerMoveFill,
  PiSolarPanelFill,
} from "react-icons/pi";
import heroFeaturesData from "../../data/heroFeaturesData.json";

// Icon mapping
const iconMap = {
  PiSolarPanelFill: <PiSolarPanelFill size={58} />,
  PiBatteryChargingVerticalFill: <PiBatteryChargingVerticalFill size={58} />,
  PiFlashlightFill: <PiFlashlightFill size={58} />,
  PiSneakerMoveFill: <PiSneakerMoveFill size={58} />,
  PiHeartbeatFill: <PiHeartbeatFill size={58} />,
  MdGpsFixed: <MdGpsFixed size={58} />,
};

const FEATURES = heroFeaturesData.features.map((f) => ({
  ...f,
  icon: iconMap[f.iconName],
}));

const HeroFeatures = () => {
  return (
    <section className="w-full  relative bg-[#070B13] text-white">
      <div className="relative  w-full rounded-xl overflow-hidden mb-12">
        {/* Hero Image */}
        <img
          src={heroFeaturesData.heroImage}
          alt="hero"
          className="w-full object-cover transform-gpu"
        />

        {/* Overlay Content */}
        <div className="absolute  inset-0 space-y-6 flex flex-col items-center justify-end text-center bg-gradient-to-t from-[#070B13] to-[#070B13]/20 px-6 pb-10">


          {/* Features Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 mt-6 w-full ">
            <div className="flex text-center flex-col items-center mb-4 max-w-3xl mx-auto">
              <div
                className=" text-xl  sm:text-2xl md:text-4xl lg:text-5xl text-white/90 font-medium"
              >
                {heroFeaturesData.subtitle}
              </div>
              <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-white/60">
                {heroFeaturesData.description}</p>
              
            </div>
            <div className="bg-transparent rounded-xl p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 lg:gap-10 items-stretch divide-y divide-white/6 lg:divide-y-0 lg:divide-x lg:divide-white/6">
                {FEATURES.map((f, index) => (
                  <motion.div
                    key={f.id}
                    className="p-2"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="px-2 py-3 md:px-4 md:py-6 flex flex-col items-center text-center h-full">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-lg flex items-center justify-center text-[#5695F5]"
                      >
                        {React.cloneElement(f.icon, {
                          size:
                            window.innerWidth < 640
                              ? 40
                              : window.innerWidth < 1024
                                ? 52
                                : 56,
                        })}
                      </motion.div>
                      <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-snug whitespace-pre-line">
                        {f.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="h-10 bg-[#0C1220]" />
    </section>
  );
};

export default HeroFeatures;
