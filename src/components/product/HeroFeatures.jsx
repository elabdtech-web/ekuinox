import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"; // Add useMotionValue, useSpring
import { MdGpsFixed } from "react-icons/md";
import {
  PiBatteryChargingVerticalFill,
  PiFlashlightFill,
  PiHeartbeatFill,
  PiSneakerMoveFill,
  PiSolarPanelFill,
} from "react-icons/pi";
import heroFeaturesData from "../../data/heroFeaturesData.json";

// Icon mapping (unchanged)
const iconMap = {
  PiSolarPanelFill: <PiSolarPanelFill size={58} />,
  PiBatteryChargingVerticalFill: <PiBatteryChargingVerticalFill size={58} />,
  PiFlashlightFill: <PiFlashlightFill size={58} />,
  PiSneakerMoveFill: <PiSneakerMoveFill size={58} />,
  PiHeartbeatFill: <PiHeartbeatFill size={58} />,
  MdGpsFixed: <MdGpsFixed size={58} />,
};

const FEATURES = heroFeaturesData.features.map((f) => ({
  ...f,
  icon: iconMap[f.iconName],
}));

const HeroFeatures = () => {
  // Scroll-based parallax: track scroll progress and transform y position
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -50]); // Cards move up slightly as you scroll down

  return (
    <section className="w-full relative bg-[#070B13] text-white">
      <div className="relative w-full rounded-xl overflow-hidden mb-12">
        {/* Hero Image (unchanged) */}
        <img
          src={heroFeaturesData.heroImage}
          alt="hero"
          className="w-full object-cover transform-gpu"
        />

        {/* Overlay Content (unchanged) */}
        <div className="absolute inset-0 space-y-6 flex flex-col items-center justify-end text-center bg-gradient-to-t from-[#070B13] to-[#070B13]/20 px-6 pb-10">
          {/* Features Grid */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 mt-6 w-full">
            <div className="flex text-center flex-col items-center mb-4 max-w-3xl mx-auto">
              <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white/90 font-medium">
                {heroFeaturesData.subtitle}
              </div>
              <p className="mt-4 max-w-3xl text-sm sm:text-base md:text-lg text-white/60">
                {heroFeaturesData.description}
              </p>
            </div>
            <div className="bg-transparent rounded-xl p-4 sm:p-6">
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 lg:gap-10 items-stretch divide-y divide-white/6 lg:divide-y-0 lg:divide-x lg:divide-white/6"
                style={{ y: yOffset }} // Apply parallax to the entire grid
              >
                {FEATURES.map((f, index) => (
                  <motion.div
                    key={f.id}
                    className="p-2"
                    initial={{ opacity: 0, y: -100, scale: 0.8 }} // Start from above, small scale
                    whileInView={{ opacity: 1, y: 0, scale: 1 }} // Drop to position with full scale
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15, // Stagger delay for raindrop effect
                      type: "spring",
                      stiffness: 100, // Bounce effect
                      damping: 10,
                    }}
                    viewport={{ once: false, amount: 0.3 }} // Re-trigger on scroll up/down
                  >
                    <div className="px-2 py-3 md:px-4 md:py-6 flex flex-col items-center text-center h-full">
                      {/* 3D Hover Container with Mouse Tracking */}
                      <Icon3DTilt
                        icon={React.cloneElement(f.icon, {
                          size:
                            window.innerWidth < 640
                              ? 40
                              : window.innerWidth < 1024
                                ? 52
                                : 56,
                        })}
                      />
                      <div className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-white/90 leading-snug whitespace-pre-line">
                        {f.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar (unchanged) */}
      <div className="h-10 bg-[#0C1220]" />
    </section>
  );
};

// Separate Component for 3D Tilt Icon
const Icon3DTilt = ({ icon }) => {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth the rotation with spring
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Map mouse position to rotation (adjust sensitivity with multiplier)
    const rotateYValue = (deltaX / (rect.width / 2)) * 15; // Max 15 degrees
    const rotateXValue = -(deltaY / (rect.height / 2)) * 15; // Max 15 degrees

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-lg flex items-center justify-center text-[#5695F5] transform-gpu cursor-pointer"
      style={{
        perspective: "1000px",
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: 1,
        z: 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 20px 40px rgba(86, 149, 245, 0.3)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {icon}
    </motion.div>
  );
};

export default HeroFeatures;




