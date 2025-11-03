import React from "react";
import { motion } from "framer-motion";
import featuresData from "../../data/featuresData.json";
import Loader from "../Loader";

const { heroImage, heroTitle } = featuresData;

const FeaturesSection = ({ features, loading }) => {



  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#070B13]">
        <Loader />
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen relative bg-[#070B13]">
      {/* hero background image */}
      <div className="relative w-full h-[60vh] md:h-[130vh] rounded-xl overflow-hidden mb-12">
        <img
          src={heroImage}
          alt="feature hero"
          className="w-full h-[60vh] md:h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B13] via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-end mb-18 justify-center pointer-events-none">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white"
          >
            {heroTitle}
          </motion.h2>
        </div>
      </div>

      {/* features grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 lg:px-0">
        {(!features || features.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No features available</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(features || []).map((f, index) => (
                <motion.article
                key={f.id || f._id || index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2, // animation stagger
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-white/3 rounded-2xl p-6 min-h-[220px] flex flex-col gap-4 hover:translate-y-[-6px] hover:shadow-lg transition transform-gpu"
              >
                <div className="flex items-center gap-4">
                  <div className="w-full h-80 rounded-lg flex items-center justify-center overflow-hidden p-2">
                    <img
                      src={f.image || f.img || '/feature-default.png'}
                      alt={f.title || f.name || 'Feature'}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-4xl text-white">{f.title || f.name || 'Feature Title'}</h3>
                <p className="text-base opacity-40 text-slate-300 flex-1">
                  {f.description || 'Feature description'}
                </p>
              </motion.article>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
