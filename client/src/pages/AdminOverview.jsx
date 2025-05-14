import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOverview = () => {
  const [userCount, setUserCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get('/api/admin/user-count', {
          withCredentials: true, // for sending cookie/token
        });
        setUserCount(res.data.totalUsers);
      } catch (err) {
        setError('Failed to fetch user count.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Overview</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{userCount}</p>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
