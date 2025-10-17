import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen ">

  <Navbar />

  <main className="">{children}</main>

      <Footer />
    </div>
  );
}
