import React from "react";
import { motion } from "framer-motion";

export default function StoryHeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-[#070B13] overflow-hidden px-4 py-16">
      {/* Background earth image (bottom, blurred) */}
      <img
        src="/earth-bg.png"
        alt="Earth background"
        className="absolute left-1/2 top-40 w-[70vw] max-w-none -translate-x-1/2 pointer-events-none select-none opacity-60 blur-sm"
        style={{ zIndex: 0 }}
      />
      {/* Overlay: Gradient on top of image and behind content */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#070B13] to-transparent pointer-events-none" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#070B13] to-transparent pointer-events-none" />

      {/* Animated container */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.25 }}
      >
        {/* Short Story pill */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span className="inline-block px-6 py-4 rounded-full bg-[#3b82f6]/20 text-[#6ea9ff] text-xl font-medium shadow-sm backdrop-blur-md">
            Short Story
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.9 }}
          className="text-4xl sm:text-5xl md:text-8xl font-medium text-white leading-tight mb-6"
        >
          Where it all{" "}
          <span className="text-[#6ea9ff] drop-shadow-lg">Began</span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 60 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-lg sm:text-xl text-white/70 font-normal backdrop-blur-sm"
        >
          Ekuinox began with a vision to redefine boundaries and spark
          innovation. Our journey started with a simple idea: to empower
          creators and thinkers to shape a brighter, more connected future.
          Every step forward is driven by curiosity, collaboration, and a
          passion for making a difference. Join us as we continue to write our
          story—one breakthrough at a time.
        </motion.p>
      </motion.div>
    </section>
  );
}

