import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UpcomingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingOrders = async () => {
      try {
        const response = await axios.get('/api/upcoming/upcoming-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching upcoming orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingOrders();
  }, []);

  const handleMarkOrder = async (orderId) => {
    try {
      await axios.put(`/api/upcoming/mark/${orderId}`);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, marked: true } : order
        )
      );
    } catch (error) {
      console.error('Error marking order:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upcoming Orders</h2>
      {orders.length === 0 ? (
        <p>No upcoming orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Purchase Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="p-2 border">
                    <img
                      src={order.itemImage}
                      alt={order.itemName}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2 border">{order.itemName}</td>
                  <td className="p-2 border">{order.category}</td>
                  <td className="p-2 border">{order.supplierName}</td>
                  <td className="p-2 border">${order.price}</td>
                  <td className="p-2 border">{order.quantity}</td>
                  <td className="p-2 border">
                    {order.purchaseDate
                      ? new Date(order.purchaseDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="p-2 border">
                    {order.marked ? (
                      <span className="text-green-600 font-semibold">Marked</span>
                    ) : (
                      <span className="text-yellow-600">Pending</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    {!order.marked && (
                      <button
                        onClick={() => handleMarkOrder(order._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Mark
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
