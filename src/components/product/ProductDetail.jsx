import React, { useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { PiShoppingBag } from "react-icons/pi";
import productData from "../../data/productData.json";

const { sizes: SIZES, editions: EDITIONS, colors: COLORS, stats: STATs, product } = productData;

const ProductDetail = () => {
  const [size, setSize] = useState("47 MM");
  const [edition, setEdition] = useState(EDITIONS[0]);
  const [color, setColor] = useState(COLORS[1].id);
  const [index, setIndex] = useState(0);

  // fallback generic gallery (kept for safety)
  const images = ["/watch-1.png", "/watch-2.png", "/watch-3.png"];

  // derive the active gallery from selected color
  const activeGallery = COLORS.find((c) => c.id === color)?.gallery || images;

  // reset index when color (gallery) changes
  React.useEffect(() => {
    setIndex(0);
  }, [color]);

  const prev = () =>
    setIndex((i) => (i - 1 + activeGallery.length) % activeGallery.length);
  const next = () => setIndex((i) => (i + 1) % activeGallery.length);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-[#061428] via-[#0d2740] to-[#071026] text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-0 py-16">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* left column */}
          <div className="col-span-12 lg:col-span-4">
            <h1 className="text-4xl md:text-5xl  leading-tight">{product.name}</h1>
            <p className="text-slate-300 mt-3 text-xl max-w-md opacity-40">
              {product.description}
            </p>

            <div className="mt-6">
              <div className="text-4xl font-semibold text-[#5695F5]">{product.price}</div>
            </div>

            <div className="mt-8">
              <div className="text-2xl text-white mb-2">Case Size</div>
              <div className="flex gap-3 text-lg ">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-full border w-[146px] h-[63px] ${
                      size === s ? "bg-white text-black  border-white/20" : "bg-transparent text-white/70 border-white/10"
                    } transition`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl text-white mb-2">Edition</div>
              <div className="flex gap-3">
                {EDITIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEdition(e)}
                    className={`px-4 py-2 rounded-full text-xl h-[64px]  border ${
                      edition === e ? "bg-white text-black border-white/20" : "bg-transparent text-white/70 border-white/10"
                    } transition`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="text-2xl text-white mb-2">Model Colors</div>
              <div className="flex items-center gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`w-32 h-32 rounded-lg p-2 bg-white/6 overflow-hidden border transition ${color === c.id ? "ring-2 ring-[#5695F5] border-white/20" : "border-white/10"}`}
                    aria-label={c.alt}
                  >
                    <img src={c.thumb} alt={c.alt} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4 items-center text-xl w-[400px]">
              <button className="px-8 h-16 py-3 w-2/3 bg-[#5695F5] rounded-full text-white font-medium shadow hover:bg-blue-500 transition">
                Buy Now
              </button>
              <button className="h-16 w-1/3 rounded-full border border-white/10 flex items-center justify-center">
                <PiShoppingBag className="w-10 h-10"/>
              </button>
            </div>
          </div>

          {/* center column (hero product) */}
          <div className="col-span-12 lg:col-span-4 relative flex items-center justify-center">
            <div className=" w-[400px] h-[600px] flex items-center justify-center">
              {/* center large image (follows selected color) */}
              <img
                src={activeGallery[index]}
                alt="watch"
                className="w-[400px] h-[600px] object-cover transform-gpu transition-transform duration-500"
              />

              {/* indicators */}
              <div className="absolute bottom-0 flex items-center gap-3 mt-6">
                {images.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === index ? "bg-[#5695F5]" : "bg-white/20"}`} />
                ))}
              </div>

              <div>
                {/* arrows */}
                <button onClick={prev} aria-label="previous" className="absolute left-[180px] -bottom-16 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <IoArrowBack />
                </button>
                <button onClick={next} aria-label="next" className="absolute right-[180px] -bottom-16 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <IoArrowForward />
                </button>
              </div>
              
            </div>
          </div>

          {/* right column (video + stats) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white/5   rounded-xl py-4 overflow-hidden border border-white/10">
              <div className="relative rounded-lg  h-[280px]">
                <img src={product.videoUrl} alt="video" className="w-full object-cover h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                    ▶
                  </div>
                </div>
              </div>
              
            </div>
            <h4 className="mt-4 text-white/90 text-2xl max-w-xs ">{product.videoTitle}</h4>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {STATs.map((s, i) => (
                <div key={i} className="">
                  <div className="text-4xl font-semibold text-[#5695F5]">{s.value}</div>
                  <div className="text-sm text-white/70 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;