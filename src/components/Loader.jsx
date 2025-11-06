import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000); // 3000ms = 3s
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-r from-[#0f172a] to-[#06b6d4] transition-opacity duration-500">
      <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-wider animate-pulse">
        EKUINOX
      </h1>
    </div>
  );
};

export default Loader;
