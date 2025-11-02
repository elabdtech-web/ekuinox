import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./Pages/Home";
import Product from "./Pages/Product";
import StoryPage from "./Pages/StoryPage";
import { CityCartProvider } from "./context/CityCartContext";
import { ProductCartProvider } from "./context/ProductCartContext";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Components
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageProducts from "./admin/pages/ManageProducts";
import AddProduct from "./admin/pages/AddProduct";
import ManageCountries from "./admin/pages/ManageCountries";
import ManageCities from "./admin/pages/ManageCities";
import Settings from "./admin/pages/Settings";

const App = () => {
  return (
    <AuthProvider>
      <CityCartProvider>
        <ProductCartProvider>
          <Router>
            <ScrollToTop behavior="auto" />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/product" element={<Product />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
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
          </Router>
        </ProductCartProvider>
      </CityCartProvider>
    </AuthProvider>
  );
};

export default App;
