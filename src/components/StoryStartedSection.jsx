import React from "react";
import { motion } from "framer-motion";

export default function StoryStartedSection() {
  return (
    <section className="relative w-full py-16 min-h-[780px] flex items-center px-4 bg-[#070B13] overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Headline and paragraph */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            We’re just getting <span className="text-[#5695F5]">started</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed">
            At Ekuinox, our journey is only beginning. We are committed to
            pushing boundaries, exploring new ideas, and building a future where
            innovation and collaboration thrive. With every milestone, we grow
            stronger—expanding our reach, empowering our community, and
            embracing challenges as opportunities. The road ahead is full of
            possibilities, and we invite you to join us as we shape what comes
            next, together.
          </p>
        </motion.div>

        {/* Right: Dot world map */}
        <motion.div
          className="flex justify-end items-center"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img
            src="/dot-world.svg"
            alt="World map"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
