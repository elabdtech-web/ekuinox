import React from "react";

export default function StoryTeamSection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#23375a] via-[#23375a]  to-black">
      <div className="max-w-7xl mx-auto min-h-[700px] flex flex-col md:flex-row h-full">
        {/* Left: Card */}
        <div className="bg-[#23375a] w-full md:w-[60%] rounded-none flex flex-col justify-center p-6 md:py-12 md:pr-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            What’s new for team.blue?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 md:mb-8">
            Korem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
            Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
            lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
            elementum tellus.
          </p>
          <button className="mt-2 px-6 py-3 bg-white text-black rounded-full font-medium shadow hover:bg-blue-100 transition w-fit">
            More Team Blue News
          </button>
        </div>
        {/* Right: Image */}
        <div className="flex items-center justify-center w-full md:w-[40%] bg-black min-h-[220px] md:min-h-0">
          <img
            src="/team.jpg"
            alt="Team Blue"
            className="w-full h-[700px] md:h-full object-cover rounded-b md:rounded-none"
          />
        </div>
      </div>
    </section>
  );
}
