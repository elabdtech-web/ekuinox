import React from "react";
import { PiShoppingBag } from "react-icons/pi";

export default function Navbar() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 bg-transparent text-white"
      style={{ height: "72px" }}
    >
      <div className="container flex items-center  py-4 justify-between h-full">
        <div className="flex items-center gap-16 ">
          <div className="text-xl font-semibold">EKUINOX</div>
          <nav className="hidden md:flex gap-11 text-sm opacity-90">
            <a href="#" className="hover:underline">
              HOME
            </a>
            <a href="#" className="hover:underline">
              PRODUCT
            </a>
            <a href="#" className="hover:underline">
              SHORT STORY
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4 ">
          <p className="text-sm text-gray-600">Cart</p>
          <button aria-label="cart" className="">
            <PiShoppingBag size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}
