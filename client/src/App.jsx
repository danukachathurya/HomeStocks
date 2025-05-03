import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

import AdminDashboard from './pages/AdminDashboard';
import InventoryManagerDashboard from './pages/InventoryManagerDashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import UserDashboard from './pages/UserDashboard';

import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import AddProduct from "./pages/AddProduct";
import Product from "./pages/Product";
import DisposalItems from "./pages/DisposalItems";
import DisposeDetails from "./pages/DisposeDetails";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={['inventoryManager']}>
            <InventoryManagerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/supplier" element={
          <ProtectedRoute allowedRoles={['supplier']}>
            <SupplierDashboard />
          </ProtectedRoute>
        } />

        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<h1 className="text-center mt-10 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
