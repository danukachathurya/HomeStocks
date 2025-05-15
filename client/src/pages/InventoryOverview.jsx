import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InventoryOverview() {
  const [productCount, setProductCount] = useState(0);
  const [upcomingOrdersCount, setUpcomingOrdersCount] = useState(0);
  const [uniqueSupplierCount, setUniqueSupplierCount] = useState(0);
  const [disposalCount, setDisposalCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const productRes = await axios.get('/api/product/count');
        setProductCount(productRes.data.count);

        const ordersRes = await axios.get('/api/upcoming/count');
        setUpcomingOrdersCount(ordersRes.data.count);

        const supplierRes = await axios.get('/api/supply/supplier-count');
        setUniqueSupplierCount(supplierRes.data.count);

        const disposalRes = await axios.get('/api/disposal/count');
        setDisposalCount(disposalRes.data.count);
      } catch (error) {
        console.error('Failed to fetch counts', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <main className="max-w-4xl mx-auto mt-12 px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Inventory Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <div className="text-indigo-600 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <p className="text-sm uppercase tracking-wide font-semibold text-gray-500">
            Total Products
          </p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{productCount}</p>
        </div>

        {/* Upcoming Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <div className="text-green-600 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <p className="text-sm uppercase tracking-wide font-semibold text-gray-500">
            Upcoming Orders
          </p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{upcomingOrdersCount}</p>
        </div>

        {/* Suppliers */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <div className="text-yellow-500 mb-2">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="7" width="18" height="13" rx="2" ry="2" />
              <path d="M7 7V4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3" />
              <path d="M16 7V4a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3" />
              <line x1="12" y1="10" x2="12" y2="20" />
            </svg>
          </div>
          <p className="text-sm uppercase tracking-wide font-semibold text-gray-500">
            Total Suppliers
          </p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{uniqueSupplierCount}</p>
        </div>

        {/* Disposal Items */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <div className="text-red-500 mb-2">
            {/* You can add a trash/disposal icon here */}
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M5 6l1-3h12l1 3" />
            </svg>
          </div>
          <p className="text-sm uppercase tracking-wide font-semibold text-gray-500">
            Disposal Items
          </p>
          <p className="mt-1 text-4xl font-bold text-gray-900">{disposalCount}</p>
        </div>
      </div>
    </main>
  );
}
