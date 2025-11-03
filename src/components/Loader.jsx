import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#34D073] to-[#1DA076] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Logo */}
        <div className="relative mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider mb-4 animate-pulse">
            EKUINOX
          </h1>

          {/* Watch-inspired rotating elements */}
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin"
                 style={{ animationDuration: '3s' }}>
            </div>

            {/* Inner ring */}
            <div className="absolute inset-2 border-2 border-white/60 rounded-full animate-spin"
                 style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>

            {/* Hour markers */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/80 rounded-full"
                  style={{
                    top: '8px',
                    left: '50%',
                    transformOrigin: '0px 56px',
                    transform: `rotate(${i * 30}deg) translateY(-48px)`
                  }}
                ></div>
              ))}
            </div>

            {/* Hour hand */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-0.5 bg-white origin-bottom"
                style={{
                  height: '24px',
                  transform: 'rotate(0deg)',
                  transition: 'transform 1s ease-in-out',
                  animation: 'tick 1s infinite ease-in-out'
                }}
              ></div>
            </div>

            {/* Minute hand */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-0.5 bg-white/70 origin-bottom"
                style={{
                  height: '32px',
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.8s ease-in-out',
                  animation: 'tick 0.8s infinite ease-in-out',
                  animationDelay: '0.2s'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-white/80 text-lg font-light tracking-wide animate-pulse">
          Crafting Luxury Timepieces
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes tick {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(6deg); }
          }
        `
      }} />
    </div>
  );
};

export default Loader;
