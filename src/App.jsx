import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import MainLayout from "./layout/MainLayout";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import StoryPage from "./Pages/StoryPage";
import Checkout from "./Pages/Checkout";
import { CityCartProvider } from "./context/CityCartContext";
import { ProductCartProvider } from "./context/ProductCartContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Components
import AdminLogin from "./admin/pages/AdminLogin";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageProducts from "./admin/pages/ManageProducts";
import AddProduct from "./admin/pages/AddProduct";
import ManageCountries from "./admin/pages/ManageCountries";
import ManageCities from "./admin/pages/ManageCities";
import Settings from "./admin/pages/Settings";

const App = () => {
  // Splash loader shown for a few seconds on first visit before any page renders
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2500); // show for ~2.5s
    return () => clearTimeout(t);
  }, []);

  return (
    <AuthProvider>
      <CityCartProvider>
        <ProductCartProvider>
          <Router>
            {showSplash ? (
              <Loader />
            ) : (
              <>
                <ScrollToTop behavior="auto" />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Admin Login Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                      <ProtectedRoute adminOnly={true}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="add-product" element={<AddProduct />} />
                    <Route path="countries" element={<ManageCountries />} />
                    <Route path="cities" element={<ManageCities />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </>
            )}
          </Router>
        </ProductCartProvider>
      </CityCartProvider>
    </AuthProvider>
  );
};

export default App;
