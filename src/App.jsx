import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./Pages/Home";
// import other pages as needed
// import About from "./Pages/About";
// import Product from "./Pages/Product";

const App = () => {
  return (
    <Router>
   
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/product" element={<Product />} /> */}
          {/* Add more routes as needed */}
        </Routes>
   
    </Router>
  );
};

export default App;
