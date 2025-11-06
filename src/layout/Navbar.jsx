import React, { useEffect, useState, useRef } from "react";
import { PiDotsSixLight, PiShoppingBag } from "react-icons/pi";
import { FiSettings, FiMenu, FiX, FiUser } from "react-icons/fi"; // + add FiMenu, FiX, FiUser
import { Link, useLocation } from "react-router-dom";
import Cart from "../common/Cart";
import Setting from "../common/Setting";
import MyCities from "../common/MyCities";
import { useProductCart } from "../context/ProductCartContext";
import { RiShoppingBagLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [isCitiesVisible, setIsCitiesVisible] = useState(false);
  const [citiesBox, setCitiesBox] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false); // + mobile menu state

  const { items, isCartOpen, openCart, closeCart } = useProductCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartRef = useRef(null);
  const settingsRef = useRef(null);
  const citiesRef = useRef(null);
  const citiesPanelRef = useRef(null);
  const location = useLocation();
  const showNav = ["/product", "/story"].some((p) =>
    location.pathname.startsWith(p)
  );

  // Sticky navbar behavior
  useEffect(() => {
    let timeoutId = null;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      const shouldBeSticky = y > 100;
      if (shouldBeSticky && !isSticky) {
        setIsSticky(true);
        timeoutId = setTimeout(() => setShowSticky(true), 20);
      } else if (!shouldBeSticky && isSticky) {
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

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCartOpen &&
        cartRef.current &&
        !cartRef.current.contains(event.target)
      )
        if (
          isSettingsOpen &&
          settingsRef.current &&
          !settingsRef.current.contains(event.target)
        )
          if (
            isCitiesOpen &&
            citiesRef.current &&
            !citiesRef.current.contains(event.target)
          ) {
            setIsCitiesOpen(false);
          }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, isSettingsOpen, isCitiesOpen]);

  // Settings animation visibility
  useEffect(() => {
    if (isSettingsOpen) setIsSettingsVisible(true);
    else {
      const timeout = setTimeout(() => setIsSettingsVisible(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isSettingsOpen]);

  // Cities animation visibility
  useEffect(() => {
    if (isCitiesOpen) setIsCitiesVisible(true);
    else {
      const timeout = setTimeout(() => setIsCitiesVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isCitiesOpen]);

  // compute rect of the button and keep panel sized/aligned to it
  const updateCitiesBox = () => {
    const btn = citiesRef.current?.querySelector("button");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setCitiesBox({
      top: Math.round(r.bottom + window.scrollY + 8), // place below the button with small gap
      right: Math.round(window.innerWidth - r.right),
      width: Math.round(r.width),
    });
  };

  // measure when opening + on resize/scroll
  useEffect(() => {
    if (isCitiesOpen) {
      // show then measure on next frame
      requestAnimationFrame(updateCitiesBox);
      const onResize = () => updateCitiesBox();
      window.addEventListener("resize", onResize);
      window.addEventListener("scroll", onResize, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onResize);
      };
    }
    return undefined;
  }, [isCitiesOpen]);

  // Sticky navbar styles — always fixed to avoid layout jumps
  const baseClasses = "w-full z-[90] px-6 md:px-10 text-white";
  const positionClass = "fixed top-0 left-0 right-0";
  const bgClass = isSticky ? "bg-[#293A5180] backdrop-blur-sm shadow-lg" : "bg-transparent";
  const transformStyle = isSticky
    ? showSticky
      ? "translateY(0)"
      : "translateY(-100%)"
    : "translateY(0)";

  // lower threshold so navbar becomes sticky sooner (adjust as needed)
  return (
    <header
      className={`${positionClass} ${baseClasses} ${bgClass}`}
      style={{
        transform: transformStyle,
        transition: "transform 300ms ease",
        // expose navbar height variable for .page-content padding
        "--navbar-height": "56px",
      }}
    >
      <div className="flex items-center py-4 md:px-0 justify-between max-w-[1440px] mx-auto h-full">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-16">
          <div className="text-2xl md:text-4xl font-semibold">EKUINOX</div>

          {/* Desktop links: only show on /product or /story */}
          {showNav && (
            <nav className="hidden md:flex gap-8 md:gap-8 text-sm opacity-90">
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
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Auth buttons (desktop) */}
                  <div className="hidden md:flex items-center gap-2">
                    {!isAuthenticated ? (
                      <Link
                        to="/login"
                        className="h-10 w-10 rounded-lg border border-white/10 bg-[#293A5180] text-white flex items-center justify-center hover:bg-white/10 transition"
                        aria-label="Login"
                        title="Login"
                      >
                        <FiUser size={18} />
                      </Link>
                    ) : (
                      <>
                        <span className="text-white/80 text-sm hidden lg:inline">{user?.name || user?.email}</span>
                        <button
                          onClick={logout}
                          className="px-3 h-10 flex items-center rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/15 transition"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
          {/* Cart Icon (always visible) */}
          <div className="flex gap-2 items-center justify-center py-1.5" ref={cartRef}>
            <p className="text-base  text-gray-500 hidden md:block">Cart</p>
            <div className="relative">
              <button
                aria-label="cart"
                onClick={openCart}
                className="hover:opacity-80 flex transition"
              >
                <PiShoppingBag size={24} />
              </button>
              {items.length > 0 && (
                <span className="absolute -top-0 -right-0 h-2 w-2 rounded-full bg-[#5695F5]" />
              )}
            </div>
          </div>

          {/* Settings (always visible) */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              aria-label="settings"
              onClick={() => setIsSettingsOpen((v) => !v)}
              className={`h-10 w-12 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-black/20 flex items-center justify-center transition ${
                isSettingsOpen ? "" : "bg-[#293A5180]  hover:bg-white/10"
              }`}
            >
              <FiSettings
                size={18}
                className={isSettingsOpen ? "text-[#5695F5]" : "text-white"}
              />
            </button>

            {isSettingsVisible && (
              <div
                className={`absolute -left-2 top-14 z-[60] transition-all duration-300 ${
                  isSettingsOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ transitionProperty: "opacity, transform" }}
              >
                <Setting />
              </div>
            )}
          </div>

          {/* Hamburger menu icon (mobile only, now on right) */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-white/10 bg-[#293A5180] text-white"
          >
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          {/* MY CITIES (hidden on small screens) */}
          <div className="hidden md:inline-block relative" ref={citiesRef}>
            {/* ...MY CITIES button and panel code... */}
            <button
              onClick={() => setIsCitiesOpen((v) => !v)}
              className={`flex items-center h-12 px-4 min-w-sm rounded-t-xl bg-[#293A5180] border border-white/10 backdrop-blur-md shadow-inner transition ${
                isCitiesOpen ? "rounded-b-none" : "rounded-b-xl"
              }`}
            >
              <span className="text-sm md:text-lg tracking-wide text-white/90 flex-1 text-left">
                MY CITIES
              </span>
              {isCitiesOpen ? (
                <svg
                  width="28"
                  height="18"
                  viewBox="0 0 28 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle opacity="0.1" cx="2" cy="2" r="2" fill="white" />
                  <circle cx="2" cy="16" r="2" fill="white" />
                  <circle cx="14" cy="2" r="2" fill="white" />
                  <circle opacity="0.1" cx="14" cy="16" r="2" fill="white" />
                  <circle opacity="0.1" cx="26" cy="2" r="2" fill="white" />
                  <circle cx="26" cy="16" r="2" fill="white" />
                </svg>
              ) : (
                <div className="ml-auto h-8 w-10 flex items-center justify-center">
                  <PiDotsSixLight size={40} className="text-white/70" />
                </div>
              )}
            </button>
            {isCitiesVisible && (
              <>
                <div
                  className={`fixed inset-0 z-[58] transition-opacity duration-300 ${
                    isCitiesOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsCitiesOpen(false)}
                />
                <div
                  ref={citiesPanelRef}
                  className={`z-[60] transition-all duration-300 ease-out ${
                    isCitiesOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  style={
                    citiesBox
                      ? {
                          top: citiesBox.top + "px",
                          right: citiesBox.right + "px",
                          width: Math.max(290, citiesBox.width) + "px",
                        }
                      : undefined
                  }
                >
                  <div
                    className={`transition-all duration-400 delay-100 ease-out overflow-hidden ${
                      isCitiesOpen ? "opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <MyCities />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu (links only) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-2 pb-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            HOME
          </Link>
          <Link
            to="/product"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            PRODUCT
          </Link>
          <Link
            to="/story"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            SHORT STORY
          </Link>
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg bg_white/5 border border-white/10 text-white"
            >
              LOGIN
            </Link>
          ) : (
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            >
              LOGOUT
            </button>
          )}
        </nav>
      </div>

      <Cart open={isCartOpen} onClose={closeCart} />
    </header>
  );
};

export default Navbar;
