// import React, { useEffect, useState, useRef } from "react";
// import { PiDotsSixLight, PiShoppingBag } from "react-icons/pi";
// import { FiSettings } from "react-icons/fi";
// import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { Link } from "react-router-dom";

// import { DateTime } from "luxon";
// import Cart from "../common/Cart";
// import Setting from "../common/Setting";
// import MyCities from "../common/MyCities";
// import { useProductCart } from "../context/ProductCartContext";

// const Navbar = () => {
//   const [isSticky, setIsSticky] = useState(false);
//   const [showSticky, setShowSticky] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isSettingsVisible, setIsSettingsVisible] = useState(false);
//   const [isCitiesOpen, setIsCitiesOpen] = useState(false);
//   const [isCitiesVisible, setIsCitiesVisible] = useState(false);
//   // Computed from the MY CITIES button when opened
//   const [citiesBox, setCitiesBox] = useState(null);

//   const { items } = useProductCart();
//   const cartRef = useRef(null);
//   const settingsRef = useRef(null);
//   const citiesRef = useRef(null);
//   const citiesPanelRef = useRef(null); // <- add

//   useEffect(() => {
//     let timeoutId = null;
//     const onScroll = () => {
//       const y = window.scrollY || window.pageYOffset;
//       const shouldBeSticky = y > 100; // threshold
//       if (shouldBeSticky && !isSticky) {
//         setIsSticky(true);
//         // allow DOM to apply fixed position then animate in
//         timeoutId = setTimeout(() => setShowSticky(true), 20);
//       } else if (!shouldBeSticky && isSticky) {
//         // animate out then remove fixed
//         setShowSticky(false);
//         timeoutId = setTimeout(() => setIsSticky(false), 300);
//       }
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       if (timeoutId) clearTimeout(timeoutId);
//     };
//   }, [isSticky]);

//   // Close popovers when clicking outside (only if they're open)
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isCartOpen &&
//         cartRef.current &&
//         !cartRef.current.contains(event.target)
//       ) {
//         setIsCartOpen(false);
//       }
//       if (
//         isSettingsOpen &&
//         settingsRef.current &&
//         !settingsRef.current.contains(event.target)
//       ) {
//         setIsSettingsOpen(false);
//       }
//       if (
//         isCitiesOpen &&
//         citiesRef.current &&
//         !citiesRef.current.contains(event.target)
//       ) {
//         setIsCitiesOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isCartOpen, isSettingsOpen, isCitiesOpen]);

//   // Settings animation
//   useEffect(() => {
//     if (isSettingsOpen) setIsSettingsVisible(true);
//     else {
//       const timeout = setTimeout(() => setIsSettingsVisible(false), 250);
//       return () => clearTimeout(timeout);
//     }
//   }, [isSettingsOpen]);

//   // compute rect of the button and keep panel sized/aligned to it
//   const updateCitiesBox = () => {
//     const btn = citiesRef.current?.querySelector("button");
//     if (!btn) return;
//     const r = btn.getBoundingClientRect();
//     setCitiesBox({
//       top: Math.round(r.top + window.scrollY), // overlay the button from the top
//       right: Math.round(window.innerWidth - r.right),
//       width: Math.round(r.width),
//     });
//   };

//   // Cities animation + measure on open
//   useEffect(() => {
//     if (isCitiesOpen) {
//       setIsCitiesVisible(true);
//       // wait a frame so the button is laid out, then measure
//       requestAnimationFrame(updateCitiesBox);
//       const onResize = () => updateCitiesBox();
//       window.addEventListener("resize", onResize);
//       window.addEventListener("scroll", onResize, { passive: true });
//       return () => {
//         window.removeEventListener("resize", onResize);
//         window.removeEventListener("scroll", onResize);
//       };
//     } else {
//       const t = setTimeout(() => setIsCitiesVisible(false), 300);
//       return () => clearTimeout(t);
//     }
//   }, [isCitiesOpen]);

//   // Close on outside click (ignore clicks inside panel)
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!isCitiesOpen) return;
//       const inButton = citiesRef.current?.contains(e.target);
//       const inPanel = citiesPanelRef.current?.contains(e.target);
//       if (!inButton && !inPanel) setIsCitiesOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isCitiesOpen]);

//   // compute classes and styles
//   const baseClasses = "left-0 right-0 z-50 px-6 md:px-10 text-white";
//   const positionClass = isSticky ? "fixed" : "absolute top-0";
//   const bgClass = isSticky
//     ? "bg-black/60 backdrop-blur-sm shadow-lg"
//     : "bg-transparent";
//   const transformStyle = isSticky
//     ? showSticky
//       ? "translateY(0)"
//       : "translateY(-100%)"
//     : "translateY(0)";

//   return (
//     <header
//       className={`${positionClass} ${baseClasses} ${bgClass}`}
//       style={{ transform: transformStyle, transition: "transform 300ms ease" }}
//     >
//       <div className="flex items-center py-4 md:py-6 justify-between max-w-7xl mx-auto h-full">
//         <div className="flex items-center gap-8 md:gap-16">
//           <div className="text-2xl md:text-4xl font-semibold">EKUINOX</div>
//           <nav className="hidden md:flex gap-8 md:gap-11 text-sm opacity-90">
//             <Link
//               to="/"
//               className="hover:underline"
//               onClick={() => {
//                 setIsCartOpen(false);
//                 setIsSettingsOpen(false);
//               }}
//             >
//               HOME
//             </Link>
//             <Link
//               to="/product"
//               className="hover:underline"
//               onClick={() => {
//                 setIsCartOpen(false);
//                 setIsSettingsOpen(false);
//               }}
//             >
//               PRODUCT
//             </Link>
//             <Link
//               to="/story"
//               className="hover:underline"
//               onClick={() => {
//                 setIsCartOpen(false);
//                 setIsSettingsOpen(false);
//               }}
//             >
//               SHORT STORY
//             </Link>
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Cart icon with blue dot */}
//           <div className="flex gap-2 items-center" ref={cartRef}>
//             <p className="text-xs text-gray-500 hidden md:block">Cart</p>
//             <div className="relative">
//               <button
//                 aria-label="cart"
//                 onClick={() => setIsCartOpen(true)}
//                 className="hover:opacity-80 transition"
//               >
//                 <PiShoppingBag size={24} />
//               </button>
//               {/* Blue dot if cart has items */}
//               {items.length > 0 && (
//                 <span className="absolute -top-0 -right-0 h-2 w-2 rounded-full bg-[#5695F5] " />
//               )}
//             </div>
//           </div>

//           {/* Settings button + popover */}
//           <div className="relative" ref={settingsRef}>
//             <button
//               type="button"
//               aria-label="settings"
//               onClick={() => setIsSettingsOpen((v) => !v)}
//               className={`h-10 w-12 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-black/20 flex items-center justify-center transition
//       ${isSettingsOpen ? "" : "bg-[#182434] hover:bg-white/10"}`}
//             >
//               <FiSettings
//                 size={18}
//                 className={isSettingsOpen ? "text-[#5695F5]" : "text-white"}
//               />
//             </button>

//             {isSettingsVisible && (
//               <div
//                 className={`
//         absolute -left-2 top-14 z-[60]
//         transition-all duration-300
//         ${
//           isSettingsOpen
//             ? "opacity-100 scale-100 pointer-events-auto"
//             : "opacity-0 scale-95 pointer-events-none"
//         }
//       `}
//                 style={{ transitionProperty: "opacity, transform" }}
//               >
//                 <Setting />
//               </div>
//             )}
//           </div>

//           {/* MY CITIES pill with dropdown */}
//           <div className="relative" ref={citiesRef}>
//             <button
//               onClick={() => setIsCitiesOpen((v) => !v)}
//               className="flex items-center h-10 rounded-xl pl-4 pr-2
//                bg-[#182434] border border-white/10 backdrop-blur-md shadow-inner
//                transition min-w-[290px]"
//             >
//               <span className="text-[12px] md:text-sm tracking-wide text-white/90">
//                 MY CITIES
//               </span>
//               <div className="ml-auto h-8 w-10 flex items-center justify-center">
//                 <PiDotsSixLight size={40} className="text-white/70" />
//               </div>
//             </button>

//             {isCitiesVisible && citiesBox && (
//               <>
//                 <div
//                   className={`fixed inset-0 z-[58] transition-opacity duration-300 ${
//                     isCitiesOpen
//                       ? "opacity-100"
//                       : "opacity-0 pointer-events-none"
//                   }`}
//                   onClick={() => setIsCitiesOpen(false)}
//                 />
//                 <div
//                   ref={citiesPanelRef}
//                   id="mycities-panel"
//                   className={`fixed z-[60] transition-all duration-300 ease-out ${
//                     isCitiesOpen
//                       ? "opacity-100 translate-y-0 pointer-events-auto"
//                       : "opacity-0 -translate-y-2 pointer-events-none"
//                   }`}

//                 >
//                   <MyCities />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <Cart open={isCartOpen} onClose={() => setIsCartOpen(false)} />
//     </header>
//   );
// };

// export default Navbar;

import React, { useEffect, useState, useRef } from "react";
import { PiDotsSixLight, PiShoppingBag } from "react-icons/pi";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import Cart from "../common/Cart";
import Setting from "../common/Setting";
import MyCities from "../common/MyCities";
import { useProductCart } from "../context/ProductCartContext";
import { RiShoppingBagLine } from "react-icons/ri";
import citiesData from "../data/mycityData.json"; // import flags from JSON

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [isCitiesVisible, setIsCitiesVisible] = useState(false);

  const { items } = useProductCart();
  const cartRef = useRef(null);
  const settingsRef = useRef(null);
  const citiesRef = useRef(null);
  const citiesPanelRef = useRef(null);

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
      ) {
        setIsCartOpen(false);
      }
      if (
        isSettingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
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

  // Sticky navbar styles
  const baseClasses = "left-0 right-0 z-50 px-6 md:px-10 text-white";
  const positionClass = isSticky ? "fixed" : "absolute top-0";
  const bgClass = isSticky
    ? "bg-black/60 backdrop-blur-sm shadow-lg"
    : "bg-transparent";
  const transformStyle = isSticky
    ? showSticky
      ? "translateY(0)"
      : "translateY(-100%)"
    : "translateY(0)";

  return (
    <header
      className={`${positionClass} ${baseClasses} ${bgClass}`}
      style={{ transform: transformStyle, transition: "transform 300ms ease" }}
    >
      <div className="flex items-center py-4 md:py-6 justify-between max-w-7xl mx-auto h-full">
        {/* Left Section */}
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

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="flex gap-2 items-center" ref={cartRef}>
            <p className="text-xs text-gray-500 hidden md:block">Cart</p>
            <div className="relative">
              <button
                aria-label="cart"
                onClick={() => setIsCartOpen(true)}
                className="hover:opacity-80 transition"
              >
                <PiShoppingBag size={24} />
              </button>
              {items.length > 0 && (
                <span className="absolute -top-0 -right-0 h-2 w-2 rounded-full bg-[#5695F5]" />
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              aria-label="settings"
              onClick={() => setIsSettingsOpen((v) => !v)}
              className={`h-10 w-12 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-black/20 flex items-center justify-center transition ${
                isSettingsOpen ? "" : "bg-[#182434] hover:bg-white/10"
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

          {/* MY CITIES Button - Expandable Overlay */}
          <div className="relative inline-block" ref={citiesRef}>
            <button
              onClick={() => setIsCitiesOpen((v) => !v)}
              className="flex items-center h-10 px-4 min-w-[290px] rounded-xl
             bg-[#182434] border border-white/10 backdrop-blur-md shadow-inner transition"
            >
              <span className="text-[12px] md:text-sm tracking-wide text-white/90 flex-1 text-left">
                MY CITIES
              </span>

              {/* Custom 6-dot grid */}
              <div className="ml-auto h-8 w-10 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-[3px]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[5px] h-[5px] bg-white/70 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </button>

            {/* Expanded overlay panel */}
            {isCitiesVisible && (
              <>
                {/* Backdrop */}
                <div
                  className={`fixed inset-0 z-[58] transition-opacity duration-300 ${
                    isCitiesOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => setIsCitiesOpen(false)}
                />

                {/* Expanded content panel */}
                <div
                  className={`absolute top-0 left-0 z-[60] w-[290px] bg-[#182434] border border-white/10 
                             backdrop-blur-md shadow-inner rounded-xl overflow-hidden
                             transition-all duration-500 ease-out transform-gpu
                             ${
                               isCitiesOpen
                                 ? "h-[320px] opacity-100 scale-100 pointer-events-auto"
                                 : "h-10 opacity-0 scale-95 pointer-events-none"
                             }`}
                >
                  {/* Header with transformed icons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center h-10 px-4 gap-2  w-full">
                      <p className="text-[12px] md:text-sm  text-white/90 ">
                        MY CITIES
                      </p>
                      <RiShoppingBagLine size={18} />
                    </div>
                    <div className="ml-auto h-8 w-10 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-[3px]">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const isTriangleDot = [1, 3, 5].includes(i); // triangle pattern
                          const colorClass = isCitiesOpen
                            ? isTriangleDot
                              ? "bg-white"
                              : "bg-white/30"
                            : "bg-white/70"; // default color when closed

                          return (
                            <div
                              key={i}
                              className={`w-[5px] h-[5px] rounded-full transition-all duration-500 ease-in-out ${colorClass}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content with staggered animation */}
                  <div
                    className={`transition-all duration-400 delay-100 ease-out overflow-hidden ${
                      isCitiesOpen
                        ? "max-h-[270px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {/* Cities Section Header */}
                    <div className="px-4 py-3 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70 uppercase tracking-wide">
                          MY CITIES
                        </span>
                        <button className="flex text-white px-8 py-3 rounded-full items-center gap-1 text-sm bg-[#5695F5]  transition">
                          <span className="text-xs">+</span>
                          Add New
                        </button>
                      </div>
                    </div>

                    {/* Cities List with staggered entrance */}
                    <div className="px-4 pb-4 space-y-3">
                      {citiesData.map((city) => (
                        <div
                          key={city.id}
                          className={`flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10
                                      transition-all duration-300 delay-200 ${
                                        isCitiesOpen
                                          ? "opacity-100 translate-y-0"
                                          : "opacity-0 translate-y-2"
                                      }`}
                        >
                          {/* Flag FIRST (from JSON) */}
                          <div className="flex items-center gap-2">
                            <img
                              src={city.flagImg}
                              alt={`${city.name} flag`}
                              className="w-8 h-6  object-cover"
                              loading="lazy"
                            />
                            {/* You can add more city fields here later */}
                            <span className="text-white/90 font-medium">
                              {city.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Cart open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Navbar;
