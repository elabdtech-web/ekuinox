

const FEATURES = [
  {
    id: 1,
    title: "Long Battery Life with Solar Charging",
    desc: "Precision-crafted watches that embody the perfect fusion of astronomical inspiration and design.",
    img: "/watch-2.png",
  },
  {
    id: 2,
    title: "Accurate Timekeeping",
    desc: "IANA tzdb + luxon powered local times with DST-aware calculations.",
    img: "/watch-2.png",
  },
  {
    id: 3,
    title: "Premium Materials",
    desc: "Sapphire crystal, titanium cases and engineered straps for longevity.",
    img: "/watch-2.png",
  },
  {
    id: 4,
    title: "Water Resistance",
    desc: "Designed and tested for adventurous lifestyles.",
    img: "/watch-2.png",
  },
  {
    id: 5,
    title: "Smart Notifications",
    desc: "Sync with your phone to get timely alerts and activity insights.",
    img: "/watch-2.png",
  },
  {
    id: 6,
    title: "Customizable Faces",
    desc: "Multiple watchfaces and complications to match your day.",
    img: "/watch-2.png",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full min-h-screen relative bg-[#070B13]">
      {/* hero background image */}
      <div className="relative w-full h-[130vh] rounded-xl overflow-hidden mb-12">
        <img
          src="/feature-hero.png"
          alt="feature hero"
          className="w-full h-full object-full brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B13] via-transparent to-black/20" />
        <div className="absolute inset-0 flex items-end mb-18 justify-center pointer-events-none">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white">Features</h2>
        </div>
      </div>

      {/* features grid */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 lg:px-0 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <article
              key={f.id}
              className="bg-white/3 rounded-2xl p-6 min-h-[220px] flex flex-col gap-4 hover:translate-y-[-6px] hover:shadow-lg transition transform-gpu"
            >
              <div className="flex items-center gap-4">
                <div className="w-full h-80 rounded-lg  flex items-center justify-center overflow-hidden p-2">
                  <img src={f.img} alt={f.title} className="w-full h-full object-contain" />
                </div>
              </div>
              <h3 className="text-4xl text-white">{f.title}</h3>
              <p className="text-base opacity-40 text-slate-300 flex-1">{f.desc}</p>

              
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
