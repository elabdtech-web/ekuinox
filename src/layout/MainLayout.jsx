import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="relative bg-gradient-to-b min-h-screen from-[#061428] via-[#0d2740] to-[#071026]">

      <Navbar />

      <main className="">{children}</main>

      <Footer />
    </div>
  );
}
