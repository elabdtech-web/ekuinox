import React from "react";

export default function StoryStartedSection() {
  return (
    <section className="relative w-full py-16 min-h-[780px] flex items-center px-4 bg-[#070B13]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Headline and paragraph */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            We’re just getting <span className="text-[#5695F5]">started</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed">
            Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
          </p>
        </div>
        {/* Right: Dot world map */}
        <div className="flex justify-end items-center">
          <img
            src="/dot-world.svg"
            alt="World map"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}