import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [visible, setVisible] = useState(true);
  const [headingColor, setHeadingColor] = useState('#ffffff');

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3500);
    const h = setTimeout(() => setHeadingColor('#FFD166'), 1500);

    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-700"
      style={{
        background: 'radial-gradient(circle at 30% 30%, #0f172a, #020617 70%)',
        overflow: 'hidden',
      }}
    >
      {/* Pulsing sun/moon background */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl bg-gradient-to-br from-cyan-400/20 to-yellow-200/10 animate-pulse-slow" />

      {/* Watch dial ring */}
      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-10">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-cyan-300/30 animate-spin-slow" />

        {/* Minute marks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[10px] bg-cyan-200/40 origin-bottom"
            style={{ transform: `rotate(${i * 6}deg) translateY(-125px)` }}
          />
        ))}

        {/* Hour hand */}
        <div className="absolute w-[3px] h-[50px] bg-yellow-400 origin-bottom rounded-full animate-hour-hand" />
        {/* Minute hand */}
        <div className="absolute w-[2px] h-[70px] bg-sky-400 origin-bottom rounded-full animate-minute-hand" />
        {/* Center pivot */}
        <div className="absolute w-4 h-4 bg-cyan-300 rounded-full border border-white/30 shadow-lg" />

        {/* Brand name in center */}
        <h1
          className="absolute text-4xl md:text-6xl font-extrabold tracking-widest"
          style={{
            color: headingColor,
            transition: 'color 800ms ease',
            textShadow: '0 0 12px rgba(255,255,255,0.2)',
          }}
        >
          EKUINOX
        </h1>
      </div>

      {/* Tagline */}
      <div className="text-sm uppercase tracking-[0.3em] text-white/60 font-light">
        Measuring Every Moment
      </div>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes hour-hand {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes minute-hand {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(4320deg); } /* 12x faster */
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        .animate-hour-hand {
          animation: hour-hand 20s linear infinite;
        }
        .animate-minute-hand {
          animation: minute-hand 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
