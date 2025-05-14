import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(null);
  const [inventoryCount, setInventoryCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [userRes, inventoryRes] = await Promise.all([
          axios.get('/api/admin/user-count', { withCredentials: true }),
          axios.get('/api/admin/inventory-count', { withCredentials: true }),
        ]);
        setUserCount(userRes.data.totalUsers);
        setInventoryCount(inventoryRes.data.totalInventories);
      } catch (err) {
        setError('Failed to fetch counts.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{userCount}</p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Inventories</h3>
            <p className="text-3xl font-bold text-green-600">{inventoryCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
