import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(null);
  const [supplyCount, setSupplyCount] = useState(null);
  const [productCount, setProductCount] = useState(null); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, inventoryRes, supplyRes, productRes] =
          await Promise.all([
            axios.get("/api/admin/user-count", { withCredentials: true }),
            axios.get("/api/admin/inventory-count", { withCredentials: true }),
            axios.get("/api/admin/supply-count", { withCredentials: true }),
            axios.get("/api/admin/product-count", { withCredentials: true }), // ✅ NEW
          ]);

        setUserCount(userRes.data.totalUsers);
        setInventoryCount(inventoryRes.data.totalInventories);
        setSupplyCount(supplyRes.data.totalSupplies);
        setProductCount(productRes.data.totalProducts); // ✅ NEW
      } catch (err) {
        console.error(err);
        setError("Failed to fetch counts.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        📊 Admin Dashboard Overview
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 text-lg animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              👥 Total Users
            </h3>
            <p className="text-4xl font-extrabold text-blue-600">{userCount}</p>
          </div>

          {/* Total Inventories */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              📦 Total Inventories
            </h3>
            <p className="text-4xl font-extrabold text-green-600">
              {inventoryCount}
            </p>
          </div>

          {/* Total Supplies */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              🚚 Total Supplies
            </h3>
            <p className="text-4xl font-extrabold text-purple-600">
              {supplyCount}
            </p>
          </div>

          {/* Total Products - will wrap below due to 3-column grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              🛒 Total Products
            </h3>
            <p className="text-4xl font-extrabold text-red-600">
              {productCount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
