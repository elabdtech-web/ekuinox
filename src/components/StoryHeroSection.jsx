import React from "react";

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

      {/* Short Story pill */}
      <div className="relative z-20 mb-8">
        <span className="inline-block px-6 py-4 rounded-full bg-[#3b82f6]/20 text-[#6ea9ff] text-xl font-medium shadow-sm backdrop-blur-md">
          Short Story
        </span>
      </div>

      {/* Headline */}
      <h1 className="relative z-20 text-4xl sm:text-5xl md:text-8xl font-medium text-center text-white leading-tight mb-6">
        Where it all{" "}
        <span className="text-[#6ea9ff] drop-shadow-lg">Began</span>
      </h1>

      {/* Paragraph */}
      <p className="relative z-20 max-w-5xl mx-auto text-center backdrop-blur-sm text-lg md:text-xl text-white opacity-40 font-normal">
        Ekuinox began with a vision to redefine boundaries and spark innovation.
        Our journey started with a simple idea: to empower creators and thinkers
        to shape a brighter, more connected future. Every step forward is driven
        by curiosity, collaboration, and a passion for making a difference. Join
        us as we continue to write our story—one breakthrough at a time.
      </p>
    </section>
  );
}
