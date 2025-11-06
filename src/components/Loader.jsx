import React, { useState, useEffect } from 'react';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 30000; // 30 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      const secondsLeft = Math.max(Math.ceil((duration - elapsed) / 1000), 0);

      setProgress(progressPercent);
      setTimeLeft(secondsLeft);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, 100); // Update every 100ms for smooth progress

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Animated lines coming from left */}
      <div className="absolute left-0 top-0 w-full h-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
            style={{
              top: `${15 + i * 10}%`,
              width: '100%',
              animation: `slideRight ${3 + i * 0.5}s infinite linear`,
              animationDelay: `${i * 0.3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Timer countdown in top-right corner */}
      <div className="absolute top-6 right-6 text-white/60 text-sm font-mono">
        {timeLeft}s
      </div>

      <div className="text-center relative z-10">
        {/* Main Website Name */}
        <div className="relative mb-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-wider mb-4 select-none">
            <span className="inline-block animate-colorChange">E</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.1s' }}>K</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.2s' }}>U</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.3s' }}>I</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.4s' }}>N</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.5s' }}>O</span>
            <span className="inline-block animate-colorChange" style={{ animationDelay: '0.6s' }}>X</span>
          </h1>

          {/* Globe/Earth icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Rotating outer ring */}
            <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-spin"
                 style={{ animationDuration: '8s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
            </div>

            {/* Counter-rotating inner ring */}
            <div className="absolute inset-2 border border-emerald-400/40 rounded-full animate-spin"
                 style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
            </div>

            {/* Globe center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">🌍</div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Website taglines with slide-in animation */}
        <div className="space-y-2 mb-6">
          <div className="text-white/80 text-lg font-light tracking-wide animate-slideInLeft">
            🕐 Track Time Across the Globe
          </div>
          <div className="text-white/70 text-base animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
            🌤️ Real-time Weather Updates
          </div>
          <div className="text-white/60 text-sm animate-slideInLeft" style={{ animationDelay: '1s' }}>
            🌍 Your Personal World Clock
          </div>
        </div>

        {/* Animated progress bar with real progress */}
        <div className="w-64 mx-auto mb-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {/* Progress percentage */}
          <div className="text-white/50 text-xs mt-2 font-mono">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Loading status messages that change over time */}
        <div className="mt-4 text-white/50 text-sm animate-pulse">
          {progress < 20 && "Initializing your global experience..."}
          {progress >= 20 && progress < 40 && "Loading world time zones..."}
          {progress >= 40 && progress < 60 && "Fetching weather data..."}
          {progress >= 60 && progress < 80 && "Preparing your globe..."}
          {progress >= 80 && progress < 95 && "Almost ready..."}
          {progress >= 95 && "Welcome to EKUINOX!"}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes colorChange {
            0% { color: #06b6d4; text-shadow: 0 0 20px #06b6d4; }
            16% { color: #10b981; text-shadow: 0 0 20px #10b981; }
            33% { color: #8b5cf6; text-shadow: 0 0 20px #8b5cf6; }
            50% { color: #f59e0b; text-shadow: 0 0 20px #f59e0b; }
            66% { color: #ef4444; text-shadow: 0 0 20px #ef4444; }
            83% { color: #ec4899; text-shadow: 0 0 20px #ec4899; }
            100% { color: #06b6d4; text-shadow: 0 0 20px #06b6d4; }
          }

          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }

          @keyframes slideInLeft {
            0% { 
              transform: translateX(-100px); 
              opacity: 0; 
            }
            100% { 
              transform: translateX(0); 
              opacity: 1; 
            }
          }

          .animate-colorChange {
            animation: colorChange 3s infinite ease-in-out;
          }

          .animate-slideInLeft {
            animation: slideInLeft 1s ease-out forwards;
            opacity: 0;
            transform: translateX(-100px);
          }
        `
      }} />
    </div>
  );
};

export default Loader;



