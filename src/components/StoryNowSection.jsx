import { motion } from "framer-motion";
const StoryNowSection = () => {
  return (
    <section className="relative w-full px-4 bg-[#070B13] overflow-x-hidden">
      <div className="relative max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 h-full md:h-[100vh] gap-8 items-center overflow-hidden">
        <div className="hidden sm:block absolute inset-0 -top-20 md:top-0 bg-gradient-to-r h-full z-50 right-0 from-transparent to-[#070B13]/90 " />
        {/* LEFT SIDE — Text Section */}
        <motion.div
          className="relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.25 }}
        >
          {/* Heading */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-medium text-white mb-6"
          >
            Where we are <span className="text-[#6ea9ff]">now</span>
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-white opacity-40 leading-relaxed"
          >
            Today, Ekuinox stands at the forefront of innovation, bringing
            together passionate minds to solve real-world challenges. Our team
            is dedicated to building impactful solutions, fostering creativity,
            and driving progress in everything we do. As we grow, our commitment
            to collaboration and excellence remains stronger than ever—
            empowering our community and shaping the future, one idea at a time.
          </motion.p>
        </motion.div>

        {/* RIGHT SIDE — Image Section */}
        <motion.div
          className="flex sm:relative justify-end mt-16 md:mt-0 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, x: 80 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full max-w-[600px] md:mb-36 h-full md:h-[55vh]">
            {/* Large screens: Rotated image */}
            <img
              src="/story-now.jpg"
              alt="Team working"
              className="hidden sm:block absolute -right-50 top-0 w-full h-full object-cover"
              style={{
                transform: "rotate(-30deg) scale(1.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            />

            {/* Small screens: Normal image */}
            <img
              src="/story-now.jpg"
              alt="Team working"
              className="block sm:hidden w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoryNowSection;