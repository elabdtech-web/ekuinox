import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function GermenWatch() {
  return (
    <section className="relative w-full md:min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#080C14] to-[#080C14] overflow-hidden">
      <div className="md:h-28 bg-[#080C14]"></div>

      {/* Centered Watch Image */}
      <div className="max-w-7xl w-full flex justify-center">
        <img
          src="/watch.png"
          alt="Garmin Fenix 7 Pro"
          className="pointer-events-none w-full max-w-xs sm:max-w-lg md:max-w-lg lg:max-w-7xl object-contain"
        />
      </div>

      {/* Bottom Info Bar */}
      <div className="w-full bg-gradient-to-t from-[#1D3253]/40 to-[#1728433D]/30 backdrop-blur-sm px-4 md:px-0 py-6 pb-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
          {/* Animated Text */}
          <motion.div
            className="text-center md:text-left space-y-2.5 flex-1 min-w-0"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium">
              Garmin Fenix 7 Pro
            </h3>
            <p className="mt-1 text-sm sm:text-base md:text-lg text-white/60 max-w-xs sm:max-w-md md:max-w-[460px] mx-auto md:mx-0">
              Seepohre Solar Edition Titanium Carbon Gray DLC · black silicone
              strap 47 mm watch
            </p>
          </motion.div>

          {/* Animated Button (Delayed) */}
          <motion.div
            className="flex items-center justify-center w-full md:w-auto"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/product">
            <button
              type="button"
              
              className="w-full max-w-xs md:w-[277px] h-12 md:h-[64px] justify-center rounded-full bg-gradient-to-r from-[#6ea9ff] to-[#4c8eff] px-6 md:px-12 py-2.5 cursor-pointer text-base md:text-xl font-medium text-white shadow-lg hover:to-blue-600 transition"
            >
              Buy Now
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
