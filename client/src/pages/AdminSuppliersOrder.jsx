import { useEffect, useState } from "react";

export default function AdminSuppliersOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [quantities, setQuantities] = useState({}); // Track selected quantities

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/supplier-orders", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.supplies || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const handleAddToSystem = async (supplyId, maxQuantity) => {
    const quantity = quantities[supplyId] || 1;

    if (quantity > maxQuantity || quantity < 1) {
      alert("Invalid quantity selected.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/add-to-system/${supplyId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add item.");

      setSuccessMessage(data.message);
      fetchOrders(); // Refresh the table

      // Hide message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading supplier orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="overflow-x-auto">
      {successMessage && (
        <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded mb-4 transition-opacity duration-500">
          {successMessage}
        </div>
      )}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">Item</th>
            <th className="py-2 px-4">Supplier</th>
            <th className="py-2 px-4">Purchase Date</th>
            <th className="py-2 px-4">Expiry Date</th>
            <th className="py-2 px-4">Max Qty</th>
            <th className="py-2 px-4">Select Qty</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t border-gray-300">
              <td className="py-2 px-4">{order.itemName}</td>
              <td className="py-2 px-4">{order.supplierName}</td>
              <td className="py-2 px-4">
                {new Date(order.purchaseDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">
                {new Date(order.expiryDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">{order.quantity}</td>
              <td className="py-2 px-4">
                <select
                  value={quantities[order._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(order._id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  {Array.from({ length: order.quantity }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleAddToSystem(order._id, order.quantity)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add to System
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
