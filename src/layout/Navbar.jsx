import React, { useEffect, useState } from "react";
import { PiShoppingBag } from "react-icons/pi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    let timeoutId = null;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const shouldBeSticky = y > 100; // threshold
      if (shouldBeSticky && !isSticky) {
        setIsSticky(true);
        // allow DOM to apply fixed position then animate in
        timeoutId = setTimeout(() => setShowSticky(true), 20);
      } else if (!shouldBeSticky && isSticky) {
        // animate out then remove fixed
        setShowSticky(false);
        timeoutId = setTimeout(() => setIsSticky(false), 300);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSticky]);

  // compute classes and styles
  const baseClasses = "left-0 right-0 z-50 px-6 md:px-10 text-white";
  const positionClass = isSticky ? "fixed" : "absolute top-0";
  const bgClass = isSticky ? "bg-black/60 backdrop-blur-sm shadow-lg" : "bg-transparent";
  const transformStyle = isSticky ? (showSticky ? "translateY(0)" : "translateY(-100%)") : "translateY(0)";

  return (
    <header
      className={`${positionClass} ${baseClasses} ${bgClass}`}
      style={{ transform: transformStyle, transition: "transform 300ms ease" }}
    >
      <div className="flex items-center py-4 md:py-6 justify-between max-w-7xl mx-auto h-full">
        <div className="flex items-center gap-8 md:gap-16">
          <div className="text-2xl md:text-4xl font-semibold">EKUINOX</div>
          <nav className="hidden md:flex gap-8 md:gap-11 text-sm opacity-90">
            <Link to="/" className="hover:underline">
              HOME
            </Link>
            <Link to="/product" className="hover:underline">
              PRODUCT
            </Link>
            <Link to="/story" className="hover:underline">
              SHORT STORY
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-400 hidden md:block">Cart</p>
          <button aria-label="cart" className="">
            <PiShoppingBag size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
