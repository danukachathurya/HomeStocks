import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import InventoryManagerDashboard from "./pages/InventoryManagerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import UserDashboard from "./pages/UserDashboard";

import ScrollToTop from "./components/ScrollToTop";

import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory-dashboard"
          element={
            <ProtectedRoute allowedRoles={["inventoryManager"]}>
              <InventoryManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier-dashboard"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-3xl">404 - Page Not Found</h1>
          }
        />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<h1 className="text-center mt-10 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  ); 
}
