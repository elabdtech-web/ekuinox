import React from "react";
import { motion } from "framer-motion";

export default function StoryTeamSection() {
  return (
    <section className="w-full bg-gradient-to-r from-[#23375a] via-[#23375a] to-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto min-h-[700px] flex flex-col md:flex-row h-full">
        {/* Left: Text & Button */}
        <motion.div
          className="bg-[#23375a] w-full md:w-[60%] rounded-none flex flex-col justify-center p-6 md:py-12 md:pr-6"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            What’s new for Team?
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/70 mb-6 md:mb-8 text-justify"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Our team is a diverse group of thinkers, creators, and innovators
            dedicated to building a brighter future. At Ekuinox, we believe
            collaboration sparks the best ideas, and every member brings unique
            skills and perspectives to the table. Together, we tackle
            challenges, celebrate achievements, and drive progress—always
            striving to make a positive impact for our community and beyond. We
            prioritize transparency, continuous learning, and a culture where
            ideas are welcomed and nurtured. From product design to outreach
            initiatives, our team combines technical excellence with empathy to
            deliver solutions that are sustainable, inclusive, and
            user-centered. We're committed to mentorship, open collaboration,
            and measurable outcomes that create lasting value.
          </motion.p>

          <motion.button
            className="mt-2 px-6 py-3 bg-white text-black rounded-full font-medium shadow hover:bg-blue-100 transition w-fit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More About Our Team
          </motion.button>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="flex items-center justify-center w-full md:w-[40%] bg-black min-h-[220px] md:min-h-0"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.img
            src="/man.jpg"
            alt="Team Blue"
            className="w-full h-[700px] md:h-full object-cover rounded-b md:rounded-none"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
