import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full bg-gradient-to-b from-[#0C1220] to-[#5695F5]/50 text-white py-10"
      
    >
      {/* content width constrained to Figma 1440px */}
      <div
        className="w-full max-w-[1440px] mx-auto mt-20 mb-0 h-[450px] overflow-hidden flex flex-col justify-between"
      >
        {/* top content */}
        <div className="container flex mt-12 flex-col md:flex-row md:justify-between md:items-start gap-10 pt-10">
          {/* Left: Logo and tagline */}
          <div className="w-1/4">
            <div className="text-5xl font-medium text-[#5695F5]">EKUINOX</div>
            <div className="mt-2 text-base text-white/80 max-w-[180px]">
              Crafted for those who move with time.
            </div>
          </div>

          {/* Columns */}
          <div className="flex flex-1 justify-start gap-16 w-3/4">
            <div>
              <div className="text-base tracking-wide  text-white/60 mb-2">
                GENERAL
              </div>
              <ul className="space-y-3 text-base text-white/90">
                <li>
                  <a href="#" className="hover:underline">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-base tracking-wide text-white/60 mb-2">
                SOCIALS
              </div>
              <ul className="space-y-3 text-base text-white/90">
                <li>
                  <a href="#" className="hover:underline">
                    X
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Shopify
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-base tracking-wide text-white/60 mb-2">
                OTHERS
              </div>
              <ul className="space-y-3 text-base text-white/90">
                <li>
                  <a href="#" className="hover:underline">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright pill */}
        <div className="flex justify-center pb-6">
          <div className="bg-white/10 text-white/70 w-68 text-center rounded-full px-6 py-2 text-xl backdrop-blur-sm">
            Copyright© {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}



