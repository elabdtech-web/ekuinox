import { motion } from "framer-motion";

const Stat = ({ label, value }) => (
  <motion.div
    className="flex flex-col"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <span className="text-base text-white opacity-40">{label}</span>
    <span className="text-4xl font-bold text-[#5695F5]">{value}</span>
  </motion.div>
);

export default function StorySection() {
  return (
    <section className="w-full min-h-screen bg-[#070B13] overflow-hidden">
      <div className="px-6 lg:px-0 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-[1440px] mx-auto">
          {/* Left Text Column */}
          <motion.div
            className="relative lg:col-span-6  text-xl"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="absolute bg-white/50 top-0 w-[560px] h-[140px] overflow-hidden -z-10" />

            <motion.h2
              className="text-4xl lg:text-5xl font-medium text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our Short
              <br />
              Story
            </motion.h2>

            <motion.p
              className="mt-6 text-slate-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Ekuinox is a journey through space and time — a place where
              technology, design, and precision unite. As the Earth rotates
              beneath your fingertips, watch light chase darkness across
              continents, revealing the world’s cities in their true rhythm.
              Beyond just a visual, it’s an experience that captures every
              moment — from sunrise in Tokyo to midnight in New York — reminding
              us that time connects us all.
            </motion.p>

            <motion.p
              className="mt-4 text-slate-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              In the endless stretch of stars, time was never constant. On one
              distant planet, a single day lasted a thousand years; on another,
              centuries passed in a blink. Yet, in the middle of this cosmic
              dance, two souls—born light-years apart—shared the same heartbeat.
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-8 flex-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Stat label="Trusted by Travelers" value="120K" />
              <Stat label="Cities Connected" value="10K" />
              <Stat label="Precision Watches Sold" value="120K" />
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
            >
              <button className="px-6 py-2 bg-[#5695F5] text-white text-sm rounded-full shadow hover:bg-blue-500 transition">
                Learn more
              </button>
            </motion.div>
          </motion.div>

          {/* Right Collage Column */}
          <div className="lg:col-span-6">
            <div className="relative w-[700px] h-[840px] mx-auto">
              <img
                src="/watch.jpg"
                alt=""
                className="object-cover w-full h-full"
              />

              {/* Animated Tiles */}
              {[
                { className: "top-0 w-[560px] h-[140px]" },
                { className: "top-[140px] w-[140px] h-[280px]" },
                { className: "left-[140px] top-[420px] w-[140px] h-[140px]" },
                { className: "top-[560px] left-[280px] w-[140px] h-[140px]" },
                { className: "bottom-0 w-[140px] h-[280px]" },
                { className: "bottom-0 left-[140px] w-[140px] h-[140px]" },
                { className: "top-[140px] right-0 w-[140px] h-[140px]" },
                { className: "bottom-0 right-0 w-[280px] h-[140px]" },
              ].map((tile, index) => (
                <motion.div
                  key={index}
                  className={`absolute bg-[#070B13] ${tile.className}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Promo Hero Card */}
        <motion.div
          className="w-full px-4 max-w-4xl mx-auto mb-8 md:mb-12 mt-12 md:mt-36 h-auto md:h-44"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div
            className="relative rounded-2xl p-6 md:p-12 backdrop-blur-md overflow-hidden border border-white/20 bg-gradient-to-b from-white/5 to-white/2"
            style={{
              boxShadow:
                "inset 0 30px 60px rgba(0,0,0,0), inset 0 -18px 40px rgba(0,0,0,0), inset 0 0 120px rgba(78,163,255,0.06)",
            }}
          >
            {/* Top glow (scaled for small screens) */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none blur-3xl"
              style={{
                top: window && window.innerWidth < 640 ? "-3rem" : "-6rem",
                width: window && window.innerWidth < 640 ? "14rem" : "24rem",
                height: window && window.innerWidth < 640 ? "7rem" : "10rem",
                background: "#5695F5",
                borderRadius: "9999px",
                opacity: 0.9,
              }}
            />
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-black/10 to-transparent" />

            <div className="relative flex flex-col items-center text-center">
              <motion.img
                src="/e.svg"
                alt="Ekuinox"
                className="w-12 h-12 md:w-16 md:h-16"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />

              <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl font-medium pt-4 md:pt-6 text-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Own Your Moment in Time
              </motion.h3>

              <motion.p
                className="mt-2 md:mt-3 text-slate-300 text-sm md:text-base max-w-[420px] md:max-w-[500px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
              >
                Discover handcrafted watches inspired by the rhythm of the
                Earth. Precision, elegance, and timeless design await.
              </motion.p>

              <motion.button
                className="mt-4 md:mt-6 px-5 md:px-6 py-2.5 md:py-3 bg-[#5695F5] text-white rounded-full shadow hover:bg-blue-500 transition"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                viewport={{ once: true }}
              >
                BUY NOW
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="md:h-24 bg-[#0C1220]" />
    </section>
  );
}
