import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { PiShoppingBag } from "react-icons/pi";
import productData from "../../data/productData.json";

const {
  sizes: SIZES,
  editions: EDITIONS,
  colors: COLORS,
  stats: STATs,
  product,
} = productData;

const ProductDetail = () => {
  const [size, setSize] = useState("47 MM");
  const [edition, setEdition] = useState(EDITIONS[0]);
  const [color, setColor] = useState(COLORS[1].id);
  const [index, setIndex] = useState(0);

  const images = ["/watch-1.png", "/watch-2.png", "/watch-3.png"];
  const activeGallery = COLORS.find((c) => c.id === color)?.gallery || images;

  useEffect(() => {
    setIndex(0);
  }, [color]);

  const prev = () =>
    setIndex((i) => (i - 1 + activeGallery.length) % activeGallery.length);
  const next = () => setIndex((i) => (i + 1) % activeGallery.length);

  return (
    <section className="min-h-screen py-12 bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-0 py-16">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-4"
          >
            <h1 className="text-4xl md:text-5xl leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-300 mt-3 text-xl max-w-md opacity-40">
              {product.description}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <div className="text-4xl font-semibold text-[#5695F5]">
                {product.price}
              </div>
            </motion.div>

            {/* Case Size */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="text-2xl text-white mb-2">Case Size</div>
              <div className="flex flex-wrap gap-3 text-lg">
                {SIZES.map((s, i) => (
                  <motion.button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-full border w-[140px] h-[56px] transition ${
                      size === s
                        ? "bg-white text-black border-white/20"
                        : "bg-transparent text-white/70 border-white/10"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Edition */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <div className="text-2xl text-white mb-2">Edition</div>
              <div className="flex flex-wrap gap-3">
                {EDITIONS.map((e, i) => (
                  <motion.button
                    key={e}
                    onClick={() => setEdition(e)}
                    className={`px-4 py-2 rounded-full text-xl h-[56px] border transition ${
                      edition === e
                        ? "bg-white text-black border-white/20"
                        : "bg-transparent text-white/70 border-white/10"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {e}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Colors */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <div className="text-2xl text-white mb-2">Model Colors</div>
              <div className="flex flex-wrap items-center gap-3">
                {COLORS.map((c, i) => (
                  <motion.button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`w-28 h-28 rounded-lg p-2 bg-white/6 overflow-hidden border transition ${
                      color === c.id
                        ? "ring-2 ring-[#5695F5] border-white/20"
                        : "border-white/10"
                    }`}
                    aria-label={c.alt}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + i * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <img
                      src={c.thumb}
                      alt={c.alt}
                      className="object-cover w-full h-full"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-8 flex gap-4 items-center text-xl w-full sm:w-[400px]"
            >
              <button className="px-8 h-16 w-2/3 bg-[#5695F5] rounded-full text-white font-medium shadow hover:bg-blue-500 transition">
                Buy Now
              </button>
              <button className="h-16 w-1/3 rounded-full border border-white/10 flex items-center justify-center">
                <PiShoppingBag className="w-10 h-10" />
              </button>
            </motion.div>
          </motion.div>

          {/* Center product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-4 relative flex items-center justify-center"
          >
            <div className="w-[280px] sm:w-[400px] h-[400px] sm:h-[600px] flex items-center justify-center">
              <img
                src={activeGallery[index]}
                alt="watch"
                className="w-full h-full object-cover transform-gpu transition-transform duration-500 rounded-lg"
              />

              {/* Indicators */}
              <div className="absolute bottom-0 flex items-center gap-3 mt-6">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === index ? "bg-[#5695F5]" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <button
                onClick={prev}
                aria-label="previous"
                className="absolute left-[100px] sm:left-[160px] -bottom-16 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
              >
                <IoArrowBack />
              </button>
              <button
                onClick={next}
                aria-label="next"
                className="absolute right-[100px] sm:right-[160px] -bottom-16 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
              >
                <IoArrowForward />
              </button>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="col-span-12 lg:col-span-4"
          >
            <div className="bg-white/5 rounded-xl py-4 overflow-hidden border border-white/10">
              <div className="relative rounded-lg h-[220px] sm:h-[280px]">
                <img
                  src={product.videoUrl}
                  alt="video"
                  className="w-full object-cover h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                    ▶
                  </div>
                </div>
              </div>
            </div>

            <motion.h4
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-4 text-white/90 text-2xl max-w-xs"
            >
              {product.videoTitle}
            </motion.h4>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {STATs.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-semibold text-[#5695F5]">
                    {s.value}
                  </div>
                  <div className="text-sm text-white/70 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
