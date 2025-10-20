import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import StoryPage from "./Pages/StoryPage";
// import other pages as needed
// import About from "./Pages/About";

const App = () => {
  return (
    <Router>
   
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/product" element={<Product />} />
          {/* Add more routes as needed */}
        </Routes>
   
    </Router>
  );
};

export default App;
