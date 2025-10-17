import React from "react";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        height: "350px", // Figma height
        background:
          "linear-gradient(180deg, rgba(12,18,32,1) 0%, rgba(86,149,245,1) 100%)", // your bg
      }}
    >
      {/* content width constrained to Figma 1440px */}
      <div
        className="mx-auto h-full flex flex-col justify-between"
        style={{ width: "1440px", maxWidth: "100%" }}
      >
        {/* top content */}
        <div className="container flex mt-12 flex-col md:flex-row md:justify-between md:items-start gap-10 pt-10">
          {/* Left: Logo and tagline */}
          <div>
            <div className="text-2xl font-bold text-[#5695F5]">EKUINOX</div>
            <div className="mt-2 text-xs text-white/80 max-w-[180px]">
              Crafted for those who move with time.
            </div>
          </div>

          {/* Columns */}
          <div className="flex flex-1 justify-center gap-16">
            <div>
              <div className="text-[10px] tracking-wide font-semibold text-white/60 mb-2">
                GENERAL
              </div>
              <ul className="space-y-1 text-sm text-white/90">
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
              <div className="text-[10px] tracking-wide font-semibold text-white/60 mb-2">
                SOCIALS
              </div>
              <ul className="space-y-1 text-sm text-white/90">
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
              <div className="text-[10px] tracking-wide font-semibold text-white/60 mb-2">
                OTHERS
              </div>
              <ul className="space-y-1 text-sm text-white/90">
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
          <div className="bg-white/10 text-white/70 rounded-full px-6 py-2 text-xs backdrop-blur-sm">
            Copyright© {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}



