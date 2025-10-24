import React from "react";

export default function StoryTeamSection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#23375a] via-[#23375a]  to-black">
      <div className="max-w-7xl mx-auto min-h-[700px] flex flex-col md:flex-row h-full">
        {/* Left: Card */}
        <div className="bg-[#23375a] w-full md:w-[60%] rounded-none flex flex-col justify-center p-6 md:py-12 md:pr-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            What’s new for Team?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 md:mb-8">
            Our team is a diverse group of thinkers, creators, and innovators dedicated to building a brighter future. At Ekuinox, we believe collaboration sparks the best ideas, and every member brings unique skills and perspectives to the table. Together, we tackle challenges, celebrate achievements, and drive progress—always striving to make a positive impact for our community and beyond. We prioritize transparency, continuous learning, and a culture where ideas are welcomed and nurtured. From product design to outreach initiatives, our team combines technical excellence with empathy to deliver solutions that are sustainable, inclusive, and user-centered. We're committed to mentorship, open collaboration, and measurable outcomes that create lasting value.
          </p>
          <button className="mt-2 px-6 py-3 bg-white text-black rounded-full font-medium shadow hover:bg-blue-100 transition w-fit">
            Learn More About Our Team
          </button>
        </div>
        {/* Right: Image */}
        <div className="flex items-center justify-center w-full md:w-[40%] bg-black min-h-[220px] md:min-h-0">
          <img
            src="/man.jpg"
            alt="Team Blue"
            className="w-full h-[700px] md:h-full object-cover rounded-b md:rounded-none"
          />
        </div>
      </div>
    </section>
  );
}
