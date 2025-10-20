import React from "react";

export default function StoryHeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#070B13] overflow-hidden px-4 py-16">
      {/* Background earth image (bottom, blurred) */}
      <img
        src="/earth-bg.png"
        alt="Earth background"
        className="absolute left-1/2 top-40 w-[120vw] max-w-none -translate-x-1/2 pointer-events-none select-none opacity-60 blur-sm"
        style={{ zIndex: 0 }}
      />
      {/* Overlay: Gradient on top of image and content */}
      {/* <div className="absolute inset-0  pointer-events-none z-10 bg-gradient-to-b from-[#23375a]/10 to-transparent" />

      <div className="absolute inset-0 bottom-0 h-40 pointer-events-none z-10 bg-[#070B13]" /> */}
      {/* Short Story pill */}
      <div className="relative z-10 mb-8">
        <span className="inline-block px-6 py-4 rounded-full bg-[#3b82f6]/20 text-[#6ea9ff] text-xl font-medium shadow-sm backdrop-blur-md">
          Short Story
        </span>
      </div>

      {/* Headline */}
      <h1 className="relative z-10 text-4xl sm:text-5xl md:text-8xl font-bold text-center text-white leading-tight mb-6">
        Where it all <span className="text-[#6ea9ff] drop-shadow-lg">Began</span>
      </h1>

      {/* Paragraph */}
      <p className="relative z-10 max-w-5xl mx-auto text-center text-lg md:text-xl text-white opacity-40 font-normal">
        Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
      </p>
    </section>
  );
}
