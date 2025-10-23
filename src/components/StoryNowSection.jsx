import React from "react";

export default function StoryNowSection() {
  return (
    <section className="relative w-full  px-4 bg-[#070B13] ">
      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 h-full md:h-[100vh] gap-8 items-center overflow-hidden">
        <div
          className="hidden sm:block absolute inset-0 -top-20 md:top-0 bg-gradient-to-r h-full z-50 right-0 from-transparent to-[#070B13]/90 "
        />
        {/* Left: Headline and paragraph */}
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where we are <span className="text-[#6ea9ff]">now</span>
          </h2>
          <p className="text-lg md:text-xl text-white opacity-40 leading-relaxed">
            Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
          </p>
        </div>
        {/* Right: Rotated image */}
        <div className="flex sm:relative justify-end mt-16 md:mt-0 items-center">
          <div
            className="hidden sm:absolute inset-0 -top-20 md:top-0 bg-gradient-to-r h-full  z-50 right-0 from-transparent to-[#070B13] "

          />
          <div className="relative w-full max-w-[600px] h-full md:h-[90vh]">
            
            {/* Large screens: Rotated, offset image */}
            <img
              src="/story-now.jpg"
              alt="Team working"
              className="hidden sm:block absolute -right-56 top-0 w-full h-full object-cover"
              style={{
                transform: "rotate(-30deg) scale(1.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                opacity: 0.95,
              }}
            />

            {/* Small screens: Normal image, full width */}
            <img
              src="/story-now.jpg"
              alt="Team working"
              className="block sm:hidden w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}